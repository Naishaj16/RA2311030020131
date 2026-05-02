


const MY_DETAILS = {
    email: "nj7423@srmist.edu.in",
    name: "naisha jain",
    rollNo: "ra2311030020131",
    accessCode: "QkbpxH",
    clientID: "be455001-cc06-4e78-b46d-a4a4fc1e7b71",
    clientSecret: "ypFPUTncvrHDUspw"
};

async function getCredentials() {
    console.log("⏳ Getting Authorization Token directly...");
    try {
        const authResponse = await fetch("http://20.207.122.201/evaluation-service/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(MY_DETAILS)
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
    }
}

getCredentials();
