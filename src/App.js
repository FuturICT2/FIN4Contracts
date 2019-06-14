import React, {Component} from 'react';
import './App.css';
import {fin4BaseTokenContract, proofDummyContract} from './web3-setup';
//const BigchainDB = require('bigchaindb-driver')
//const bip39 = require('bip39')

class App extends Component {
  constructor(props) {
    super(props)
    this.handleSubmitClaim = this.submitClaim.bind(this);
  }
  
  submitClaim() {
    fin4BaseTokenContract.methods.submitClaim().send({
      from: '0xB648892c8d3c1f5d38A3A7751cdc644Fd879Add1' // got from calling web3.eth.getAccounts()
    });
    // proofDummyContract.submitProof('0xEa3abc42dE134f0F2050d5D58b714f91bCe1CB0A', '0');
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
      </div>
    );
  }

  /*bigchainDBdev() {
    // BigchainDB, wip following https://www.bigchaindb.com/developers/guide/tutorial-piece-of-art/
    // see also here for more (better?) example: https://git.fortiss.org/Blockchain/student-practical-courses/blockchain-dev-env/blob/master/demos/bcdb-nodejs/demo.js
    // requires a local BigchainDB running, either like this: https://blog.bigchaindb.com/the-status-of-the-bigchaindb-testnet-90d446edd2b4
    // or like here: https://git.fortiss.org/Blockchain/student-practical-courses/blockchain-dev-env

    const conn = new BigchainDB.Connection('http://localhost:9984/api/v1/') // https://test.bigchaindb.com/api/v1/
    var seed = bip39.mnemonicToSeedSync("fantasticFin4 seedPhrase").slice(0, 32)
    const alice = new BigchainDB.Ed25519Keypair(seed)

    console.log(conn, seed, alice);

    const painting = {
      name: 'Meninas',
      author: 'Diego Rodríguez de Silva y Velázquez',
      place: 'Madrid',
      year: '1656'
    }
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        {
            painting,
        },
        {
            datetime: new Date().toString(),
            location: 'Madrid',
            value: {
                value_eur: '25000000€',
                value_btc: '2200',
            }
        },
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
        alice.publicKey
    )
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint, alice.privateKey)
    conn.postTransactionCommit(txSigned)
        .then(res => {
            document.body.innerHTML += '<h3>Transaction created</h3>';
            document.body.innerHTML += txSigned.id
        })
  }*/
}

export default App;
