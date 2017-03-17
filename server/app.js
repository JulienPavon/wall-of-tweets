const express = require('express');
const path = require('path');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Twit = require('twit');

let twit = new Twit({
    consumer_key: 'xf1XsBeVDlGPm1O2LLitYSSL9',
    consumer_secret: 'c9pMzwYg6LiGESxoLbpk96CdVALFpAcW9BnGA9CTdgBGQzOo06',
    access_token: '1433079044-XRvWjicZlvB4xCHKva4EdA4EDF46eVT4aUNfXxF',
    access_token_secret: 'YfHYiUL5gi2IwY57UoSRD02SYIuKli1H7tdpViATA0UkD'
});

let allTweets = [];
twit.get('search/tweets', { q: '#HackValtech' }, function(err, data, response) {
    allTweets = data;
});

io.on('connection', function(client) {  
    console.log('Client connected...');
    client.emit('allTweets', allTweets);

    let stream = twit.stream('statuses/filter', {track: '#HackingParis2024'});
    stream.on('tweet', function(tweet) {
        console.log('New tweet received --> emit it to all clients !');
        client.emit('newTweet', tweet);
    });

    client.on('getTweetDetails', function(id) {
        twit.get('statuses/show', { id: id.toString() }, function(err, data, response) {
            client.emit('tweetDetails', data);
        });
    });
});

// // Setup logger
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = server;