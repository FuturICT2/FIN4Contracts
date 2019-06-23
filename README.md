# FINFOO

#### Team 43 @ [#SBHACK19](https://hackathon.trustsquare.ch/)
[@benjaminaaron](https://github.com/benjaminaaron) |  [@sangeetajoseph8](https://github.com/sangeetajoseph8) | [@ShreshthaKriti](https://github.com/ShreshthaKriti) | [@simonzachau](https://github.com/simonzachau)

## Try it out

The live deployment is located at:
`http://ec2-18-209-102-101.compute-1.amazonaws.com:3000`

Set up your MetaMask extension to point to the AVADO "Ethereum Goerli testnet node". If you are in the Trust Square network, use `http://172.20.0.103:8545`, otherwise `http://62.12.152.38:8548`.

Make sure you have some Goerli Ether by using your MetaMask account address in the Goerli-faucet: `https://goerli-faucet.slock.it`

## Inspiration

*FINFOO* is a multidimensional and multilayered finance system, destined to develop into a self-organizing and nuanced incentive system to contribute to healthier and more vibrant social and ecological spaces worldwide. More info in our video.

## What it does

The landing page contains two elements: you can either **create a new action type** (e.g. with the goal of encouraging your local community to plant trees or to motivate your employees to bike to work) or **claim an action** that you did. The latter you would do for instance once you did plant a tree or biked to your workplace.

Once you submitted a claim (note that *quantity* relates to what the action type creator intends to use as a unit for these types of action) and the transaction is confirmed, a box with all your claims shows up on the right side - both the approved ones as well as the ones not yet approved.

For now, all odd claims get approved automatically and the respective quantities get minted to your balance on the respective action type smart contract. As a next step, we want to implement proofs that user have to submit to get their claims approved. More on that under *Proofs* in the *What's next* section.

The second page to be accessed via the bottom bar, *More*, shows a users balances in the various action types that she successfully claimed. Furthermore a first draft of a "Marketplace" can be seen there - you can choose to donate from your accumulated balances to the organizations listed there. Regarding more possible future use cases see *Marketplace* in the *What's next* section.

## How we built it

We started with `truffle init` and `create-react-app` to get a skeleton for both connecting to blockchains as well as having a frontend. To make calls to the smart contracts we use `drizzle`. Each time an action type is created, an **ERC-20** token get's newly deployed. The signing of transactions happens via **MetaMask**. Locally we used **Ganache** as personal Ethereum blockchain. The deployment on the AWS EC2 instance (see the *Try it out* section above) connects via the AVADO node (in the Trust Square network) to the Ethereum Goerli testnet. This approach is preferrable over using centralized services like Infura.

## Challenges we ran into

infura

## Accomplishments that we're proud of
 
## What we learned

## What's next for FINFOO

#### Proofs
We want to implement a way for action type creators to choose from various proof types that users will have to provide when they submit a claim. For instance one proof type smart contract could handle uploaded photos (stored in IPFS) and show them to the action type creator to get approved or not. Another proof type could use oracles to ask for a users location history to verify she was at a certain place at a certain time. Yet another one could ask users doing an action together to bump their phones together for an NFC handshake etc. Ideally an action type creator can choose from a sufficient amount of readily build proof type smart contracts. Should she need another one though, we want to make it relatively easy to deploy one with the custom logic.

#### Marketplace
Besides donating to organizations we also want to support donations to individuals (maybe you want to donate some of your collected hours in a timebank-like scheme to an elderly person who can't collect hours easily). Ideally involvement on the marketplace itself gets rewarded with a type of meta appreciation token.

TODO rewards

## Setup for testnet deployment

Add and fill this file: `src/config/keys.json`
```json
{
    "MNEMONIC": "",
    "INFURA_API_KEY": ""
}
```