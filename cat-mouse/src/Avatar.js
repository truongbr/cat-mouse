import React, { Component } from 'react';
import './Avatar.css';

class Avatar extends Component {
  position = [25, 50, 75];

  render() {
    return (
      <div className="Avatar"
        style={{
          backgroundColor: this.props.color,
          left: 'calc(' + this.position[this.props.x] + 'vw - var(--dimension) / 2)',
          top: 'calc(' + this.position[this.props.y] + 'vh - var(--dimension) / 2)'
        }}></div>
    );
  }
}

export default Avatar