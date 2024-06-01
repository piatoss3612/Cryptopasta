# Cryptopasta Web

## Requirements

- [nodejs](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/getting-started/install)

## Setup

### 1. Configure the environment

```bash
$ cp .env.local.example .env.local
```

- Update the `.env.local` file with your own values.

```.env
NEXT_PUBLIC_PRIVY_APP_ID= # Privy app id (required)
NEXT_PUBLIC_ZKSYNC_SEPOLIA_RPC_URL = # ZkSync Sepolia RPC URL (required)
```

### 2. Install dependencies

```bash
$ yarn install
```

### 3. Start the server

```bash
$ yarn dev
```
