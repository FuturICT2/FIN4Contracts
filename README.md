# FINFOO ([#SBHACK19](https://hackathon.trustsquare.ch/) project)

**Winner of the prize *Fast track to [CV Labs Blockchain Incubator](https://cvvc.com/index.php/cv-labs/our-project-one/programm)***

[@benjaminaaron](https://github.com/benjaminaaron) |  [@sangeetajoseph8](https://github.com/sangeetajoseph8) | [@ShreshthaKriti](https://github.com/ShreshthaKriti) | [@simonzachau](https://github.com/simonzachau)

---
- URL to working application: `http://ec2-18-209-102-101.compute-1.amazonaws.com:3000` (see section *Try it out*)
- URL to public github repository: `https://github.com/benjaminaaron/FINFOO`
- Short description about our application and usage description of the live deployment are below
---

## Try it out

The live deployment is located at:
`http://ec2-18-209-102-101.compute-1.amazonaws.com:3000`

Set up your MetaMask extension to point to the AVADO "Ethereum Goerli testnet node". If you are in the Trust Square network, use `http://172.20.0.103:8545`, otherwise `http://62.12.152.38:8548`.

Make sure you have some Goerli Ether by using your MetaMask account address in the Goerli-faucet: `https://goerli-faucet.slock.it`

Please be patient when some transactions might take a little longer. Also note that the balances in the "More" view under "My Action Tokens" are wrongly showing `0`. This works locally but not on the deployment so far.

## Inspiration

*FINFOO* is a multidimensional and multilayered finance system, destined to develop into a self-organizing and nuanced incentive system to contribute to healthier and more vibrant social and ecological spaces worldwide. More info in our video.

## What it does

The landing page contains two elements: you can either **create a new action type** (e.g. with the goal of encouraging your local community to plant trees or to motivate your employees to bike to work) or **claim an action** that you did. The latter you would do for instance once you did plant a tree or biked to your workplace.

Once you submitted a claim (note that *quantity* relates to what the action type creator intends to use as a unit for these types of action) and the transaction is confirmed, a box with all your claims shows up on the right side - both the approved ones as well as the ones not yet approved.

For now, all odd claims get approved automatically and the respective quantities get minted to your balance on the respective action type smart contract. As a next step, we want to implement proofs that user have to submit to get their claims approved. More on that under *Proofs* in the *What's next* section.

The second page to be accessed via the bottom bar, *More*, shows a users balances in the various action types that she successfully claimed. Furthermore a first draft of a "Marketplace" can be seen there - you can choose to donate from your accumulated balances to the organizations listed there. Regarding more possible future use cases see *Marketplace* in the *What's next* section.

## How we built it

We started with `truffle init` and `create-react-app` to get a skeleton for both connecting to blockchains as well as having a frontend. To make calls to the smart contracts we use `drizzle`.

Each time an action type is created, an **ERC-20** token get's newly deployed. The signing of transactions happens via **MetaMask**. Locally we used **Ganache** as personal Ethereum blockchain.

For deploying our solution we instantiated the "Truffle Ethereum Development" template from the **AWS** marketplace as **EC2** instance.

The deployment on the AWS EC2 instance (see the *Try it out* section above) connects via the **AVADO node** (in the Trust Square network) to the Ethereum Goerli testnet. This approach is preferrable over using centralized services like Infura.

## Challenges we ran into

The versions of truffle and especially solidity have been changing rapidly in the last months, therefore a lot of the documentation and examples we found online are outdated and require modification to use it with the current version. So lots of times we couldn't find reliable sources and had to tinker with things ourselves. Some things are rather unintuitive when coming from "conventional programming", like how hard it can be to return a string array from a smart contract function.

The local AVADO node was only visible within the network, so our AWS instance wasn't able to connect to it. This took a while to realize. The AVADO team then kindly provided us with a publicly accessible URL.

The difference in workflow of local Ganache vs. testnet is different and it took us some time to figure things out.

## Accomplishments that we're proud of

To get something functional up and running in such a small time. And the cause itself could really be worth it and create a lot of good in the world.
 
## What we learned

We had almost no blockchain-implementation experience beforehand, so the learning curve was very steep and therefore rewarding.

We learned to use the tools listed in *How we built it* and definitely improved our team communication and code-collaboration skills.

Also for all of us it was the first time in Zürich and we really enjoyed experiencing the city a little bit.

## What's next for FINFOO

#### Proofs
We want to implement a way for action type creators to choose from various proof types that users will have to provide when they submit a claim. For instance one proof type smart contract could handle uploaded photos (stored in IPFS) and show them to the action type creator to get approved or not. Another proof type could use oracles to ask for a users location history to verify she was at a certain place at a certain time. Yet another one could ask users doing an action together to bump their phones together for an NFC handshake etc. Ideally an action type creator can choose from a sufficient amount of readily build proof type smart contracts. Should she need another one though, we want to make it relatively easy to deploy one with the custom logic.

#### Marketplace
Besides donating to organizations we also want to support donations to individuals (maybe you want to donate some of your collected hours in a timebank-like scheme to an elderly person who can't collect hours easily). 

Furthermore, organizations or NGOs with social or ecological should be able to offer rewards for people who collected certain types of tokens.

Ideally involvement on the marketplace itself gets rewarded with a type of meta appreciation token.

When giving it the right spin and getting insurances and governments on board (as proof of the social engagement of citizens), this could even evolve into a social global welfare fund.

## Setup for testnet deployment

Add and fill this file: `src/config/keys.json`
```json
{
    "MNEMONIC": "",
    "INFURA_API_KEY": ""
}
```
