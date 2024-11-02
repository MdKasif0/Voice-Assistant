let recognition;
let transcript = '';
let isRecognizing = false;
let speechSynthesisActive = false;

// Initialize speech recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
        document.getElementById('status').innerText = 'Listening...';
        console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
        transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Transcript:', transcript);
        document.getElementById('output').innerText = transcript || 'No speech detected. Please try again.';
        executeCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Speech recognition error: ' + event.error);
        isRecognizing = false;
        document.getElementById('status').innerText = 'Error occurred';
    };

    recognition.onend = () => {
        isRecognizing = false;
        document.getElementById('status').innerText = 'Ready to listen';
        console.log('Speech recognition ended');
    };
    
} else {
    alert('Speech recognition not supported on this browser.');
}

// Start button event listener
document.getElementById('startBtn').addEventListener('click', () => {
    if (recognition && !isRecognizing) {
        // Stop any ongoing speech synthesis before starting recognition
        if (speechSynthesis.speaking || speechSynthesisActive) {
            speechSynthesis.cancel();
            speechSynthesisActive = false;
        }

        transcript = '';
        document.getElementById('output').innerText = 'Listening...';
        recognition.start();
    }
});

// Command handler
function executeCommand(command) {
    if (command.includes('open youtube')) {
        if (command.includes('open youtube and search')) {
            const channelName = command.replace('open youtube and search', '').trim();
            if (channelName) {
                speak(`Searching the channel ${channelName}`);
                window.open(`https://youtube.com/search?q=${encodeURIComponent(channelName)}`, '_blank');
            } else {
                speak("Please specify the channel name.");
            }
            
        } else if (command.includes('open youtube')) {
            speak('Opening YouTube');
            window.open('https://www.youtube.com', '_blank');
            
        } else {
            speak("Speak with correct pronunciation");
        }
        
    } else if (command.includes('tell me a joke')) {
        tellJoke(); // Calls the joke function from joke.js
        
    } else if (command.includes('search google for')) {
        const searchQuery = command.replace('search google for', '').trim();
        speak(`Searching Google for ${searchQuery}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        
    } else if (command.includes('play the song')) {
        const songName = command.replace('play the song', '').trim();
        if (songName) {
            speak(`Playing the song ${songName}`);
            window.open(`https://music.youtube.com/search?q=${encodeURIComponent(songName)}`, '_blank');
        } else {
            speak("Please specify the song name.");
        }
        
    } else if (command.includes('get the weather')) {
        getWeather(); // Calls the weather function from weather.js
        
    } else if (command.includes('what is the weather of')) {
        const city = command.replace('what is the weather of', '').trim();
        getWeather(city); // Calls weather function with city name
        
    } else if (command.includes('what is the latest news')) {
        getNews(); // Calls the news function from news.js
        
    } else if (command.includes('what time is it')) {
        const currentTime = new Date().toLocaleTimeString();
        document.getElementById('output').innerText = `The current time is ${currentTime}`;
        speak(`The current time is ${currentTime}`);
        
    } else if (command.includes('open gmail')) {
        speak('Opening Gmail');
        window.open('https://mail.google.com', '_blank');
        
    } else if (command.includes('add reminder')) {
        const reminderText = command.replace('add reminder', '').trim();
        document.getElementById('output').innerText = `Reminder set: ${reminderText}`;
        speak(`Reminder set: ${reminderText}`);
        
    } else if (command.includes('display a image of cat')) {
        fetchCatImage();
        
    } else if (command.includes('display a image of')) {
        const query = command.replace('display a image of', '').trim();
        fetchUnsplashImage(query);
        
    } else if (command.includes('generate a image')) {
        const prompt = command.replace('generate a image', '').trim();
        if (prompt) {
            speak(`Generating an image ${prompt}`);
            generateImage(prompt);
        } else {
            speak("Please specify what image you'd like to generate.");
        }
        
    } else if (command.includes('gemini')) {
        const query = command.replace('gemini', '').trim();
        askGroq(query);
        
    } else {
        document.getElementById('output').innerText = 'Command not recognized. Please try again.';
        speak('Command not recognized. Please try again.');
    }
}

// Speech synthesis function with active check
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesisActive = true;
    utterance.onend = () => {
        speechSynthesisActive = false;
    };

    window.speechSynthesis.speak(utterance);
}

// Dark mode toggle functionality
const themeToggleButton = document.getElementById('theme-toggle');
const enableDarkMode = () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
};

const disableDarkMode = () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
};

themeToggleButton.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Initial display logo
window.onload = function() {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `
        <img src="logo.png" alt="Logo" class="generated-image" />
    `;
};

// Download image function
function downloadImage(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}