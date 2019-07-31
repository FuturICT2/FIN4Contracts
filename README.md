# FINFOO

## Context

**FINFOO** is a decentralised design for a bottom-up and multidimensional finance system with the aim of making communities healthier, more social, and sustainable. It is based on Finance4, part of the FLAG-ERA-funded project [FuturICT 2.0](https://futurict2.eu/), on which we are working on as part of the course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/).

<table border="0"><tr><td>
<a href="https://futurict2.eu/"><img src="public/project-logos/FuturICT2_logo_on_white.png" width="250" ></a></td>
<td>
<img src="public/project-logos/Fin4_logo_on_white.jpg" width="100">
</td></tr></table>

**Image Film**:

[![](http://img.youtube.com/vi/oNlKdHjvExo/0.jpg)](http://www.youtube.com/watch?v=oNlKdHjvExo "Finance 4.0")

## Description

**FINFOO** allows any person, organisation, and public institution to create tokens, which stand for a positive action. Users can claim and prove these actions, for which they receive said tokens. By designing the system to be open to markets tailored to the respective actions, incentives are generated. The main characteristics of this system are its decentralization, immutability, rewards, and bottom-up approach.

## Developers

[@benjaminaaron](/benjaminaaron) | [@simonzachau](/simonzachau) | [@sangeetajoseph8](/sangeetajoseph8) | [@ShreshthaKriti](/ShreshthaKriti) | [@leonKObi](/leonKObi)

## Assumptions

- We assume a certain tech-savvyness of users to get Ethereum on their account and handle the MetaMask popups. Our interviews with stakeholders proved that this is given.
- Furthermore we assume a certain community engagement to be present that makes people want to use the plattform to participate in the token economy.

## Architecture

<table border="0"><tr>
<td><img src="https://user-images.githubusercontent.com/5141792/61829156-9f107b00-ae68-11e9-8ab7-6800f249caf8.png" width="500" ></a></td>
<br/>
<td><img src="https://user-images.githubusercontent.com/5141792/61829167-a3d52f00-ae68-11e9-98ef-76878f39d2d8.png" width="500" ></a></td>
</table>

![File Structure](
https://user-images.githubusercontent.com/9423641/62013340-4f47f180-b191-11e9-8e9f-fa45b0577063.png "File Structure")

## Quick start

### Install dependencies

```sh
# make, python, gcc, ... (python needs to be in the $PATH afterwards)
sudo apt-get install build-essential python

# node v10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.bashrc
nvm install 10.0.0
nvm use 10.0.0

# truffle
npm install -g truffle
npm install -g ganache-cli

# project
npm install
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

#### Video tutorial on using the application

[![](https://img.youtube.com/vi/suODLSig1sA/0.jpg)](https://youtu.be/suODLSig1sA)

#### Errors / Considerations

- During some development cycles involving re-migration, new mnemonics etc. strange errors were occuring in relation to the local ganache-blockchain. Sometimes these could only be resolved by manually resetting everything: deleting the `src/build`-folder, a new workspace in Ganache, logging out in MetaMask, closing Chrome and restoring from the new mnemonic.
- When adding a new action type and then adding a new proof type for that action type, a modal may pop up that let's you select parameters for that proof type. In case you decide (instead of specifying the parameters) to not want to add this proof type anymore, clicking on the "x" in the top right corner of the modal is not enough; you also have to then click on the "x" of the proof type in the selection.
- After submitting any form you currently need to reload the page in order to see the wanted changes, e.g. when creating a new action type, you need to reload the page in order to select the action type in a claim.
