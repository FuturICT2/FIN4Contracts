import React, { Component } from 'react';
import './App.css';
import { kissConversationTokenContract, proofDummyContract } from './web3-setup';

class App extends Component {
  submitClaim() {
    kissConversationTokenContract.methods.submitClaim().send({
      from: '0x30fee34fb0096f1f4712c4Ae4D6164b2Ae6b2644' // got from calling web3.eth.getAccounts()
    });
    // proofDummyContract.submitProof('0xEa3abc42dE134f0F2050d5D58b714f91bCe1CB0A', '0');
  }

  render() {
    return (
      <div>
        <header>
          <h1>Welcome to FIN4</h1>
        </header>
        <div>
          <button onClick={this.submitClaim()}>Submit a claim</button>
        </div>
      </div>
    );
  }
}

export default App;
