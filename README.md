# DLT4PI-FIN4
Team **FINFOO** in the SoSe2019 [TUM](https://www.tum.de/) course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/) ([FuturICT 2.0](https://futurict2.eu/)) from [ETH Zürich](https://www.ethz.ch/) as partner.

**Team**: [@simonzachau](https://github.com/simonzachau) | [@benjaminaaron](https://github.com/benjaminaaron) |  [@sangeetajoseph8](https://github.com/sangeetajoseph8) | [@ShreshthaKriti](https://github.com/ShreshthaKriti) | [@leonKObi](https://github.com/leonKObi)

<table border="0"><tr><td>
<a href="https://futurict2.eu/"><img src="public/project-logos/FuturICT2_logo_on_white.png" width="250" ></a></td>
<td>
<img src="public/project-logos/Fin4_logo_on_white.jpg" width="100">
</td></tr></table>

YouTube Image Film:

[![](http://img.youtube.com/vi/oNlKdHjvExo/0.jpg)](http://www.youtube.com/watch?v=oNlKdHjvExo "Finance 4.0")

**FINFOO** is a multi-dimensional and multilayered finance system, destined to become a self-organizing and nuanced incentive system to contribute to healthier and more vibrant social and ecological communities worldwide. FINFOO aims to incentivize positive actions of individuals and promote sustainable development. The main characteristics of this system are its decentralization, immutability, rewards, and bottom-up approach

## Architecture

<table border="0"><tr>
<td><img src="https://user-images.githubusercontent.com/5141792/61829156-9f107b00-ae68-11e9-8ab7-6800f249caf8.png" width="500" ></a></td>
<br/>
<td><img src="https://user-images.githubusercontent.com/5141792/61829167-a3d52f00-ae68-11e9-98ef-76878f39d2d8.png" width="500" ></a></td>
</table>

## Assumptions made

Our assumptions for the development were that our users are tech-savvy enough to get Ethereum on their account and handle the MetaMask popups.

Furthermore we assumed a certain community engagement to be present that makes people want to use the plattform to participate in the token economy.

## Errors we encountered

During some development cycles involving re-migration, new mnemonics etc. strange errors were occuring in relation to the local ganache-blockchain. Sometimes these could only be resolved by manually resetting everything: deleting the `src/build`-folder, a new workspace in Ganache, logging out in MetaMask, closing Chrome and restoring from the new mnemonic.

When creating a new action type and add proof types that trigger a popup for you to set parameters - it's possible to close the popup without having set values, we haven't shielded against that case. This creates a wrong state, so please do set valid parameters in the popup.

## Setup

```sh
# install latest npm via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
nvm install node

# truffle
npm install -g truffle
npm install -g ganache-cli
```

BigchainDB requires `docker` and `docker-compose`: follow the installation instructions for **Docker** [here](https://docs.docker.com/engine/installation/) (don't forget the post-installation steps for Linux) and for **Docker Compose** [here](https://docs.docker.com/compose/install/).

### For deployment
Add and fill this file: `src/config/ethereum-keys.json`
```json
{
    "MNEMONIC": "",
    "INFURA_API_KEY": ""
}
```

### Install dependencies
```sh
npm install # takes a while
            # requires "python" to be on the PATH as Python 2 executable
```

### How to use the front end:

[![](https://img.youtube.com/vi/suODLSig1sA/0.jpg)](https://youtu.be/suODLSig1sA)

### Compile and migrate the smart contracts

1. `truffle compile`
2. `ganache-cli --port=7545 --allowUnlimitedContractSize`
3. `truffle migrate` to place the smart contract on the local blockchain
4. install the [MetaMask](https://metamask.io/) browser extension, paste the `MNEMONIC` from Ganache into the `seed` input and create a network with `http://127.0.0.1:7545` as `custom RPC`

### Start a local BigchainDB node
Used for offers on the marketplace

1. `git clone https://github.com/bigchaindb/bigchaindb.git`
2. `cd bigchaindb`
3. `make run`

### Start the react app
```sh
npm start
```
