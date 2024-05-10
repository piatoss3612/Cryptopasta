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

AA factory address: 0x4d7068BaA2fB745Ff606778a946394986D91c246
SC Account owner pk:
SC Account deployed on address 0x371A1F490DAaF578f4a93016e90adC8A83348853
Your verification ID is: 12837
Contract successfully verified on zkSync block explorer!
Your verification ID is: 12838
Contract successfully verified on zkSync block explorer!
Done!
Done in 23.18s.
```

### Deploy AgentRegistry

```bash
$ yarn hardhat deploy-zksync --script deployAgentRegistry.ts
yarn run v1.22.21

Agent registry address: 0x3DdfCC2188E7C7595BeC8e132B1b1BE29d6F26d5
Agent token address: 0xF4A5e929a0B725fDe9D4e3eCC5F6108DD6207A4A
Your verification ID is: 12846
Contract successfully verified on zkSync block explorer!
Done!
Done in 17.54s.
```

### Deploy Paymaster

```bash
$ yarn hardhat deploy-zksync --script deployPaymaster.ts
yarn run v1.22.21

AA paymaster address: 0x286B1A1bE286A8dD58115122Ba711bfBB99C51Ed
Your verification ID is: 12847
Contract successfully verified on zkSync block explorer!
Done!
Done in 16.76s.
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

MockUSDT address: 0x2e80b44fdE217F523B82f728ceDE09F58db8f786
MissionLog address: 0x273464a1C2213E05Ef4F75342Ee0691f8Bc2dB87
Your verification ID is: 12849
Contract successfully verified on zkSync block explorer!
Your verification ID is: 12850
Contract successfully verified on zkSync block explorer!
Done!
Done in 23.70s.
```

### Deploy BulletinBoard

```bash
$ yarn hardhat deploy-zksync --script deployBulletinBoard.ts
yarn run v1.22.21

BulletinBoard address: 0x78Aaef8FF303E85aF06e5AA46543Da3DAE349A7a
Cryptopasta address: 0xA12066f1D83B8b00dF0a7f08bfAF47B3Fcd1aF95
Your verification ID is: 12851
Contract successfully verified on zkSync block explorer!
Done!
Done in 17.68s.
```

## Contract Addresses

| Contract Name  | Address                                    |
| -------------- | ------------------------------------------ |
| Factory        | 0x4d7068BaA2fB745Ff606778a946394986D91c246 |
| AgentRegistry  | 0x3DdfCC2188E7C7595BeC8e132B1b1BE29d6F26d5 |
| AgentToken     | 0xF4A5e929a0B725fDe9D4e3eCC5F6108DD6207A4A |
| Paymaster      | 0x286B1A1bE286A8dD58115122Ba711bfBB99C51Ed |
| PriceConverter | 0x308B8b1522AC9D555aa66a8d5153610b11668987 |
| MockUSDT       | 0x2e80b44fdE217F523B82f728ceDE09F58db8f786 |
| MissionLog     | 0x273464a1C2213E05Ef4F75342Ee0691f8Bc2dB87 |
| BulletinBoard  | 0x78Aaef8FF303E85aF06e5AA46543Da3DAE349A7a |
| Cryptopasta    | 0xA12066f1D83B8b00dF0a7f08bfAF47B3Fcd1aF95 |
