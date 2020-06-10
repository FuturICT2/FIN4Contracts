# FIN4Contracts

These are the smart contracts of the [FIN4Xplorer](https://github.com/FuturICT2/FIN4Xplorer).

# Setup

## Dependencies

```sh
# basics
sudo apt-get install git build-essential python

# node v10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.bashrc
nvm install 10.0.0
nvm use 10.0.0

# on macOS, to prevent gyp related errors
npm explore npm -g -- npm install node-gyp@latest

# truffle
npm install -g truffle
# for local development: ganache-cli or the GUI app from trufflesuite.com/ganache
npm install -g ganache-cli

# project
npm install
```

### Config file

The file `config.json` at root level must be added and filled.

The first two fields are only necessary for non-local deployments and are used in `truffle-config.js`. The account encoded by the mnemonic is paying the deployment costs. Therefore it has to have sufficient funds on the respective network. The *Infura API* key can be obtained by creating a project on infura.io: it is the *Project ID* under *View Project*.

The last two fields define where `truffle` compiles the contract into JSON format and where the deployment info (`Fin4Main` address and the name of the network) will be saved to during deployment. In the example below, these paths are set in a way that assumes this FIN4Contracts repo to be sitting next to the [FIN4Xplorer](https://github.com/FuturICT2/FIN4Xplorer) repo containing the frontend react app. There these files are required for running the app. If you don't build these contracts/addresses files directly there but want to run the frontend, you must manually make sure to place them where the frontend expects them.

```json
{
    "MNEMONIC": "",
    "INFURA_API_KEY": "",
    "CONTRACTS_BUILD_DIRECTORY": "../FIN4Xplorer/src/build/contracts",
    "DEPLOYMENT_INFO_SAVING_LOCATION": "../../FIN4Xplorer/src/config"
}
```

## Deployment

To deploy the smart contracts to a local Ganache instance, run:
```sh
truffle migrate
```
To avoid weird in-between states I would recommend to delete the `/build/contract` folder each time before migrating the contracts again. If the repos are sitting next to each other, that would look like this: `rm -r ../FIN4Xplorer/src/builds`.

To deploy to the Rinkeby testnet, use:

```sh
truffle migrate --network rinkeby
```
