// ==============================================================
// ⚠️ FILL IN YOUR DETAILS BELOW BEFORE RUNNING THIS SCRIPT
// ==============================================================
const MY_DETAILS = {
    email: "nj7423@srmist.edu.in",
    name: "Naisha Jain",                                 // Replace if needed
    mobileNo: "8667449544",                  // Replace this
    githubUsername: "Naishaj16",                    // Replace if needed
    rollNo: "RA2311030020131",                      // Replace if needed
    accessCode: "QkbpxH"                  // Replace this!
};

// ==============================================================
// DO NOT EDIT BELOW THIS LINE
// ==============================================================

async function getCredentials() {
    console.log("⏳ Step 1: Registering to get Client ID & Secret...");
    
    try {
        // Step 1: Registration
        const regResponse = await fetch("http://20.207.122.201/evaluation-service/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(MY_DETAILS)
        });

        const regData = await regResponse.json();
        
        if (!regResponse.ok) {
            console.error("❌ Registration Failed!", regData);
            return;
        }

        console.log("✅ Registration Successful!");
        console.log("🔑 Client ID:", regData.clientID);
        console.log("🔑 Client Secret:", regData.clientSecret);
        
        // Step 2: Authentication
        console.log("\n⏳ Step 2: Getting Authorization Token...");
        
        const authPayload = {
            email: MY_DETAILS.email,
            name: MY_DETAILS.name,
            rollNo: MY_DETAILS.rollNo,
            accessCode: MY_DETAILS.accessCode,
            clientID: regData.clientID,
            clientSecret: regData.clientSecret
        };

        const authResponse = await fetch("http://20.207.122.201/evaluation-service/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authPayload)
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            console.error("❌ Authentication Failed!", authData);
            return;
        }

        console.log("✅ Authentication Successful!");
        console.log("\n🎉 YOUR ACCESS TOKEN (Save this!):\n");
        console.log(authData.access_token);
        console.log("\n==============================================================");

    } catch (error) {
        console.error("❌ Network Error:", error.message);
        console.log("Make sure you are connected to the internet and the server is not blocked by your college network/firewall.");
    }
}

getCredentials();
