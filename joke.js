function tellJoke() {
    axios.get('https://official-joke-api.appspot.com/jokes/random')
        .then(response => {
            const joke = `${response.data.setup} ... ${response.data.punchline}`;
            document.getElementById('output').innerText = joke;
            speak(joke);
        })
        .catch(error => {
            document.getElementById('output').innerText = 'Unable to fetch a joke at the moment. Try again later.';
            speak('Unable to fetch a joke at the moment. Try again later.');
        });
}