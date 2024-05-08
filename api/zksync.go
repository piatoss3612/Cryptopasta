package main

import (
	"context"
	"cryptopasta-api/contracts"
	"log"

	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/clients"
)

var zkSyncSepoliaRpcUrl = "https://sepolia.era.zksync.dev"

func connect() {
	client, err := clients.DialContext(context.Background(), zkSyncSepoliaRpcUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	agentRegistryAddr := common.HexToAddress("0xC9300a9b5171b41fEE74978Ac88C5AdD528Ce286")

	registry, err := contracts.NewAgentRegistry(agentRegistryAddr, client)
	if err != nil {
		log.Fatal(err)
	}

	owner, err := registry.Owner(nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Owner: %s", owner.Hex())
}
