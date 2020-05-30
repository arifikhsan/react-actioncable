import React, { Component } from "react";
import ActionCable from "actioncable";
import "./App.css";

class App extends Component {
  state = { text: "" };

  componentDidMount() {
    window.fetch("http://localhost:3000/notes/1").then((data) => {
      data.json().then((res) => {
        this.setState({ text: res.text });
      });
    });

    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    this.sub = cable.subscriptions.create("NoteChannel", {
      received: this.handleReceiveNewText,
    });
  }

  handleReceiveNewText = ({ text }) => {
    if (text !== this.state.text) {
      this.setState({ text });
    }
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
    this.sub.send({ text: e.target.value, id: 1 });
  };

  render() {
    return (
      <div>
        <h1>{this.state.text}</h1>
        <textarea
          value={this.state.text}
          onChange={this.handleChange}
        ></textarea>
      </div>
    );
  }
}

export default App;
