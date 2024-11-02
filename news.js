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