import React, { Component } from 'react';
import '../css/LetterBlock.css';

class LetterBlock extends Component {
  render() {
    return (
      <div onClick={this.props.onClick} className="LetterBlock">
        <span>
          {this.props.value}
        </span>
      </div>
    );
  }
}

export default LetterBlock;
