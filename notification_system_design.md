# Campus Notifications System Design

This document details the architectural design, database schematics, optimization strategies, and reliability mechanisms for the Campus Notifications Microservice.

---

## Stage 1: API Design and Real-Time Mechanisms

To support a seamless notification experience for students, the platform requires a robust REST API contract and a mechanism for real-time delivery.

### Core REST API Endpoints

1. **Fetch Notifications**
   - **Endpoint:** `GET /api/v1/notifications`
   - **Description:** Retrieves a paginated list of notifications for the authenticated student.
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <JWT_TOKEN>"
     }
     ```
   - **Response (200 OK):**
     ```json
     {
       "data": [
         {
           "id": "notif_8f92a",
           "type": "Placement",
           "message": "Infosys has shortlisted you for the interview round.",
           "isRead": false,
           "createdAt": "2026-05-02T10:00:00Z"
         }
       ],
       "meta": {
         "page": 1,
         "hasMore": true
       }
     }
     ```

2. **Mark Notification as Read**
   - **Endpoint:** `PATCH /api/v1/notifications/:id/read`
   - **Description:** Updates the `isRead` status of a specific notification to true.
   - **Response (200 OK):**
     ```json
     {
       "success": true,
       "message": "Notification marked as read"
     }
     ```

### Real-Time Mechanism

For real-time delivery without requiring the client to aggressively poll the server, I recommend **Server-Sent Events (SSE)**.
Unlike WebSockets, which are fully bidirectional and heavy, SSE operates over standard HTTP, making it much easier to scale, cache, and load-balance. Since notifications are strictly server-to-client (unidirectional), SSE provides the exact real-time push capabilities needed with minimal overhead.

---

## Stage 2: Database Selection and Schema

### Database Selection: PostgreSQL
I strongly suggest a relational database like **PostgreSQL**. Notifications require strict schema adherence (e.g., specific `notificationType` enums), predictable querying, and strict ACID guarantees to ensure messages aren't lost or duplicated. PostgreSQL also provides excellent indexing capabilities which are crucial for read-heavy operations like fetching notifications.

### Database Schema
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    notification_type VARCHAR(20) NOT NULL, -- 'Event', 'Result', 'Placement'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize querying unread notifications for a specific student
CREATE INDEX idx_student_unread ON notifications(student_id, is_read, created_at DESC);
```

### Scaling Challenges & Solutions
As data volume increases to millions of rows, the primary database will face high read and write contention.
**Solutions:**
1. **Read Replicas:** Route all `GET /api/v1/notifications` queries to read-only replica databases to offload stress from the primary write database.
2. **Data Partitioning (Archiving):** Notifications older than 30 days are rarely accessed. We can partition the `notifications` table by date, moving historical data to cold storage (e.g., AWS S3) to keep the active table small and fast.

---

## Stage 3: Query Optimization

### Critique of the Existing Query
```sql
SELECT * FROM notifications 
WHERE studentID = 1042 AND isRead = false 
ORDER BY createdAt DESC;
```
**Why is it slow?**
1. **`SELECT *`**: Fetching every column is inefficient and wastes network bandwidth. We should only select the necessary fields (e.g., `id`, `message`, `type`, `createdAt`).
2. **Missing Composite Index**: Without an index covering `(studentID, isRead, createdAt)`, the database is forced to perform a sequential scan across 5,000,000 rows to find matches and then sort them in memory.

### The "Index Every Column" Fallacy
Adding indexes on *every* column is terrible advice. 
1. **Write Penalty:** Every time a new notification is inserted, the database must update every single index. This severely slows down `INSERT` operations.
2. **Storage Cost:** Indexes consume significant disk space and memory.
Indexes should be applied strategically based strictly on access patterns.

### Optimized Query for Placements in the Last 7 Days
```sql
SELECT id, message, created_at 
FROM notifications 
WHERE notification_type = 'Placement' 
  AND created_at >= NOW() - INTERVAL '7 days';
```
*(Note: A composite index on `(notification_type, created_at)` would make this query extremely fast).*

---

## Stage 4: Performance under High Load

If the database is being overwhelmed because notifications are fetched on *every single page load*, we have an architectural bottleneck.

### Proposed Solution: Caching Layer (Redis)
We should place a **Redis Cache** in front of the database.

**How it works:**
1. When a student logs in, the backend queries the database for their unread notifications and stores the result in Redis with a Time-To-Live (TTL).
2. On subsequent page loads, the backend fetches the notifications directly from Redis (which responds in sub-milliseconds), entirely bypassing the database.
3. When a new notification is generated for the student, the backend invalidates or updates their specific Redis key.

**Trade-offs:**
- **Pros:** Massive reduction in database load; incredibly fast response times for users.
- **Cons:** Introduces "Cache Invalidation" complexity. If the cache isn't updated properly when a new notification arrives, the user sees stale data (Data Inconsistency).

---

## Stage 5: Reliability and the "Notify All" Failure

### Shortcomings of the Existing Pseudocode
The current `notify_all` implementation is a **synchronous loop**. 
If `send_email` takes 1 second per student, notifying 50,000 students will take almost 14 hours! Furthermore, if the script fails midway (as noted in the logs), there is no state tracking. You cannot easily retry without accidentally double-emailing the first half of the list.

### Redesign: Asynchronous Message Queue
Saving to the DB and sending emails should **not** happen simultaneously in the main thread. Emails involve external third-party APIs which are slow and prone to network timeouts.

**Architecture:**
1. The main API inserts the records into the Database.
2. It then publishes a "SendEmailEvent" to a Message Queue (like RabbitMQ, Kafka, or AWS SQS).
3. Background Worker processes consume these events asynchronously and send the emails at their own optimized pace. If a worker fails, the Queue simply retries that specific message.

### Revised Pseudocode
```python
# MAIN API THREAD (Fast and Reliable)
function notify_all_async(student_ids: array, message: string):
    # 1. Bulk insert to DB for high performance
    bulk_save_to_db(student_ids, message)
    
    # 2. Push tasks to Message Queue
    for student_id in student_ids:
        message_queue.publish({
            "task_type": "send_email",
            "student_id": student_id,
            "message": message
        })
        push_to_app(student_id, message) # SSE trigger

# BACKGROUND WORKER PROCESS (Scalable and Resilient)
function on_message_received(task):
    try:
        send_email(task.student_id, task.message)
        message_queue.acknowledge(task) # Mark as done
    except Error:
        message_queue.retry(task) # Safe retry on failure
```

---

## Stage 6: Priority Inbox Algorithm

To implement the Priority Inbox, we need an algorithm that scores notifications based on a combination of their inherent weight and a time-decay factor (recency), then sorts them to find the top `n`.

**Logic:**
- `Placement` = Weight 3
- `Result` = Weight 2
- `Event` = Weight 1
- **Time Decay:** We deduct points based on how old the notification is, ensuring fresh events can outrank older, higher-weight notifications.

### Implementation (JavaScript / Node.js)

```javascript
/**
 * Priority Inbox Sorting Algorithm
 * Sorts notifications based on weighted importance and time decay.
 */
function getTopPriorityNotifications(notifications, n = 10) {
    const WEIGHTS = {
        'Placement': 300,
        'Result': 200,
        'Event': 100
    };

    const now = Date.now();
    const MS_IN_HOUR = 1000 * 60 * 60;

    // Calculate dynamic scores for each notification
    const scoredNotifications = notifications.map(notif => {
        const baseWeight = WEIGHTS[notif.type] || 0;
        
        // Calculate age in hours
        const ageHours = (now - new Date(notif.createdAt).getTime()) / MS_IN_HOUR;
        
        // Time decay: Lose 2 points per hour of age
        const timeDecayPenalty = ageHours * 2;
        
        // Final score (minimum score is 0 to avoid negative priorities)
        const finalScore = Math.max(0, baseWeight - timeDecayPenalty);

        return {
            ...notif,
            score: finalScore
        };
    });

    // Sort descending by score
    scoredNotifications.sort((a, b) => b.score - a.score);

    // Return only the top 'n'
    return scoredNotifications.slice(0, n);
}

// Example Usage:
// const priorityInbox = getTopPriorityNotifications(unreadNotifs, 10);
```
