import React, {Component} from 'react';
import './App.css';
import {kissConversationTokenContract, proofDummyContract} from './web3-setup';
const BigchainDB = require('bigchaindb-driver')
const API_PATH = 'http://localhost:9984/api/v1/' //'https://test.bigchaindb.com/api/v1/'
const bip39 = require('bip39')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      date: ''
    };

    this.handleSubmitClaim = this.submitClaim.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  submitClaim() {
    kissConversationTokenContract.methods.submitClaim().send({
      from: '0xB648892c8d3c1f5d38A3A7751cdc644Fd879Add1' // got from calling web3.eth.getAccounts()
    });
    // proofDummyContract.submitProof('0xEa3abc42dE134f0F2050d5D58b714f91bCe1CB0A', '0');
  }
  
  bigchainDBdev() {
    // BigchainDB, wip following https://www.bigchaindb.com/developers/guide/tutorial-piece-of-art/
    // see also here for more (better?) example: https://git.fortiss.org/Blockchain/student-practical-courses/blockchain-dev-env/blob/master/demos/bcdb-nodejs/demo.js
    // requires a local BigchainDB running, either like this: https://blog.bigchaindb.com/the-status-of-the-bigchaindb-testnet-90d446edd2b4
    // or like here: https://git.fortiss.org/Blockchain/student-practical-courses/blockchain-dev-env

    const conn = new BigchainDB.Connection(API_PATH)
    var seed = bip39.mnemonicToSeedSync("fantasticFin4 seedPhrase").slice(0, 32)
    const alice = new BigchainDB.Ed25519Keypair(seed)

    console.log(conn, seed, alice);

    const painting = {
      name: 'Meninas',
      author: 'Diego Rodríguez de Silva y Velázquez',
      place: 'Madrid',
      year: '1656'
    }

    // Construct a transaction payload
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            painting,
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        {
            datetime: new Date().toString(),
            location: 'Madrid',
            value: {
                value_eur: '25000000€',
                value_btc: '2200',
            }
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
        // Issuers
        alice.publicKey
    )
    // The owner of the painting signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint, alice.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransactionCommit(txSigned)
        .then(res => {
            document.body.innerHTML += '<h3>Transaction created</h3>';
            document.body.innerHTML += txSigned.id
            // txSigned.id corresponds to the asset id of the painting
        })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    console.log(this.state);
    this.bigchainDBdev();
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick={this.handleSubmitClaim}>Submit a claim</button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
          </label>
          <label>
            Date:
            <input name="date" type="date" value={this.state.date} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
