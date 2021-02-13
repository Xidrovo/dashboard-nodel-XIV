const express = require('express');
const bodyParser = require('body-parser');
const twitter = require('./TwitterAPI');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/twitter', async (req, res) => {
    const { hashtag, count, until } = req.body;
    const tweets = await twitter.getTweets(hashtag, count, until);
    try {
        res.send(tweets.statuses);
    } catch (error) {
        res.send(error)
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));