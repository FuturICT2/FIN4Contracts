# DLT4PI-FIN4
Team **Action Magic for Finance 4.0** in the SoSe2019 [TUM](https://www.tum.de/) course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/) ([FuturICT 2.0](https://futurict2.eu/)) from [ETH Zürich](https://www.ethz.ch/) as partner. The use case is [*KISS Genossenschaft Zug*](https://kiss-zug.ch/).

## Setup

1. `truffle compile`
2. Start [Ganache](https://truffleframework.com/ganache) and use *Quickstart*.
3. `truffle migrate` to place the smart contract on the local blockchain
4. install the [Metamask](https://metamask.io/) browser extension, paste `MNEMONIC` from Ganache into the `seed` input and `http://127.0.0.1:7545` into `custom RPC` input
5. `yarn install`
6. `yarn start`

[//]: <> (
Via the gear-icon in Ganache, *Add Project* and select the `truffle-config.js` to add this project and therewith be able to see the values in the smart contract. Click *Save and Restart* top right. This might throw an error on Ganache - if that happens it doesn't seem possible to see the smart contract via Ganache unfortunately. TODO: fix this?
)

## Developers of this repository
[@benjaminaaron](https://github.com/benjaminaaron), [@leonKObi](https://github.com/leonKObi), [@sangeetajoseph8](https://github.com/sangeetajoseph8), [@ShreshthaKriti](https://github.com/ShreshthaKriti), and [@simonzachau](https://github.com/simonzachau)
