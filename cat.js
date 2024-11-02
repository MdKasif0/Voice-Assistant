// cat.js
async function fetchCatImage() {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = "Loading cat image...";

    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const catImageUrl = data[0].url;
        
        displayImage(catImageUrl);
    } catch (error) {
        console.error("Failed to fetch cat image:", error);
        imageContainer.innerHTML = "Failed to fetch image from Cat API.";
    }
}

function displayImage(url) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `
        <img src="${url}" alt="Cat Image" class="generated-image" />
        <button id="downloadButton" onclick="downloadImage('${url}')">Download Image</button>
    `;
}