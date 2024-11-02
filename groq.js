// groq.js - Separate script for handling Groq API requests

async function askGroq(query) {
    const responseDiv = document.getElementById("output");
    
    if (!query.trim()) {
        responseDiv.innerText = "Please enter a question.";
        return;
    }

    responseDiv.innerText = "Loading...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gemma-7b-it",
                messages: [
                    { role: "user", content: query }
                ]
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Error Details:", JSON.stringify(errorDetails, null, 2));
            throw new Error(`API Error: ${errorDetails.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            responseDiv.innerText = data.choices[0].message.content;
            speak(data.choices[0].message.content); // Convert response to speech
        } else {
            responseDiv.innerText = "No response found. Please try a different question.";
        }
    } catch (error) {
        responseDiv.innerText = "Error: " + error.message;
        console.error("Detailed Error:", error);
    }
}