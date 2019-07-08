const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');
const API_PATH = 'http://localhost:9984/api/v1/';

class Database {
	constructor() {
		this.conn = new BigchainDB.Connection(API_PATH);
		var seed = bip39.mnemonicToSeedSync('fantasticFin4 seedPhrase').slice(0, 32);
		this.user = new BigchainDB.Ed25519Keypair(seed);
	}

	saveOfferDetails(name, description, tokenAddress, receiverAddress, imagePath, offerUrl, quantity, type) {
		console.log(type);
		const offerData = {
			name: name,
			description: description,
			tokenAddress: tokenAddress,
			imagePath: imagePath,
			receiverAddress: receiverAddress,
			offerUrl: offerUrl,
			quantity: quantity,
			type: type
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
	}
}
export default Database;
