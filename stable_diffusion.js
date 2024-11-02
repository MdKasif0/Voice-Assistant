// stable_diffusion.js

const apiKey = "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";
const modelUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

async function generateImage(prompt) {
    document.getElementById("output").innerText = `Generating an image ${prompt}`;
    document.getElementById("status").innerText = "Status: Generating image...";
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading";
    loadingIndicator.innerText = "Generating image...";
    document.getElementById("imageContainer").appendChild(loadingIndicator);

    const response = await fetch(modelUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
    });

    const result = await response.blob();
    const imageUrl = URL.createObjectURL(result);
    
    document.getElementById("loading").remove();
    displayGeneratedImage(imageUrl);
}

function displayGeneratedImage(imageUrl) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image" class="generated-image" />`;
}