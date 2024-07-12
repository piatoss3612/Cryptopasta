package board

import (
	"context"
	"cryptopasta/internal/mission"
	"encoding/json"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/zksync-sdk/zksync2-go/clients"
)

type boarder struct {
	client       clients.Client
	boardAddress common.Address
	board        *MissionBoard
}

func New(client clients.Client, boardAddress common.Address) (*boarder, error) {
	board, err := NewMissionBoard(boardAddress, client)
	if err != nil {
		return nil, err
	}

	return &boarder{
		client:       client,
		boardAddress: boardAddress,
		board:        board,
	}, nil
}

func MustNew(client clients.Client, boardAddress common.Address) *boarder {
	r, err := New(client, boardAddress)
	if err != nil {
		panic(err)
	}

	return r
}

func (b *boarder) GetDiscoveryReportData(ctx context.Context, reportID *big.Int) (*mission.ReportData, error) {
	report, err := b.board.GetDiscoveryReport(&bind.CallOpts{Context: ctx}, reportID)
	if err != nil {
		return nil, err
	}

	metadata, err := b.getMetadata(ctx, report.ContentURI)
	if err != nil {
		return nil, err
	}

	return &mission.ReportData{
		Title:      report.Title,
		ContentURI: report.ContentURI,
		Metadata:   *metadata,
	}, nil
}

func (b *boarder) getMetadata(ctx context.Context, url string, clients ...*http.Client) (*mission.Metadata, error) {
	client := http.DefaultClient

	if len(clients) > 0 {
		client = clients[0]
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var metadata mission.Metadata

	if err := json.NewDecoder(resp.Body).Decode(&metadata); err != nil {
		return nil, err
	}

	return &metadata, nil
}

func (b *boarder) HasReport(ctx context.Context, account common.Address, reportID *big.Int) (bool, error) {
	return b.board.HasReport(&bind.CallOpts{Context: ctx}, account, reportID)
}
