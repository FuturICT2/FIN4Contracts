import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

var fin4BaseTokenABI = (require('./build/contracts/Fin4BaseToken.json').abi);
var proofDummyABI = (require('./build/contracts/ProofDummy.json').abi);
// create workspace in Ganache using this mnemonic for these addresses to work (new workspace -> Accounts & Keys)
// similar letter design stomach grass fossil purity custom steak fine cube hamster

let fin4BaseTokenAddress = '0x5D070A9E0eEC1ed26De488759C0Be9300c1107c6';
let proofDummyAddress = '0x1DA05D2D4BAB428030558EeA4827dB61A80BA828';
// let myAddress = web3.eth.getAccounts().then(a => a[0])

// TODO use Drizzle? Seems to be useful, seven so I don't quite understand what it's used for yet :) 
// https://github.com/trufflesuite/drizzle-react
// The rental-nomad project used it too:
// https://git.fortiss.org/Blockchain/student-practical-courses/blc4pi-ss2018/rental-nomad/blob/master/src/drizzleOptions.js

const fin4BaseTokenContract = new web3.eth.Contract(fin4BaseTokenABI, fin4BaseTokenAddress);
const proofDummyContract = new web3.eth.Contract(proofDummyABI, proofDummyAddress);


// Use the ProofDummy address to register it as a required proof for KISSConversationToken
// kissConversationTokenContract.methods.addRequiredProof(proofDummyAddress);


export {
    fin4BaseTokenContract,
    proofDummyContract
};
