package zksync

import (
	"context"
	"cryptopasta/pkg/contracts"

	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/clients"
)

const zkSyncSepoliaRpcUrl = "https://sepolia.era.zksync.dev"

func NewClient(ctx context.Context) (clients.Client, error) {
	return clients.DialContext(ctx, zkSyncSepoliaRpcUrl)
}

func NewAgentRegistry(contractAddr string, client clients.Client) (*contracts.AgentRegistry, error) {
	agentRegistryAddr := common.HexToAddress(contractAddr)
	return contracts.NewAgentRegistry(agentRegistryAddr, client)
}

func NewMissionBoard(contractAddr string, client clients.Client) (*contracts.MissionBoard, error) {
	missionBoardAddr := common.HexToAddress(contractAddr)
	return contracts.NewMissionBoard(missionBoardAddr, client)
}
