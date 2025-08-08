import React, { useEffect } from 'react'

const GoogleLogin = () => {
    async function handleCredentialResponse(response) {
        // response.credential is the id_token
        // ✅ Correct property name
        const idToken = response.credential;
        
        // 1. Log the whole object
        console.log("Google raw response:", response);

        // 2. Log token separately
        console.log("ID Token:", idToken);

        // 3. (Optional) Decode the JWT on frontend to inspect its contents
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        console.log("Decoded ID Token payload:", payload);

        // try {
        //     const res = await fetch("/api/auth/google/", {
        //         method: POST,
        //         headers: {"Content-Type": "application/json"},
        //         body: JSON.stringify({id_token: idToken})
        //     })
        // } catch (error) {
            
        // }
    }

    useEffect(() => {
        const clientId = process.env.VITE_GOOGLE_CLIENT_ID;
        // global google

        if (!window.google || clientId) return;

        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
        });

        // Render the Google Sign-In button
        google.accounts.id.renderButton(
            document.getElementById("g_id_signin"),
            { theme: "outline", size: "large" }
        )
    }, []);

    return <div id="g_id_signin"></div>;
}