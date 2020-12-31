import React, { Component } from 'react';
import '../css/Word.css';

class Word extends Component {
  render() {
    return (
      <div className="Word">
        {this.props.children}
      </div>
    );
  }
}

export default Word;
