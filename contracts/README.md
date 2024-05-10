# Cryptopasta Contracts

## Requirements

- [foundry-zksync](https://github.com/matter-labs/foundry-zksync)
- [node.js](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/getting-started/install)

## Install

```bash
$ forge install
```

## Build

```bash
$ forge build --zksync
```

## Deploy

- Several transactions at the same time may cause the transaction to fail. Please deploy one by one.

### AgentAccountFactory

> I used separate hardhat project to deploy factory with the system flag. It's not working with foundry.

```bash
AA factory address: 0xd2Edb65F2Be809B76Da1A88eb04F76a8b419FA14
```

### AgentRegistry

```bash
$ forge script script/AgentRegistry.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentRegistry created at address:  0xE30CC547776E79519b437dC08592c5A9b82e81B4
  AgentAccountFactory created at address:  0xd2Edb65F2Be809B76Da1A88eb04F76a8b419FA14
  Agent Token:  0xC16A43E63fa3D48797025dE4d3e838A9fb9C358c
```

### AgentPaymaster

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentPaymaster:  0x71D5Fbc99fD33c1957BaC29D68AB38B989cE3ac7
  AgentPaymaster balance:  1000000000000000000
```

### PriceConverter

```bash
$ forge script script/PriceConverter.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  PriceConverter:  0x9b12Bcf86fAdd8f207C20ECCFc1f5b28F87bd585
  5 USD to ETH:  1625000000000000
```

### MockUSDT

```bash
$ forge script script/MockUSDT.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  MockUSDT:  0xe4b95df5D50F8ACa7b5Dd282922D1632c868d252
```

### BulletinBoard

```bash
$ forge script script/BulletinBoard.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  BulletinBoard:  0x027110596dB91a693a15eF4F6b132b886797E4D4
  Cryptopasta:  0xF255b2B30e1c8958bb01d51066169F68252488f7
```

### MissionLog

```bash
$ forge script script/MissionLog.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  MissionLog:  0x9691012fE3C14F4F075650D71262D31C842b6d2D
```

### Fund to Paymaster

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv --sig "fund(address)" -- 0xE85E63D8aF5fcE8ec83F55cE242b60003E61C3B1
```

> Sending ETH in foundry just not working. Used `metamask` wallet to send ETH to the paymaster.

### Withdraw from Paymaster

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv --sig "withdraw(address)" -- 0xE85E63D8aF5fcE8ec83F55cE242b60003E61C3B1
```
