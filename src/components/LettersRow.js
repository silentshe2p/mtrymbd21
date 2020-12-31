import React, { Component } from 'react';
import '../css/LettersRow.css';

class LettersRow extends Component {
  render() {
    return (
      <div className="LettersRow">
        {this.props.children}
      </div>
    );
  }
}

export default LettersRow;
