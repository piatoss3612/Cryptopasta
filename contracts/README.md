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

AA factory address: 0x3ceC7eDbCa2Cba9560fD6Abe007b5C6581b6D040
Your verification ID is: 13316
Contract successfully verified on zkSync block explorer!
Done!
Done in 18.79s.
```

### Deploy AgentRegistry

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

### Deploy MockUSDT

```bash
$ yarn hardhat deploy-zksync --script deployMockUSDT.ts
yarn run v1.22.21

MockUSDT address: 0xc8653E56042003482E7561Cf34d882da4f6709d4
Your verification ID is: 13318
Contract successfully verified on zkSync block explorer!
Done!
Done in 13.81s.
```

### Deploy PriceConverter

```bash
$ yarn hardhat deploy-zksync --script deployPriceConverter.ts
yarn run v1.22.21

PriceConverter address: 0x824b601A2fEC9528829490BaC1C61d94DB575266
Your verification ID is: 13319
Contract successfully verified on zkSync block explorer!
Done!
Done in 16.45s.
```

### Deploy Paymaster

```bash
$ yarn hardhat deploy-zksync --script deployPaymaster.ts
yarn run v1.22.21

AA paymaster address: 0x33CC626e835b5BbEBdEF7084E132E78398CAC8A1
Your verification ID is: 13426
Contract successfully verified on zkSync block explorer!
Done!
Done in 19.73s.
```

### Deploy MissionLog

```bash
$ yarn hardhat deploy-zksync --script deployMissionLog.ts
yarn run v1.22.21

MissionLog address: 0x3859B26bfE58a0E9A019b76aBC051ee46D4d85eB
Your verification ID is: 13321
Contract successfully verified on zkSync block explorer!
Done!
Done in 15.56s.
```

### Deploy MissionBoard

```bash
$ yarn hardhat deploy-zksync --script deployMissionBoard.ts
yarn run v1.22.21

MissionBoard address: 0xa4a28578aFb1558dbd648089433892597417B638
Cryptopasta address: 0xff8864cF6C9D47Aee270BDb2E4C2B2618c724374
Your verification ID is: 13323
Contract successfully verified on zkSync block explorer!
Done!
Done in 19.93s.
```

## Contract Addresses

| Contract Name  | Address                                    |
| -------------- | ------------------------------------------ |
| Factory        | 0x3ceC7eDbCa2Cba9560fD6Abe007b5C6581b6D040 |
| AgentRegistry  | 0xD55Eb78A4A49932EAB908ed2163fE430d7878605 |
| AgentToken     | 0xc64149F1dc4b3d3Dc6157a9b7e94473cb4089D93 |
| Paymaster      | 0x33CC626e835b5BbEBdEF7084E132E78398CAC8A1 |
| PriceConverter | 0x824b601A2fEC9528829490BaC1C61d94DB575266 |
| MockUSDT       | 0xc8653E56042003482E7561Cf34d882da4f6709d4 |
| MissionLog     | 0x3859B26bfE58a0E9A019b76aBC051ee46D4d85eB |
| MissionBoard   | 0xa4a28578aFb1558dbd648089433892597417B638 |
| Cryptopasta    | 0x681fD7152715c295f801E8c49F97103B1B011D0F |
