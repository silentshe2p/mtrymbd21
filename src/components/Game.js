import React, { Component } from 'react';
import { Message, Divider, Header } from 'semantic-ui-react';
import AttemptsLeft from './AttemptsLeft';
import Letter from './Letter';
import Word from './Word';
import ContinueButton from './ContinueButton';
import VirtualKeyboard from './VirtualKeyboard';
import hangmanAttempts from './HangmanAttempts';
import { GAME_WON, GAME_OVER } from './game-states';

import '../css/Game.css';

class Game extends Component {
  render() {
    return (
      <div className="Game-content">
        <div className="Game-SideBySide">
          {this._renderInputPanel()}
          <div className="Game-Hangman">
            {hangmanAttempts(this.props.guesses)}
          </div>
        </div>
      </div>
    );
  }

  _renderInputPanel() {
    const hasAttemptsLeft = this.props.guesses > 0;
    const gameWon = this.props.gameState === GAME_WON;
    const content = hasAttemptsLeft
        ? gameWon
          ? this._renderGameFinished(`${this.props.id}くんは助かった 🤗`, 'Game-GameWin')
          : (
            <div className="Game-VirtualKeyboard">
              <VirtualKeyboard
                excluded={this.props.pastGuesses}
                onClick={this.props.onLetter}
              />
            </div>
          )
        : this._renderGameFinished(`${this.props.id}くんは死んだ ☠️`, 'Game-GameOver');

    return (
      <div className="Game-InputPanel">
        {this._renderWord()}
        <div className="Game-AttemptsLeft">
          <AttemptsLeft attempts={this.props.guesses} />
        </div>
        {content}
        <Divider hidden/>
        <Header as='h3' dividing>
          話題: 「{this.props.que}」
        </Header>
        <p>小ヒント1: { this.props.guesses < 5 ? <span style={{color: "#8FBC8F"}}>{this.props.hint_1}</span> : <span>...(1ミス)</span> }</p>
        <p>小ヒント2: { this.props.guesses < 3 ? <span style={{color: "#8FBC8F"}}>{this.props.hint_2}</span> : <span>...(3ミス)</span> }</p>
        <p>大ヒント: { this.props.clue ? <span style={{color: "#556B2F"}}>{this.props.hint_3}</span> : <span>...([大ヒント]の数を使い切る)</span> }</p>
      </div>
    );
  }

  _renderGameFinished(message, cssClass) {
    const content = (cssClass === 'Game-GameWin')
      ? <React.Fragment>
          <p>{`恩返しのために${this.props.id}くんはきみにパスワードの${this.props.id}番目の文字のヒントを与えました`}</p>
          <Message>
            <Message.Header>{this.props.res}</Message.Header>
          </Message>
        </React.Fragment>
      : <p>{`${this.props.id}くんが三途の川で泳いでいるのでパスワードの${this.props.id}番目の文字を取得できませんでした`}</p>;
    return (
      <div className={cssClass}>
        <p>{message}</p>
        {content}
        <ContinueButton
          onClick={this.props.onContinue}
          gameState={this.props.gameState}
        />
      </div>
    )
  }

  _renderWord() {
    return (
      <div className="Game-Word">
        <Word>
          {this.props.letters.map((letter, i) => {
            const letterValue = (letter.value === '_') ? ' ' : (
              this.props.gameState === GAME_OVER || !letter.guessed
            ) ? '_' : letter.value;

            return (
              <Letter
                key={`word-letter-${i}`}
                value={letterValue}
              />
            );
          })}
        </Word>
      </div>
    );
  }
}

export default Game;
