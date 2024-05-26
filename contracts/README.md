# zkSync Hardhat project

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Install Dependencies](#install-dependencies)
- [Compile Contracts](#compile-contracts)
- [Deploy and Verify Contracts](#deploy-and-verify-contracts)
  - [1. Deploy Account Factory](#1-deploy-account-factory)
  - [2. Deploy AgentRegistry](#2-deploy-agentregistry)
  - [3. Deploy MockUSDT](#3-deploy-mockusdt)
  - [4. Deploy PriceConverter](#4-deploy-priceconverter)
  - [5. Deploy Paymaster](#5-deploy-paymaster)
  - [6. Deploy MissionLog](#6-deploy-missionlog)
  - [7. Deploy MissionBoard](#7-deploy-missionboard)
- [Contract Addresses on zkSync Sepolia](#contract-addresses-on-zksync-sepolia)

## Introduction

| Contract Name       | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| AgentAccountFactory | Create account abstraction accounts for agents                            |
| AgentRegistry       | Store agent information and their respective account abstraction accounts |
| AgentToken          | ERC721 & ERC6454 soul-bound token for agents                              |
| AgentPaymaster      | Pay gas fees only for agents in daily limited manner + ERC20 support      |
| PriceConverter      | Convert prices of USD, ETH, and USDT, using Chainlink price feeds         |
| MockUSDT            | Mock USDT ERC20 token for testing purposes                                |
| MissionLog          | ERC721 token for agents to mint visual representation of their missions   |
| MissionBoard        | Marketplace for agents to create and accept missions                      |
| Cryptopasta         | ERC1155 token of MissionBoard for agents to trade or interact with        |

## Requirements

- [node.js](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/getting-started/install)
- [zksync-cli](https://github.com/matter-labs/zksync-cli)

## Install Dependencies

```bash
$ yarn install
```

## Compile Contracts

```bash
$ yarn hardhat compile
```

## Deploy and Verify Contracts

### 1. Deploy Account Factory

```bash
$ yarn hardhat deploy-zksync --script deployFactory.ts
yarn run v1.22.21

AA factory address: 0x3ceC7eDbCa2Cba9560fD6Abe007b5C6581b6D040
Your verification ID is: 13316
Contract successfully verified on zkSync block explorer!
Done!
Done in 18.79s.
```

### 2. Deploy AgentRegistry

> **Note:** Before deploying `AgentRegistry`, make sure to update the `factoryAddress` in `deployAgentRegistry.ts` with the deployed `AgentAccountFactory` address.

```bash
$ yarn hardhat deploy-zksync --script deployAgentRegistry.ts
yarn run v1.22.21

Agent registry address: 0xD55Eb78A4A49932EAB908ed2163fE430d7878605
Agent token address: 0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93
Your verification ID is: 13317
Contract successfully verified on zkSync block explorer!
Done!
Done in 19.85s.
```

### 3. Deploy MockUSDT

```bash
$ yarn hardhat deploy-zksync --script deployMockUSDT.ts
yarn run v1.22.21

MockUSDT address: 0xc8653E56042003482E7561Cf34d882da4f6709d4
Your verification ID is: 13318
Contract successfully verified on zkSync block explorer!
Done!
Done in 13.81s.
```

### 4. Deploy PriceConverter

```bash
$ yarn hardhat deploy-zksync --script deployPriceConverter.ts
yarn run v1.22.21

PriceConverter address: 0x824b601A2fEC9528829490BaC1C61d94DB575266
Your verification ID is: 13319
Contract successfully verified on zkSync block explorer!
Done!
Done in 16.45s.
```

### 5. Deploy Paymaster

> **Note:** Before deploying `AgentPaymaster`, make sure to update the `erc721Address`, `priceConverterAddress`, and `mockUSDTAddress` in `deployPaymaster.ts` with the deployed `AgentToken`, `PriceConverter`, and `MockUSDT` addresses respectively.

```bash
$ yarn hardhat deploy-zksync --script deployPaymaster.ts
yarn run v1.22.21

AA paymaster address: 0x33CC626e835b5BbEBdEF7084E132E78398CAC8A1
Your verification ID is: 13426
Contract successfully verified on zkSync block explorer!
Done!
Done in 19.73s.
```

### 6. Deploy MissionLog

> **Note:** Before deploying `MissionLog`, make sure to update the `agentTokenAddress` in `deployMissionLog.ts` with the deployed `AgentToken` address.

```bash
$ yarn hardhat deploy-zksync --script deployMissionLog.ts
yarn run v1.22.21

MissionLog address: 0x3859B26bfE58a0E9A019b76aBC051ee46D4d85eB
Your verification ID is: 13321
Contract successfully verified on zkSync block explorer!
Done!
Done in 15.56s.
```

### 7. Deploy MissionBoard

> **Note:** Before deploying `MissionBoard`, make sure to update the `agentTokenAddress`, `usdtAddress`, and `priceConverterAddress` in `deployMissionBoard.ts` with the deployed `AgentToken`, `MockUSDT`, and `PriceConverter` addresses respectively.

```bash
$ yarn hardhat deploy-zksync --script deployMissionBoard.ts
yarn run v1.22.21

MissionBoard address: 0x08752bD7Df05Eea6021CEbBE4181cBd9C70611F6
Cryptopasta address: 0xE3291AE3eDCa1b456ec369B0Bf3aFA2E27e50c71
Your verification ID is: 14214
Contract successfully verified on zkSync block explorer!
Done!
Done in 24.91s.
```

## Contract Addresses on zkSync Sepolia

| Contract Name       | Address                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| AgentAccountFactory | [0x3ceC7eDbCa2Cba9560fD6Abe007b5C6581b6D040](https://sepolia.explorer.zksync.io/address/0x3ceC7eDbCa2Cba9560fD6Abe007b5C6581b6D040#transactions) |
| AgentRegistry       | [0xD55Eb78A4A49932EAB908ed2163fE430d7878605](https://sepolia.explorer.zksync.io/address/0xD55Eb78A4A49932EAB908ed2163fE430d7878605#transactions) |
| AgentToken          | [0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93](https://sepolia.explorer.zksync.io/address/0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93#transactions) |
| AgentPaymaster      | [0x33CC626e835b5BbEBdEF7084E132E78398CAC8A1](https://sepolia.explorer.zksync.io/address/0x33CC626e835b5BbEBdEF7084E132E78398CAC8A1#transactions) |
| PriceConverter      | [0x824b601A2fEC9528829490BaC1C61d94DB575266](https://sepolia.explorer.zksync.io/address/0x824b601A2fEC9528829490BaC1C61d94DB575266#transactions) |
| MockUSDT            | [0xc8653E56042003482E7561Cf34d882da4f6709d4](https://sepolia.explorer.zksync.io/address/0xc8653E56042003482E7561Cf34d882da4f6709d4#transactions) |
| MissionLog          | [0x3859B26bfE58a0E9A019b76aBC051ee46D4d85eB](https://sepolia.explorer.zksync.io/address/0x3859B26bfE58a0E9A019b76aBC051ee46D4d85eB#transactions) |
| MissionBoard        | [0x08752bD7Df05Eea6021CEbBE4181cBd9C70611F6](https://sepolia.explorer.zksync.io/address/0x08752bD7Df05Eea6021CEbBE4181cBd9C70611F6#transactions) |
| Cryptopasta         | [0xE3291AE3eDCa1b456ec369B0Bf3aFA2E27e50c71](https://sepolia.explorer.zksync.io/address/0xE3291AE3eDCa1b456ec369B0Bf3aFA2E27e50c71#transactions) |
