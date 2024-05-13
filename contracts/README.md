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

AA factory address: 0xBF6f49310379154b3907F7142FEb09107a6009D3
SC Account owner pk:
SC Account deployed on address 0x96324917bAaed3bb2b2418517eCaB87cdB6d802f
Your verification ID is: 13054
Contract successfully verified on zkSync block explorer!
Your verification ID is: 13055
Contract successfully verified on zkSync block explorer!
Done!
Done in 32.16s.
```

### Deploy AgentRegistry

```bash
$ yarn hardhat deploy-zksync --script deployAgentRegistry.ts
yarn run v1.22.21

Agent registry address: 0xC40416509213951995078dba6a309F234c3eC9B8
Agent token address: 0x986bD9FCecbe530A33c53E2a4333c9ae516ab892
Your verification ID is: 13056
Contract successfully verified on zkSync block explorer!
Done!
Done in 20.42s.
```

### Deploy Paymaster

```bash
$ yarn hardhat deploy-zksync --script deployPaymaster.ts
yarn run v1.22.21

AA paymaster address: 0x68f52F79D8bdD1ab1dd8f9C150Af111Dbf59d88d
Your verification ID is: 13057
Contract successfully verified on zkSync block explorer!
Done!
Done in 18.39s.
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

MockUSDT address: 0xE7D83827A084208F7d65bf98D4B21c23C887da32
MissionLog address: 0xE0cFF39d2019122B61c1c1B1320faf5C54c01B18
Your verification ID is: 13058
Contract successfully verified on zkSync block explorer!
Your verification ID is: 13059
Contract successfully verified on zkSync block explorer!
Done!
Done in 24.38s.
```

### Deploy BulletinBoard

```bash
$ yarn hardhat deploy-zksync --script deployBulletinBoard.ts
yarn run v1.22.21

BulletinBoard address: 0xB05EC2bb6b965b4D0Bd2E6c48fF7f0f9D83a4e91
Cryptopasta address: 0x526a3340332DB7633124caD3a3Dcf42D5adaD246
Your verification ID is: 13060
Contract successfully verified on zkSync block explorer!
Done!
Done in 21.47s.
```

## Contract Addresses

| Contract Name  | Address                                    |
| -------------- | ------------------------------------------ |
| Factory        | 0xBF6f49310379154b3907F7142FEb09107a6009D3 |
| AgentRegistry  | 0xC40416509213951995078dba6a309F234c3eC9B8 |
| AgentToken     | 0x986bD9FCecbe530A33c53E2a4333c9ae516ab892 |
| Paymaster      | 0x68f52F79D8bdD1ab1dd8f9C150Af111Dbf59d88d |
| PriceConverter | 0x308B8b1522AC9D555aa66a8d5153610b11668987 |
| MockUSDT       | 0xE7D83827A084208F7d65bf98D4B21c23C887da32 |
| MissionLog     | 0xE0cFF39d2019122B61c1c1B1320faf5C54c01B18 |
| BulletinBoard  | 0xB05EC2bb6b965b4D0Bd2E6c48fF7f0f9D83a4e91 |
| Cryptopasta    | 0x526a3340332DB7633124caD3a3Dcf42D5adaD246 |
