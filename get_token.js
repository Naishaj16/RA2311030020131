


const MY_DETAILS = {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
};

const API_BASE = process.env.AFFORDMED_API_BASE || "http://20.207.122.201/evaluation-service";

async function getCredentials() {
    console.log("Getting Authorization Token directly...");
    try {
        const authResponse = await fetch(`${API_BASE}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(MY_DETAILS)
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            console.error("Authentication Failed!", authData);
            return;
        }

        console.log("Authentication Successful!");
        console.log("\nYOUR ACCESS TOKEN (Save this!):\n");
        console.log(authData.access_token);
        console.log("\n==============================================================");

    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

getCredentials();
