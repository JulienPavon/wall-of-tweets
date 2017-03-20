import './TweetItem.css';

import React, { Component } from 'react';

import renderHTML from 'react-render-html';

const TweetItem = ({tweet}) => {
  let image = {};
  if (hasMedia(tweet)) {
    image.backgroundImage = `url(${getMainMediaUrl(tweet)}:small)`;
  }

  return (
    <div className="tweet-box" style={image}>
      <div className="tweet-content">
        <div className="tweet-content-text">{renderHTML(tweet.text)}</div>
      </div>
      <div className="tweet-footer">
        <div className="tweet-footer-text">{tweet.user.name} (@{tweet.user.screen_name})</div>
      </div>
    </div>
  );

  function hasMedia(tweet) {
    return tweet.entities.media && tweet.entities.media.length > 0;
  }

  function getMainMediaUrl(tweet) {
    let url;
    
    if (hasMedia(tweet)) {
      url = tweet.entities.media[0].media_url;
    }

    return url;
  }
}

export default TweetItem;
