# zkSync Hardhat project template

## Requirements

- [node.js](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/getting-started/install)
- [zksync-cli](https://github.com/matter-labs/zksync-cli)

## Install

```bash
$ yarn install
```

## Compile

```bash
$ yarn hardhat compile
```

## Deploy and Verify

### Deploy Factory

```bash
$ yarn hardhat deploy-zksync --script deployFactory.ts
yarn run v1.22.21

AA factory address: 0xe274675aB041F0D11a4A7d009722c732bB830d12
SC Account owner pk:  0x6f1dee0a91e191153c41a543ab874b73f9e1b8718e459b3bbc2cc1ff95603fca
SC Account deployed on address 0xAf7986c3c2Ecb897C27C61fB2d25809319a12c53
Your verification ID is: 13001
Contract successfully verified on zkSync block explorer!
Your verification ID is: 13002
Contract successfully verified on zkSync block explorer!
Done!
Done in 32.30s.
```

### Deploy AgentRegistry

```bash
$ yarn hardhat deploy-zksync --script deployAgentRegistry.ts
yarn run v1.22.21

Agent registry address: 0xe338f781a1AAAcF9d4A2d4DD2B2aCA9D4520CAED
Agent token address: 0xDe0052c31c6168C5A31A22A72afD9a970FaF9eE3
Your verification ID is: 13003
Contract successfully verified on zkSync block explorer!
Done!
Done in 20.02s.
```

### Deploy Paymaster

```bash
$ yarn hardhat deploy-zksync --script deployPaymaster.ts
yarn run v1.22.21

AA paymaster address: 0x92992FF01040bf9C2C1bb7036193d9f457A5BF0c
Your verification ID is: 13004
Contract successfully verified on zkSync block explorer!
Done!
Done in 18.97s.
```

### Deploy PriceConverter

```bash
$ yarn hardhat deploy-zksync --script deployPriceConverter.ts
yarn run v1.22.21

PriceConverter address: 0x308B8b1522AC9D555aa66a8d5153610b11668987
Your verification ID is: 12848
Contract successfully verified on zkSync block explorer!
Done!
Done in 14.30s.
```

### Deploy Tokens

```bash
$ yarn hardhat deploy-zksync --script deployTokens.ts
yarn run v1.22.21

MockUSDT address: 0x29b9215c11a95F2cA9894fe48B907c79406cdaA4
MissionLog address: 0xfF135424230Cb2b40CD80c05a19F8F4eb6b512ad
Your verification ID is: 13005
Contract successfully verified on zkSync block explorer!
Your verification ID is: 13006
Contract successfully verified on zkSync block explorer!
Done!
Done in 22.64s.
```

### Deploy BulletinBoard

```bash
$ yarn hardhat deploy-zksync --script deployBulletinBoard.ts
yarn run v1.22.21

BulletinBoard address: 0xAc66bFEA5150F98C4f93c15023497F93a210accd
Cryptopasta address: 0x3fBC7D8232fcbC1d48e83Ae3c87edDF562D2Fe55
Your verification ID is: 13007
Contract successfully verified on zkSync block explorer!
Done!
Done in 20.75s.
```

## Contract Addresses

| Contract Name  | Address                                    |
| -------------- | ------------------------------------------ |
| Factory        | 0xe274675aB041F0D11a4A7d009722c732bB830d12 |
| AgentRegistry  | 0xe338f781a1AAAcF9d4A2d4DD2B2aCA9D4520CAED |
| AgentToken     | 0xDe0052c31c6168C5A31A22A72afD9a970FaF9eE3 |
| Paymaster      | 0x92992FF01040bf9C2C1bb7036193d9f457A5BF0c |
| PriceConverter | 0x308B8b1522AC9D555aa66a8d5153610b11668987 |
| MockUSDT       | 0x29b9215c11a95F2cA9894fe48B907c79406cdaA4 |
| MissionLog     | 0xfF135424230Cb2b40CD80c05a19F8F4eb6b512ad |
| BulletinBoard  | 0xAc66bFEA5150F98C4f93c15023497F93a210accd |
| Cryptopasta    | 0x3fBC7D8232fcbC1d48e83Ae3c87edDF562D2Fe55 |
