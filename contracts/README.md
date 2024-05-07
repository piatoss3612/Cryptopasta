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

```bash
$ forge script script/AgentRegistry.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast --verify -vvvv

== Logs ==
  AgentRegistry created at address:  0xC9300a9b5171b41fEE74978Ac88C5AdD528Ce286
  AgentAccountFactory created at address:  0x609c70bf6766cDaC87120B52C86A8adaA26f6408
  Agent Token:  0xD120fE2C504Cb1e3600e9768bAcd96F8520C661D
  Agent Account:  0xE4A052076df2d57D3304443DAA64FD947aA9C883
  Token ID:  0
```
