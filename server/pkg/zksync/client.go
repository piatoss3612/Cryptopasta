package zksync

import (
	"context"
	"log"

	"github.com/zksync-sdk/zksync2-go/clients"
)

const ZkSyncSepoliaRpcUrl = "https://sepolia.era.zksync.dev"

func MustNewClient(ctx context.Context) clients.Client {
	client, err := NewClient(ctx)
	if err != nil {
		log.Fatal("failed to create zksync client", "err", err)
	}

	return client
}

func NewClient(ctx context.Context) (clients.Client, error) {
	return clients.DialContext(ctx, ZkSyncSepoliaRpcUrl)
}
