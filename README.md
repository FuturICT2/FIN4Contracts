# DLT4PI-FIN4
Team **Action Magic for Finance 4.0** in the SoSe2019 [TUM](https://www.tum.de/) course [*Advanced Practical Course - Blockchain technology for public sector innovation*](https://campus.tum.de/tumonline/wbLv.wbShowLVDetail?pStpSpNr=950404716&pSpracheNr=2) at [fortiss](https://www.fortiss.org/) with [Marcus Dapp](http://digisus.com/) ([FuturICT 2.0](https://futurict2.eu/)) from [ETH Zürich](https://www.ethz.ch/) as partner.

**Team**: [@simonzachau](https://github.com/simonzachau) | [@benjaminaaron](https://github.com/benjaminaaron) |  [@sangeetajoseph8](https://github.com/sangeetajoseph8) | [@ShreshthaKriti](https://github.com/ShreshthaKriti) | [@leonKObi](https://github.com/leonKObi)

<table border="0"><tr><td>
<a href="https://futurict2.eu/"><img src="public/project-logos/FuturICT2_logo_on_white.png" width="250" ></a></td>
<td>
<img src="public/project-logos/Fin4_logo_on_white.jpg" width="100">
</td></tr></table>

YouTube Image Film:

[![](http://img.youtube.com/vi/oNlKdHjvExo/0.jpg)](http://www.youtube.com/watch?v=oNlKdHjvExo "Finance 4.0")

---

## Setup

Install `yarn`, `truffle`, `git`, `make`, `docker`, and `docker compose`

```sh
# yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# npm
sudo apt install npm

# truffle
sudo npm install -g truffle
sudo npm install -g ganache-cli
```

#### For testnet-deployment 
Add and fill this file: `src/config/ethereum-keys.json`
```json
{
    "MNEMONIC": "",
    "INFURA_API_KEY": ""
}
```

#### Install dependencies
```sh
yarn install # try 'npm install' if yarn doesn't work
```

#### Compile and migrate the smart contracts

1. `truffle compile`
2. `ganache-cli --port=7545 --allowUnlimitedContractSize`
3. `truffle migrate` to place the smart contract on the local blockchain
4. install the [MetaMask](https://metamask.io/) browser extension, paste the `MNEMONIC` from Ganache into the `seed` input and `http://127.0.0.1:7545` into `custom RPC` input

#### Start a local BigchainDB node
Used for offers on the marketplace

1. `git clone https://github.com/bigchaindb/bigchaindb.git`
2. `cd bigchaindb`
3. `make run`

## Start the react app
```sh
yarn start
```
