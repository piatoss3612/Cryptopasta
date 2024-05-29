# Cryptopasta Server

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
  - [1. Configure the environment](#1-configure-the-environment)
  - [2. Setup MongoDB replica set](#2-setup-mongodb-replica-set)
  - [3. Start the server](#3-start-the-server)
  - [4. Access the API documentation](#4-access-the-api-documentation)

## Features

- [x] **JWT Authentication**
- [x] **User Registration**
- [x] **IPFS File Upload**
- [x] **Text-based adventures**
- [x] **Swagger API Documentation**
- [x] **Dockerized**
- [ ] **CI/CD with Github Actions**
- [ ] **Migrate to Server Sent Events**
- [ ] **Refactor to Clean Architecture**

## Requirements

- [go 1.22](https://golang.org/dl/)
- [docker](https://docs.docker.com/get-docker/)

## Setup

### 1. Configure the environment

```bash
$ cp config.json.example config.json
```

- Update the `config.json` file with your own values.

### 2. Setup MongoDB replica set

- Run the following script to generate the keyfile for the replica set.

```bash
$ sudo bash ./scripts/mongo-rs-keygen.sh
```

- Start the replica set.

```bash
$ docker compose up -d mongo1 mongo2 mongo-setup
```

- mongo-setup container should show the following output at the end.

```bash
test> ... ... ... ... ... ... ... { ok: 1 }
```

### 3. Start the server

```bash
$ docker compose up -d

or

$ docker compose up -d --build
```

### 4. Access the API documentation

- Open your browser and navigate to [http://localhost:1323/swagger/index.html](http://localhost:1323/swagger/index.html)
