import './TweetsCollection.css';

import React, { Component } from 'react';

import Modal from 'react-modal';
import TweetItem from './TweetItem';
import io from 'socket.io-client';
import renderHTML from 'react-render-html';

class TweetsCollection extends Component {
  constructor() {
    super();

    let self = this;
    
    this.state = {
      tweets: [],
      tweetDetails: {}
    };

    this.socket = io();
    this.socket.on('allTweets', function(tweets) {
      self.setState({tweets: tweets.statuses});
      console.log(tweets);
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
    //this.setState({modalIsOpen: true});
    console.log(`Show tweet with id '${id}'`);

    let self = this;

    this.socket.emit('getTweetDetails', id);
    this.socket.on('tweetDetails', function(tweet) {
      console.log('Get tweet details : ');
      console.log(tweet);
      self.setState({tweetDetails: tweet, modalIsOpen: true});
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    let tweetDetails;
    if (this.state.tweetDetails && this.state.modalIsOpen) {
      let tweetDetailsImageStyle = {};
      if (this.state.tweetDetails.entities.media && this.state.tweetDetails.entities.media.length > 0) {
        tweetDetailsImageStyle.backgroundImage = `url(${this.state.tweetDetails.entities.media[0].media_url}:large)`;
      }

      const customStyles = {
        overlay: {
          backgroundColor: 'rgba(2, 2, 2, 0.4)'
        },
        content : {
          position: 'absolute',
          top: '60px',
          left: '60px',
          right: '60px',
          bottom: '60px',
          padding: '0',
          overflow: 'hidden',
          border: '1px solid #666',
          borderRadius: 0
        }
      };

      tweetDetails =
        <Modal isOpen={this.state.modalIsOpen}
               onRequestClose={this.closeModal}
               style={customStyles}
               contentLabel="">

          <button className="close-modal-button" onClick={this.closeModal.bind(this)}>X</button>
          <div className="tweet-details-box">
            <div className="tweet-details-content">
              <div className="tweet-details-content-user_name">{this.state.tweetDetails.user.name}</div>
              <div className="tweet-details-content-screen_name">(@{this.state.tweetDetails.user.screen_name})</div>
              <div className="tweet-details-content-text">{renderHTML(this.state.tweetDetails.text)}</div>
            </div>
            <div className="tweet-details-image" style={tweetDetailsImageStyle}>
            </div>
          </div>
        </Modal>;
    }
    
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

        {tweetDetails}
      </div>
    );
  }
}

export default TweetsCollection;
