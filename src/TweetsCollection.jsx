import './TweetsCollection.css';

import React, { Component } from 'react';

import TweetDetails from './TweetDetails';
import TweetItem from './TweetItem';
import io from 'socket.io-client';

class TweetsCollection extends Component {
  constructor() {
    super();

    let self = this;
    
    this.state = {
      tweets: [],
      tweetIdToShow: null
    };

    this.socket = io();
    this.socket.on('allTweets', function(data) {
      self.setState({tweets: data.statuses});
      console.log(data);
    });
    this.socket.on('newTweet', function(tweet) {
      if (!tweet.retweeted_status) {
        let tweets = self.state.tweets.slice();
        tweets.unshift(tweet);

        if (tweets.length > 30) {
          tweets.pop();
        }

        self.setState({tweets:tweets});
      }
    });
  }

  showTweet(id) {
    this.setState({tweetIdToShow: id});
  }

  render() {
    let tweets = this.state.tweets.map((tweet) => {
      return (
        <li onClick={this.showTweet.bind(this, tweet.id_str)} key={tweet.id_str} className="tweet-item">
          <TweetItem tweet={tweet} />
        </li>
      );
    });

    return (
      <div>
        <ul className="tweets-collection">
          {tweets}
        </ul>

        <TweetDetails id={this.state.tweetIdToShow} />
      </div>
    );
  }
}

export default TweetsCollection;
