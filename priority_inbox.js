/**
 * Stage 6: Priority Inbox Implementation
 * Fetches notifications from the protected Affordmed API and calculates the Top 10 Priority Notifications.
 * 
 * Usage: 
 * node priority_inbox.js <YOUR_BEARER_TOKEN>
 */

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';

const WEIGHTS = {
    'Placement': 300,
    'Result': 200,
    'Event': 100
};

// We calculate time decay based on hours elapsed since the timestamp
function calculateScore(notification) {
    const baseWeight = WEIGHTS[notification.Type] || 0;
    
    // Parse the custom timestamp format: "2026-04-22 17:51:30"
    // Assuming UTC for calculation consistency
    const timestampStr = notification.Timestamp.replace(' ', 'T') + 'Z';
    const notifDate = new Date(timestampStr);
    
    // Since this is a test, if the timestamp is in the future, age is 0.
    const now = Date.now();
    const ageMs = Math.max(0, now - notifDate.getTime());
    
    const ageHours = ageMs / (1000 * 60 * 60);
    const timeDecayPenalty = ageHours * 2; // Lose 2 points per hour
    
    return Math.max(0, baseWeight - timeDecayPenalty);
}

async function fetchAndSortNotifications(token) {
    console.log("Fetching notifications from API...\n");
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        console.log(`Successfully fetched ${notifications.length} notifications.\n`);

        // Calculate scores
        const scoredNotifs = notifications.map(n => ({
            ...n,
            Score: calculateScore(n)
        }));

        // Sort descending by score
        scoredNotifs.sort((a, b) => b.Score - a.Score);

        // Get Top 10
        const top10 = scoredNotifs.slice(0, 10);

        console.log("🏆 TOP 10 PRIORITY INBOX 🏆");
        console.log("==================================================");
        top10.forEach((notif, index) => {
            console.log(`#${index + 1} | Type: ${notif.Type.padEnd(10)} | Score: ${notif.Score.toFixed(2)}`);
            console.log(`    Message: ${notif.Message}`);
            console.log(`    Time:    ${notif.Timestamp}`);
            console.log("--------------------------------------------------");
        });

        console.log("\n✅ Take a screenshot of this output for your GitHub submission!");

    } catch (error) {
        console.error("Failed to fetch priority notifications:", error.message);
        console.log("Please ensure you passed a valid Bearer token as an argument.");
    }
}

// Execution
const token = process.argv[2];
if (!token) {
    console.log("❌ Missing Token!");
    console.log("Usage: node priority_inbox.js YOUR_ACCESS_TOKEN");
    process.exit(1);
}

fetchAndSortNotifications(token);
