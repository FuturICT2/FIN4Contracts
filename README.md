# DLT4PI-FIN4
Team **Action Magic for Finance 4.0** in the SoSe2019 [TUM](https://www.tum.de/) course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/) ([FuturICT 2.0](https://futurict2.eu/)) from [ETH Zürich](https://www.ethz.ch/) as partner. The use case is [*KISS Genossenschaft Zug*](https://kiss-zug.ch/).

## Setup

`truffle compile`

Start [Ganache](https://truffleframework.com/ganache) and use *Quickstart*.

`truffle migrate` to place the smart contract on the local blockchain.

Via the gear-icon in Ganache, *Add Project* and select the `truffle-config.js` to add this project and therewith be able to see the values in the smart contract. Click *Save and Restart* top right.  
(This might throw an error on Ganache - if that happens it doesn't seem possible to see the smart contract via Ganache unfortunately. TODO: fix this?)

## Usage

#### Command Line

`truffle console`

Register giver and receiver:
```solidity
ActionMagic.deployed().then(function(instance){instance.becomeActionGiver()})

ActionMagic.deployed().then(function(instance){instance.becomeActionReceiver({from:"0xccAFBbEcc6ed0512209608CAece7b659506171FD"})})
```
Where `from` pretends to send this from another account and not the first one that is used by default. See the *Accounts* tab in Ganache for the 10 addresses and pick one other than the first.

Giver makes a claim:

```solidity
ActionMagic.deployed().then(function(instance){instance.actionGiverInitiatesClaim()})
```

Receiver gets a message about a claim to approve via the update-polling function:

```solidity
ActionMagic.deployed().then(function(instance){return instance.updatePolling({from:"0xccAFBbEcc6ed0512209608CAece7b659506171FD"})})
```

Receiver approves the claim:

```solidity
ActionMagic.deployed().then(function(instance){instance.actionReceiverApprovesClaim({from:"0xccAFBbEcc6ed0512209608CAece7b659506171FD"})})
```
Check if the `claimApprovedByActionReceiver` boolean has become true:

```solidity
ActionMagic.deployed().then(function(instance){return instance.claimApprovedByActionReceiver()})
```

Done. For now :smiley:

