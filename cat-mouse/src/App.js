import React, { Component } from 'react';
import './App.css';
import shatter from './sounds/shatter.wav';

import {DEFAULT_COLOR, COLORS} from './constants';

import Avatar from './Avatar';
import Player from './Player';
import Mouse from './Mouse';

class App extends Component {
  timer = null;
  white = true;
  mouse = new Mouse(4, 9);
  player = new Player();

  constructor(props) {
    super(props);
    this.state = { color: DEFAULT_COLOR, x: 1, y: 1 };
    this.player.recording = true;

    this.resetState = this.resetState.bind(this);
    this.moveAvatar = this.moveAvatar.bind(this);
    this.keyListener = this.keyListener.bind(this);
    this.mouseListener = this.mouseListener.bind(this);
  }

  resetState() {
    this.moveAvatar(4, false);
    this.mouse.resetState(4, 9);

    this.player.clearRecording();
    this.player.recording = true;

    this.white = true;
  }

  moveAvatar(position, colorChange = true) {
    clearTimeout(this.timer);

    const color = colorChange ? COLORS[position] : DEFAULT_COLOR;
    this.setState({ 
      color: color, 
      x: position % 3, 
      y: Math.floor(position / 3) 
    });

    let delay = 500;
    if (this.white && this.updatePositions(position)) delay = 0;

    this.timer = setTimeout(() => this.setState({color: DEFAULT_COLOR}), delay);
  }

  updatePositions(position) {
    const caughtMouse = this.mouse.updateCat(position);

    if (caughtMouse) {
      this.white = false;
      this.player.recording = false;

      const audio = new Audio(shatter);
      audio.onended = () => {
        if (this.player.queue.length > 0) {
          this.player.reverseRecording();
          this.player.playRecording(this.moveAvatar, this.resetState);
        } else {
          this.resetState();
        }
      }
      audio.play();
    }

    return caughtMouse;
  }

  mouseListener(event) {
    if (!this.white) return;

    const x = event.clientX;
    const y = event.clientY;

    const e = document.getElementsByClassName('App')[0];
    const h = e.clientHeight;
    const w = e.clientWidth;

    let pos = 0;
    if (x > w / 3) pos += 1;
    if (x > 2 * w / 3) pos += 1;
    if (y > h / 3) pos += 3;
    if (y > 2 * h / 3) pos += 3;

    this.moveAvatar(pos);
    this.player.play(pos);
  }

  keyListener(event) {
    if (!this.white) return;

    const key = +event.key - 1;
    if (COLORS[key]) {
      this.moveAvatar(key);
      this.player.play(key);
    }
  }
  
  render() {
    return (
      <div className="App" tabIndex="0"
           onKeyDown={this.keyListener}
           onMouseDown={this.mouseListener}
           style={{backgroundColor: this.state.color}}>
        <Avatar x={this.state.x} y={this.state.y} color={this.white ? "white" : "black"}/>
      </div>
    );
  }
}

export default App;
