package zksync

import (
	"context"
	"cryptopasta/pkg/contracts"
	"log"

	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/clients"
)

const zkSyncSepoliaRpcUrl = "https://sepolia.era.zksync.dev"

func MustNewClient(ctx context.Context) clients.Client {
	client, err := NewClient(ctx)
	if err != nil {
		log.Fatal("failed to create zksync client", "err", err)
	}

	return client
}

func NewClient(ctx context.Context) (clients.Client, error) {
	return clients.DialContext(ctx, zkSyncSepoliaRpcUrl)
}

func MustNewMissionBoard(contractAddr string, client clients.Client) *contracts.MissionBoard {
	missionBoard, err := NewMissionBoard(contractAddr, client)
	if err != nil {
		log.Fatal("failed to create mission board", "err", err)
	}

	return missionBoard
}

func NewMissionBoard(contractAddr string, client clients.Client) (*contracts.MissionBoard, error) {
	missionBoardAddr := common.HexToAddress(contractAddr)
	return contracts.NewMissionBoard(missionBoardAddr, client)
}
