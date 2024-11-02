function getWeather(city = '') {
    const apiKey = '9478ff50172fe8457d7532be7ac8aa67';

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