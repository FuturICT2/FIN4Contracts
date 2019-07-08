import React, { Component } from 'react';
import Web3 from 'web3';
import Offer from '../build/contracts/MarketOffers.json';
import contract from 'truffle-contract';
import ContractData from '../components/ContractData';
import axios from 'axios';

const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');
const API_PATH = 'http://localhost:9984/api/v1/';

class Database extends Component {
	constructor(props) {
		super(props);

		this.conn = new BigchainDB.Connection(API_PATH);
		var seed = bip39.mnemonicToSeedSync('fantasticFin4 seedPhrase').slice(0, 32);
		this.user = new BigchainDB.Ed25519Keypair(seed);

		this.web3 = new Web3(window.web3.currentProvider);
		this.contract = contract(Offer);
		this.contract.setProvider(this.web3.currentProvider);
	}

	a() {
		console.log('Ooooooooooo');
	}

	saveOfferDetails = (name, description, tokenAddress, receiverAddress, imagePath, offerUrl, quantity) => e => {
		const offerData = {
			name: name,
			description: description,
			tokenAddress: tokenAddress,
			imagePath: imagePath,
			receiverAddress: receiverAddress,
			offerUrl: offerUrl,
			quantity: quantity,
			type: 'offer'
		};
		//CREATE
		const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
			{
				offerData
			},
			null,
			[BigchainDB.Transaction.makeOutput(BigchainDB.Transaction.makeEd25519Condition(this.user.publicKey))],
			this.user.publicKey
		);
		//SIGN
		const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint, this.user.privateKey);

		//SEND
		this.conn.postTransactionCommit(txSigned).then(res => {
			console.log(txSigned.id);
			return txSigned.id;
		});
	};

	async getOfferDetails() {
		var PATH = API_PATH + 'assets?search=offer';
		axios.get(PATH).then(response => {
			return response.data;
		});
	}
}
export default Database;
