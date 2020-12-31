import React, { Component } from 'react';

class Letter extends Component {
  render() {
    return (
      <span className="Letter">
        {this.props.value}
      </span>
    );
  }
}

export default Letter;
