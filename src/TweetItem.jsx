import './TweetItem.css';

import React, { Component } from 'react';

import renderHTML from 'react-render-html';

class TweetItem extends Component {
  render() {
    let tweet = this.props.tweet;
    let image = {
      background: tweet.entities.media && tweet.entities.media.length > 0 ? `url(${tweet.entities.media[0].media_url}:small) no-repeat center` : ''
    };

    return (
      <div className="tweet-box" style={image}>
        <div  className="tweet-content">
          <div className="tweet-content-text">{renderHTML(tweet.text)}</div>
        </div>
        <div className="tweet-footer">
          <div className="tweet-footer-text">{tweet.user.name} (@{tweet.user.screen_name})</div>
        </div>
      </div>
    );
  }
}

export default TweetItem;
