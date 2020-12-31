import React, { Component } from 'react';
import { GAME_WON } from './game-states';
import '../css/ContinueButton.css';

const wonEmo = ['😀', '😁', '😃', '😄', '😆', '😊', '😋', '😎'];
const loseEmo = ['😣', '😥', '😕', '😭', '😵'];

class ContinueButton extends Component {
  render() {
    return (
      <div className="App-Continue">
        <button onClick={this.props.onClick}>
          { `つぎ ${this.props.gameState === GAME_WON 
            ? wonEmo[Math.floor(Math.random() * wonEmo.length)]
            : loseEmo[Math.floor(Math.random() * loseEmo.length)] }` }
        </button>
      </div>
    );
  }
}

export default ContinueButton;
