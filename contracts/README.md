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

### AgentRegistry

```bash
$ forge script script/AgentRegistry.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentRegistry created at address:  0xef02B6e0380d241EF3512a7Bd5476b0A0B7d37f3
  AgentAccountFactory created at address:  0xff964183D5FEAfE1F194939aB00d423348277f6d
  Agent Token:  0xfaE076ACc8bc7FC70a8C9137FB1Bf07983D62A9A
```

### AgentPaymaster

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentPaymaster:  0xE85E63D8aF5fcE8ec83F55cE242b60003E61C3B1
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
  BulletinBoard:  0xCB7C3397B32a33527a98Dc8a72F842aD57c077fD
  Cryptopasta:  0xeD2A2A78fE1c7D2A6E1AB8Bf47C12E92FCdedFb9
```

### MissionLog

```bash
$ forge script script/MissionLog.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  MissionLog:  0xaE231EEc46ec4500B7c88378c07d5918FB5ea586
```

### Fund to Paymaster

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv --sig "fund(address)" -- 0xE85E63D8aF5fcE8ec83F55cE242b60003E61C3B1
```

> Sending ETH in foundry just not working. Used `metamask` wallet to send ETH to the paymaster.
