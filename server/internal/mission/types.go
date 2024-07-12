package mission

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	GetMission(ctx context.Context, missionID string) (*Mission, error)
	GetMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error)
	GetEntriesByMissionID(ctx context.Context, missionID string) ([]Entry, error)
	GetEntryByID(ctx context.Context, entryID string) (*Entry, error)
	CreateMission(ctx context.Context, agentID string, agentAccountAddress common.Address, reportID *big.Int, chatFn ChatMessageFunc) (*Mission, error)
	ActOnMission(ctx context.Context, missionID, input string, chatFn ChatMessageFunc) (string, error)
	VisualizeLatestMissionState(ctx context.Context, missionID, entryID string) (*Message, error)
}

type Boarder interface {
	GetDiscoveryReportData(ctx context.Context, reportID *big.Int) (*ReportData, error)
	HasReport(ctx context.Context, user common.Address, reportID *big.Int) (bool, error)
}

type Repository interface {
	Querier
	Commander
}

type Querier interface {
	FindMissionByID(ctx context.Context, id string) (*Mission, error)
	FindMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error)
	MissionExists(ctx context.Context, id string) (bool, error)
	FindEntryByID(ctx context.Context, id string) (*Entry, error)
	FindEntriesByMissionID(ctx context.Context, missionID string, isSummary ...bool) ([]Entry, error)
	EntityExists(ctx context.Context, id string) (bool, error)
}

type Commander interface {
	CreateMission(ctx context.Context, title, agentID, reportID string) (*Mission, error)
	CreateEntry(ctx context.Context, missionID string, messages []Message) (string, error)
	UpdateEntry(ctx context.Context, id string, messages []Message) error
}

type Message struct {
	Content  string `json:"content" bson:"content"`
	B64Image string `json:"b64Image,omitempty" bson:"b64Image,omitempty"`
	IsUser   bool   `json:"isUser" bson:"isUser"`
	IsReport bool   `json:"isReport" bson:"isReport"`
	IsImage  bool   `json:"isImage" bson:"isImage"`
}

type Entry struct {
	ID        string    `json:"id" bson:"_id,omitempty"`
	MissionID string    `json:"missionID" bson:"missionID"`
	Messages  []Message `json:"messages" bson:"messages"`
	CreatedAt int64     `json:"createdAt" bson:"createdAt"`
	UpdateAt  int64     `json:"updateAt" bson:"updateAt"`
}

type Mission struct {
	ID        string `json:"id" bson:"_id,omitempty"`
	Title     string `json:"title" bson:"title"`
	AgentID   string `json:"agentID" bson:"agentID"`
	ReportID  string `json:"reportID" bson:"reportID"`
	CreatedAt int64  `json:"createdAt" bson:"createdAt"`
}

type ReportData struct {
	Title      string `json:"title"`
	ContentURI string `json:"contentURI"`
	Metadata   Metadata
}

type Metadata struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}
