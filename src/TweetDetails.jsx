import './TweetDetails.css';

import React, { Component } from 'react';

import Modal from 'react-modal';
import io from 'socket.io-client';
import renderHTML from 'react-render-html';

const modalStyle = {
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

class TweetDetails extends Component {
  constructor() {
    super();

    this.state = {
      tweet: {}
    };

    this.socket = io();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id === nextProps.id) { 
      return; 
    }

    this.updateTweet(nextProps.id);
  }

  updateTweet(id) {
    console.log(`Show tweet with id '${id}'`);

    let self = this;

    this.socket.emit('getTweetDetails', id);
    this.socket.on('tweetDetails', function(tweet) {
      console.log('Get tweet details : ');
      console.log(tweet);
      self.setState({tweet: tweet, modalIsOpen: true});
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    let tweetDetails = null;
    
    if (this.state.tweet && this.state.modalIsOpen) {
      let tweetImageStyle = {};
      if (this.state.tweet.entities.media && this.state.tweet.entities.media.length > 0) {
        tweetImageStyle.backgroundImage = `url(${this.state.tweet.entities.media[0].media_url}:large)`;
      }

      tweetDetails =
        <Modal isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={modalStyle}
                contentLabel="">

          <button className="close-modal-button" onClick={this.closeModal.bind(this)}>X</button>
          <div className="tweet-details-box">
            <div className="tweet-details-content">
              <div className="tweet-details-content-user_name">{this.state.tweet.user.name}</div>
              <div className="tweet-details-content-screen_name">(@{this.state.tweet.user.screen_name})</div>
              <div className="tweet-details-content-text">{renderHTML(this.state.tweet.text)}</div>
            </div>
            <div className="tweet-details-image" style={tweetImageStyle}>
            </div>
          </div>
        </Modal>;
    }
    
    return (tweetDetails);
  }
}

export default TweetDetails;
