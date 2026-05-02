# Scalable Notification System Design

This document outlines the architecture and data flow for our scalable notification backend. The goal is to design a system that can reliably send emails, SMS, and push notifications to users without blocking the main application thread or losing messages during high traffic spikes.

## 🏗️ High-Level Architecture

I've chosen an event-driven, microservices-oriented approach. By decoupling the core business logic from the notification delivery mechanism, we ensure that the system remains responsive even if a third-party provider (like SendGrid or Twilio) experiences downtime.

```mermaid
graph TD
    %% Define styles for components
    classDef client fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef api fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef queue fill:#f39c12,stroke:#d35400,stroke-width:2px,color:#fff;
    classDef worker fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff;
    classDef db fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff;
    classDef external fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:#fff;

    Client["📱 Client App (Web/Mobile)"]:::client
    API["🟢 API Gateway (Node.js/Express)"]:::api
    NotificationSvc["⚙️ Notification Service"]:::api
    
    Queue["📨 Message Queue (Redis/RabbitMQ)"]:::queue
    
    EmailWorker["✉️ Email Worker"]:::worker
    SMSWorker["💬 SMS Worker"]:::worker
    PushWorker["🔔 Push Worker"]:::worker
    
    DB[("🗄️ Database (PostgreSQL/MongoDB)")]:::db
    
    SendGrid["📧 SendGrid API"]:::external
    Twilio["📲 Twilio API"]:::external
    FCM["☁️ Firebase Cloud Messaging"]:::external

    %% Connections
    Client -- "Triggers Event (e.g., Signup)" --> API
    API -- "POST /notify" --> NotificationSvc
    NotificationSvc -- "Save Audit Log" --> DB
    NotificationSvc -- "Publish Message" --> Queue
    
    Queue -- "Consume Message" --> EmailWorker
    Queue -- "Consume Message" --> SMSWorker
    Queue -- "Consume Message" --> PushWorker
    
    EmailWorker -- "Send via SMTP/API" --> SendGrid
    SMSWorker -- "Send SMS" --> Twilio
    PushWorker -- "Send Push" --> FCM
    
    EmailWorker -. "Update Status (Sent/Failed)" .-> DB
    SMSWorker -. "Update Status" .-> DB
    PushWorker -. "Update Status" .-> DB
```

### Component Breakdown

1.  **API Gateway & Notification Service:** This Node.js/Express application receives requests from client applications or other internal microservices. It validates the payload, logs the initial intent to the database, and pushes the job to a queue. It returns a `202 Accepted` response immediately.
2.  **Message Queue:** The backbone of our asynchronous processing. Using Redis (via BullMQ) or RabbitMQ ensures that sudden bursts of notification requests are buffered and processed at a steady rate.
3.  **Workers:** Independent Node.js processes that subscribe to specific queue channels (e.g., `email_queue`, `sms_queue`). They handle the actual network calls to external providers. If a call fails due to a network blip, the worker can automatically retry the job with exponential backoff.
4.  **Database:** Stores user preferences (e.g., "opt-out of marketing SMS") and an audit trail of every notification attempt for analytics and debugging.

## 🔄 Data Flow Diagram

Here is a sequence diagram detailing the lifecycle of a single notification request.

```mermaid
sequenceDiagram
    participant User
    participant App as Core Application
    participant API as Notification API
    participant Queue as Message Queue
    participant Worker as Notification Worker
    participant Provider as 3rd Party (e.g., Twilio)
    participant DB as Database

    User->>App: Performs action (e.g., Payment)
    App->>API: POST /api/v1/notifications
    Note right of API: Payload: { userId, type: "sms", message: "..." }
    
    API->>DB: Insert record (Status: "Pending")
    API->>Queue: Push Job to "sms_queue"
    API-->>App: 202 Accepted (Job ID)
    
    Note over Worker,Queue: Worker constantly polls/listens
    Queue-->>Worker: Deliver Job
    
    Worker->>Provider: Send SMS via API
    
    alt Success
        Provider-->>Worker: 200 OK (Message ID)
        Worker->>DB: Update record (Status: "Sent")
    else Failure (e.g., Rate Limited)
        Provider-->>Worker: 429 Too Many Requests
        Worker->>Worker: Apply Exponential Backoff
        Worker->>Queue: Re-queue Job for later
        Worker->>DB: Update record (Status: "Failed/Retrying")
    end
```

## 🧠 Key Architectural Decisions

*   **Why a Message Queue?** If we attempt to send emails synchronously within the HTTP request cycle, a slow response from SendGrid would cause our API to hang, leading to poor user experience and potential timeouts. The queue acts as a shock absorber.
*   **Idempotency:** The worker processes are designed to be idempotent. If a worker crashes right after sending an email but before updating the database, the queue might re-deliver the job. The system should check the database to see if a notification with that specific `jobId` was already marked as "Sent" before attempting delivery again.
*   **Rate Limiting & Retries:** External providers strictly rate-limit API calls. The workers gracefully handle `429 Too Many Requests` responses by placing the job back in the queue with a delay, ensuring we don't drop messages.
