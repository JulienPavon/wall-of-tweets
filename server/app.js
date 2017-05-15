const express = require('express');
const path = require('path');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Twit = require('twit');

let twit = new Twit({
    consumer_key: 'xxxxxxxxxxxxxxxxxxx',
    consumer_secret: 'xxxxxxxxxxxxxxxxxxx',
    access_token: 'xxxxxxxxxxxxxxxxxxx',
    access_token_secret: 'xxxxxxxxxxxxxxxxxxx'
});

let allTweets = [];
twit.get('search/tweets', { q: '#HackValtech', count: 30, result_type: 'recent'  }, function(err, data, response) {
    allTweets = data;
});

io.on('connection', function(client) {  
    console.log('Client connected...');
    client.emit('allTweets', allTweets);

    client.on('getTweetDetails', function(id) {
        twit.get('statuses/show', { id: id.toString() }, function(err, data, response) {
            client.emit('tweetDetails', data);
        });
    });
});

let stream = twit.stream('statuses/filter', {track: '#HackValtech'});
stream.on('tweet', function(tweet) {
    console.log('New tweet received --> emit it to all clients !');
    io.sockets.emit('newTweet', tweet);
});

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = server;
