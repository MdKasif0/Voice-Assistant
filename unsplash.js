// unsplash.js
async function fetchUnsplashImage(query = "nature") {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = "Loading Unsplash image...";

    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=ezcuIbwfXHGqrFq5acwukBZgRzSdjw4AToe66Yh6H4I`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const unsplashImageUrl = data.urls.regular;

        displayImage(unsplashImageUrl);
    } catch (error) {
        console.error("Failed to fetch Unsplash image:", error);
        imageContainer.innerHTML = "Failed to fetch image from Unsplash.";
    }
}

function displayImage(url) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `
        <img src="${url}" alt="Unsplash Image" class="generated-image" />
        <button id="downloadButton" onclick="downloadImage('${url}')">Download Image</button>
    `;
}