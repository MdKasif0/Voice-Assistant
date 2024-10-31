let recognition;
let transcript = '';
let isRecognizing = false;

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

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
    if (recognition && !isRecognizing) {
        transcript = '';
        document.getElementById('output').innerText = 'Listening...';
        recognition.start();
    }
});

// Command handler with external API integrations
function executeCommand(command) {
    if (command.includes('open youtube')) {
        speak('Opening YouTube');
        window.open('https://www.youtube.com', '_blank');
    } else if (command.includes('search google for')) {
        const searchQuery = command.replace('search google for', '').trim();
        speak(`Searching Google for ${searchQuery}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    } else if (command.includes('get the weather')) {
        getWeather();  // Get weather for the current location
    } else if (command.includes('weather of')) {
        const city = command.replace('what is the weather of', '').trim();
        getWeather(city);  // Get weather for the specified city
    } else if (command.includes('latest news')) {
        getNews();
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
    } else {
        document.getElementById('output').innerText = 'Command not recognized. Please try again.';
        speak('Command not recognized. Please try again.');
    }
}

// Speech synthesis
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// Weather function with optional city name
function getWeather(city = '') {
    const apiKey = '9478ff50172fe8457d7532be7ac8aa67';

    // If a city name is provided, use it; otherwise, use the current location
    if (city) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`)
            .then(response => {
                const temp = response.data.main.temp;
                const desc = response.data.weather[0].description;
                const weatherText = `The temperature in ${city} is ${temp}°C with ${desc}`;
                document.getElementById('output').innerText = weatherText;
                speak(weatherText);
            })
            .catch(error => {
                document.getElementById('output').innerText = 'Unable to fetch weather. Please try another city.';
                speak('Unable to fetch weather. Please try another city.');
            });
    } else {
        // If no city is provided, get weather for current location
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then(response => {
                    const temp = response.data.main.temp;
                    const desc = response.data.weather[0].description;
                    const weatherText = `The temperature is ${temp}°C with ${desc}`;
                    document.getElementById('output').innerText = weatherText;
                    speak(weatherText);
                });
        });
    }
}

// News function using News API
function getNews() {
    const apiKey = 'd0651a67490a4fd290723ac12309757f';
    axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
        .then(response => {
            const articles = response.data.articles.slice(0, 3); // Show top 3 news articles
            let newsText = 'Here are the latest news headlines: ';
            articles.forEach((article, index) => {
                newsText += `Headline ${index + 1}: ${article.title}. `;
            });
            document.getElementById('output').innerText = newsText;
            speak(newsText);
        })
        .catch(error => {
            document.getElementById('output').innerText = 'Unable to fetch news. Please try again later.';
            speak('Unable to fetch news. Please try again later.');
        });
}