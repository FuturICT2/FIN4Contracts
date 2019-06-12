import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

let kissConversationTokenABI = [{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "requiredProofs", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x79bee15a" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "claims", "outputs": [{ "name": "claimId", "type": "uint256" }, { "name": "claimer", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xa888c2cd" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "getRequiredProofsCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xf2afb20c" }, { "constant": true, "inputs": [{ "name": "index", "type": "uint256" }], "name": "getRequiredProofAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x7ecbb8d0" }, { "constant": true, "inputs": [{ "name": "claimId", "type": "uint256" }], "name": "getClaimStatus", "outputs": [{ "name": "", "type": "address" }, { "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x36dbd2f9" }, { "constant": false, "inputs": [], "name": "submitClaim", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x1afbd128" }, { "constant": false, "inputs": [{ "name": "claimer", "type": "address" }, { "name": "claimId", "type": "uint256" }], "name": "receiveApprovedProof", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x27a85691" }, { "constant": false, "inputs": [{ "name": "proofSCaddress", "type": "address" }], "name": "addRequiredProof", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x62f29f52" }];
let proofDummyABI = [{ "constant": false, "inputs": [{ "name": "SCtoReceiveProof", "type": "address" }, { "name": "claimId", "type": "uint256" }], "name": "submitProof", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x82e6b20d" }];

let kissConversationTokenAddress = '0x2409D0ef36081a0EBE3a42147D40DC95501EeAD4';
let proofDummyAddress = '0x98C77f7F77c324e31c2e4794268D73DDBc9cEA81';
// let myAddress = web3.eth.getAccounts().then(a => a[0])

const kissConversationTokenContract = new web3.eth.Contract(kissConversationTokenABI, kissConversationTokenAddress);
const proofDummyContract = new web3.eth.Contract(proofDummyABI, proofDummyAddress);


// Use the ProofDummy address to register it as a required proof for KISSConversationToken
// kissConversationTokenContract.methods.addRequiredProof(proofDummyAddress);


export {
    kissConversationTokenContract,
    proofDummyContract
};