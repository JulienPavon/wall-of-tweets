import './App.css';

import React, { Component } from 'react';

import io from 'socket.io-client';

class App extends Component {
  constructor() {
    super();

    let self = this;
    
    this.state = {
      tweets: []
    };

    for (let i = 1; i <= 10; i++) {
      this.state.tweets.push(
        {
          id: i, 
          text: 'RT @arnaudhacquin: rvfrance: RT rBrillet: Foncez ! #HackValtech #Hackaton #VR #Reality cc Valtech_FR https://t.co/llBBxxbG8h', 
          media: { 
            media_url: 'https://pbs.twimg.com/media/Ck6kfxWXIAA9P6t.jpg:small' 
          },
          user: {
            name: 'This is my name'

          }

        });
    }


    let socket = io();
    socket.on('allTweets', function(tweets) {
        self.setState({tweets: tweets.statuses.reverse()});
        console.log(tweets);
    });
    socket.on('newTweet', function(tweet) {
        let tweets = self.state.tweets.slice();
        tweets.unshift(tweet);
        self.setState({tweets:tweets});
        console.log(tweet);
    });
  }
  
  render() {
    let tweets = this.state.tweets.map(tweet => {
      let image = {
        background: `url(${tweet.media.media_url}) center`

      };

      return <li key={tweet.id} className="tweet-item">
        <div className="tweet-box" style={image}>
          <div className="tweet-content">
            <div className="tweet-content-text">{tweet.text}</div>
          </div>
          <div className="tweet-footer">
            <div className="tweet-footer-text">{tweet.user.name}</div>
          </div>
        </div>
      </li>;
    });
    return (
      <div className="App">
        <div className="App-header">
          <h2>#HackValtech</h2>
        </div>
        
        <div className="App-content">
          <ul className="tweets-collection">
            {tweets}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
