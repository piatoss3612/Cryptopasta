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

```bash
$ forge script script/AgentRegistry.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentRegistry created at address:  0x01592110A91cdA4AD3D229a66a51A4FEeb0Db922
  AgentAccountFactory created at address:  0xff964183D5FEAfE1F194939aB00d423348277f6d
  Agent Token:  0x65dcD3047bA46e2926CC4C077A8F8477B91F333b
  Agent Account:  0x6788514dD11790c0F860dbC6F9b89D05582e3251
  Token ID:  0
```

```bash
$ forge script script/AgentPaymaster.s.sol --zksync --rpc-url zksync-sepolia --account piatoss --sender 0x965B0E63e00E7805569ee3B428Cf96330DFc57EF --legacy --broadcast -vvvv

== Logs ==
  AgentPaymaster:  0xc35D29721aa5Aca7321AFd26FF4E24BA9915dEF6
```
