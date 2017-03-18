import './App.css';

import React, { Component } from 'react';

import Modal from 'react-modal';
import io from 'socket.io-client';
import renderHTML from 'react-render-html';

class App extends Component {
  constructor() {
    super();

    let self = this;
    
    this.state = {
      tweets: [],
      tweetDetails: {
          id_str: "839900050331426818", 
          created_at: 'Fri Mar 10 20:20:43 +0000 2017',
          text: 'RT @arnaudhacquin: rvfrance: RT rBrillet: Foncez ! #HackValtech #Hackaton #VR #Reality cc Valtech_FR https://t.co/llBBxxbG8h', 
          entities: {
            media: [{ 
              media_url: 'https://pbs.twimg.com/media/Ck6kfxWXIAA9P6t.jpg' 
            }],
          },
          user: {
            name: "What's my mothaf*****g name ?",
            screen_name: '_snoopDogg',
            profile_image_url: "http://pbs.twimg.com/profile_images/840613476414435329/33DmyxUe_normal.jpg"
          }
      },
      modalIsOpen: false
    };

    for (let i = 1; i <= 10; i++) {
      this.state.tweets.push(
        {
          id_str: i, 
          created_at: 'Fri Mar 10 20:20:43 +0000 2017',
          text: 'RT @arnaudhacquin: rvfrance: RT rBrillet: Foncez ! #HackValtech #Hackaton #VR #Reality cc Valtech_FR https://t.co/llBBxxbG8h', 
          entities: {
            media: [{ 
              media_url: 'https://pbs.twimg.com/media/Ck6kfxWXIAA9P6t.jpg' 
            }],
          },
          user: {
            name: "What's my mothaf*****g name ?",
            screen_name: '_snoopDogg',
            profile_image_url: "http://pbs.twimg.com/profile_images/840613476414435329/33DmyxUe_normal.jpg"
          }

        });
    }


    this.socket = io();
    this.socket.on('allTweets', function(tweets) {
      self.setState({tweets: tweets.statuses});
      console.log(tweets);
    });
    this.socket.on('newTweet', function(tweet) {
      if(!tweet.retweeted_status) {
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
    let tweets = this.state.tweets.map((tweet) => {
      let image = {
        background: tweet.entities.media && tweet.entities.media.length > 0 ? `url(${tweet.entities.media[0].media_url}:small) no-repeat center` : ''
      };

      return <li onClick={this.showTweet.bind(this, tweet.id_str)} key={tweet.id_str} className="tweet-item">
        <div className="tweet-box" style={image}>
          <div  className="tweet-content">
            <div className="tweet-content-text">{renderHTML(tweet.text)}</div>
          </div>
          <div className="tweet-footer">
            <div className="tweet-footer-text">{tweet.user.name} (@{tweet.user.screen_name})</div>
          </div>
        </div>
      </li>;
    });

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

    let tweetDetailsImageStyle = {};
    if (this.state.tweetDetails.entities.media && this.state.tweetDetails.entities.media.length > 0) {
      tweetDetailsImageStyle.backgroundImage = `url(${this.state.tweetDetails.entities.media[0].media_url}:large)`;
    }

    return (
      <div className="App">
        <div className="App-header">
          <h1>#HackValtech</h1>
        </div>
        
        <div className="App-content">
          <ul className="tweets-collection">
            {tweets}
          </ul>

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
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
