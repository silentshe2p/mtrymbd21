import React, { Component } from 'react';

import '../css/AttemptsLeft.css';

class AttemptsLeft extends Component {
  render() {
    return (
      <div className="AttemptsLeft">
        <span>残りのretries: <span className="AttemptsLeft-Number">
            {this.props.attempts}
          </span>
        </span>
      </div>
    );
  }
};

export default AttemptsLeft;
