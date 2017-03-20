import './App.css';

import React, { Component } from 'react';

import TweetsCollection from './TweetsCollection';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>#HackValtech</h1>
        </div>
        
        <div className="App-content">
          <TweetsCollection />
        </div>
      </div>
    );
  }
}

export default App;
