# DLT4PI-FIN4
Team **Action Magic for Finance 4.0** in the SoSe2019 [TUM](https://www.tum.de/) course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/) ([FuturICT 2.0](https://futurict2.eu/)) from [ETH Zürich](https://www.ethz.ch/) as partner. The use case is [*KISS Genossenschaft Zug*](https://kiss-zug.ch/).

## Setup

`truffle compile`

Start [Ganache](https://truffleframework.com/ganache) and use *Quickstart*.

`truffle migrate` to place the smart contract on the local blockchain

[//]: <> (
Via the gear-icon in Ganache, *Add Project* and select the `truffle-config.js` to add this project and therewith be able to see the values in the smart contract. Click *Save and Restart* top right. This might throw an error on Ganache - if that happens it doesn't seem possible to see the smart contract via Ganache unfortunately. TODO: fix this?
)

## Usage (outdated)

[//]: <> (#### Command Line)

All the following takes place in:  
`truffle console`

Get the addresses of the `ProofDummy` and `KISSConversationToken` smart contracts:

```solidity
ProofDummy.address
KISSConversationToken.address
```

Use the `ProofDummy` address to register it as a required proof for `KISSConversationToken`:

```solidity
KISSConversationToken.deployed().then(function(instance){return instance.addRequiredProof('0x3646008A0fdC887F4cB5c06FbEACa09Dc0e09d59')})
```

Submit a claim (it will get the `claimId 0`):

```solidity
KISSConversationToken.deployed().then(function(instance){return instance.submitClaim()})
```

Submit your proof to `ProofDummy` by including the address of the token you want to mint and the `claimId` (it gets immediately auto-approved):

```solidity
ProofDummy.deployed().then(function(instance){return instance.submitProof('0xEa3abc42dE134f0F2050d5D58b714f91bCe1CB0A','0')})
```

Check if your claim with `claimId 0` (you could have multiple ones pending, therefore not just your address but also an Id for the claim is necessary) is approved. It should return `true`:

```solidity
KISSConversationToken.deployed().then(function(instance){return instance.getClaimStatus('0')})
```
