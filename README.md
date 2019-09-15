# FIN4XPLORER

## Context

**FIN4XPLORER** is a decentralised design for a bottom-up and multidimensional finance system with the aim of making communities healthier, more social, and sustainable. It is part of the FLAG-ERA-funded project [FuturICT 2.0](https://futurict2.eu/).

<table border="0"><tr><td>
<a href="https://futurict2.eu/"><img src="public/project-logos/FuturICT2_logo_on_white.png" width="250" ></a></td>
<td>
<img src="public/project-logos/Fin4_logo_on_white.jpg" width="100">
</td></tr></table>

ℹ️ [Explanatory video](http://www.youtube.com/watch?v=oNlKdHjvExo)

## Description

**FIN4XPLORER** allows any person, organisation, and public institution to create tokens, which stand for a positive action. Users can claim and prove these actions, for which they receive said tokens. By designing the system to be open to markets tailored to the respective actions, incentives are generated. The main characteristics of this system are its decentralization, immutability, rewards, and bottom-up approach.

## Quick start

### Install dependencies

```sh
# the basics
sudo git apt-get install build-essential python

# node v10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.bashrc
nvm install 10.0.0
nvm use 10.0.0

# on macOS, to prevent gyp related errors
npm explore npm -g -- npm install node-gyp@latest

# truffle
npm install -g truffle
npm install -g ganache-cli

# project
npm install # in this cloned repository
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

### Use the app
```sh
npm start
```
