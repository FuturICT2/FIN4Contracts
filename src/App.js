import React, {Component} from 'react';
import './App.css';

class App extends Component {
  //constructor(props) {
  //  super(props)
  //}

  devFunc() {
    console.log("dev");
  }

  render() {
    return (
      <div className="App">
        <button onClick={(e) => this.devFunc(e)}>
          dev
        </button>
      </div>
    );
  }
}

export default App;
