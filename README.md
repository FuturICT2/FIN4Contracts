# FIN4XPLORER

## Context

**FIN4XPLORER** is a decentralised design for a bottom-up and multidimensional finance system with the aim of making communities healthier, more social, and sustainable. It is part of the FLAG-ERA-funded project [FuturICT 2.0](https://futurict2.eu/).

<table border="0"><tr><td>
<a href="https://futurict2.eu/"><img src="public/project-logos/FuturICT2_logo_on_white.png" width="250" ></a></td>
<td>
<img src="public/project-logos/Fin4_logo_on_white.jpg" width="100">
</td></tr></table>

ℹ️ [Explanatory video FIN4](http://www.youtube.com/watch?v=oNlKdHjvExo)
ℹ️ [Explanatory video Accepted Tokens](https://www.youtube.com/watch?v=1bircSUBNm0)

## Description

**FIN4XPLORER** allows any person, organisation, and public institution to create tokens, which stand for a positive action. Users can claim and prove these actions, for which they receive said tokens. By designing the system to be open to markets tailored to the respective actions, incentives are generated. The main characteristics of this system are its decentralization, immutability, rewards, and bottom-up approach. As part of my Master's thesis, I have extended the project with curation system for the Fin4 tokens.

## Quick start

### Install dependencies

```sh
# the basics
sudo apt-get install build-essential python

# node v10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.bashrc
nvm install 10.16.0
nvm use 10.16.0

# on macOS, to prevent gyp related errors
npm explore npm -g -- npm install node-gyp@latest

# truffle
npm install -g truffle
npm install -g ganache-cli

# project
npm install # in this cloned repository
```

### Compile and migrate the smart contracts

1. `npm run start-ganache`
2. `npm run migrate`
4. install the [MetaMask](https://metamask.io/) browser extension, paste the `MNEMONIC` from Ganache into the `seed` input and create a network with `http://127.0.0.1:7545` as `custom RPC`

### Use the app
```sh
npm start
```

### Project Structure

* `contracts/` contains the developed smart contracts (e.g Fin4Reputation)
* `contracts/tcr` contains the TCR of the list of accepted tokens
* `contracts/tokens` contains the GOV token and ERC20Plus
* `migrations/3_deploy_tcr.js` contains the deployment script for the tcr
* `scripts` contains scripts that can be used for testing the tcr. However, now that we have a front-end app, they are not needed anymore
* `src` contains the web app
