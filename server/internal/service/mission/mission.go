package mission

import (
	"context"
	"cryptopasta/internal/db"
	"cryptopasta/pkg/contracts"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
)

type StreamFunc func(ctx context.Context, chunk []byte) error

type MissionService struct {
	llm   *openai.LLM
	mb    *contracts.MissionBoard
	query *MissionQuery
	store *MissionStore
	tx    *db.MongoTx
}

func NewMissionService(llm *openai.LLM, mb *contracts.MissionBoard, tx *db.MongoTx) *MissionService {
	return &MissionService{
		llm:   llm,
		query: NewMissionQuery(tx.Client, tx.DBName),
		store: NewMissionStore(tx.Client, tx.DBName),
		tx:    tx,
	}
}

func (s *MissionService) GetMission(ctx context.Context, missionID string) (*Mission, error) {
	return s.query.FindMissionByID(ctx, missionID)
}

func (s *MissionService) GetMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error) {
	return s.query.FindMissionsByAgentID(ctx, agentID, lastMissionID, limit)
}

func (s *MissionService) GetEntriesByMissionID(ctx context.Context, missionID string) ([]Entry, error) {
	return s.query.FindEntriesByMissionID(ctx, missionID)
}

func (s *MissionService) CreateMission(ctx context.Context, agentID, reportID string, streamFunc StreamFunc) (*Mission, error) {
	fn := func(ctx context.Context) (interface{}, error) {
		// Get the report
		reportIdBN, ok := big.NewInt(0).SetString(reportID, 10)
		if !ok {
			return nil, errors.New("invalid report ID")
		}

		report, err := s.mb.GetDiscoveryReport(&bind.CallOpts{Context: ctx}, reportIdBN)
		if err != nil {
			return nil, err
		}

		title := report.Title
		uri := report.ContentURI

		// Get the content of the report
		httpResp, err := http.DefaultClient.Get(uri)
		if err != nil {
			return nil, err
		}

		defer httpResp.Body.Close()

		var metadata Metadata

		if err := json.NewDecoder(httpResp.Body).Decode(&metadata); err != nil {
			return nil, err
		}

		// Get the content of the report
		reportContent := metadata.Description

		if reportContent == "" {
			return nil, errors.New("report content is empty")
		}

		// Create the mission
		mission, err := s.store.CreateMission(ctx, title, agentID, reportID)
		if err != nil {
			return nil, err
		}

		// Initialize the mission with a message from the AI
		// TODO: set the content of the message
		content := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeSystem, ""),
			llms.TextParts(llms.ChatMessageTypeHuman, reportContent),
		}

		// Call the LLM
		resp, err := s.llm.GenerateContent(ctx, content, llms.WithMaxTokens(2048), llms.WithStreamingFunc(streamFunc))
		if err != nil {
			return nil, err
		}

		builder := strings.Builder{}

		// format the response
		for _, choice := range resp.Choices {
			builder.WriteString(choice.Content)
		}

		// Save the entry with the AI response
		_, err = s.store.CreateEntry(ctx, mission.ID, []Message{
			{
				Content: builder.String(),
				IsUser:  false,
			}},
		)
		return mission, err
	}

	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return nil, err
	}

	mission, ok := result.(*Mission)
	if !ok {
		return nil, errors.New("invalid mission type")
	}

	return mission, nil
}

func (s *MissionService) ActOnMission(ctx context.Context, missionID, input string, streamFunc StreamFunc) error {
	fn := func(ctx context.Context) (interface{}, error) {
		// Get the mission
		mission, err := s.query.FindMissionByID(ctx, missionID)
		if err != nil {
			return nil, err
		}

		if mission == nil {
			return nil, errors.New("mission not found")
		}

		// Get the last entry
		entries, err := s.query.FindEntriesByMissionID(ctx, missionID, true)
		if err != nil {
			return nil, err
		}

		if len(entries) == 0 {
			return nil, errors.New("no entries found")
		}

		// Generate the request content with the previous messages
		builder := strings.Builder{}

		builder.WriteString("Previous game play context:\n")

		for _, entry := range entries {
			for _, message := range entry.Messages {
				if message.IsUser {
					builder.WriteString(fmt.Sprintf("User: %s\n", message.Content))
				} else {
					builder.WriteString(fmt.Sprintf("System: %s\n", message.Content))
				}
			}
		}

		content := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeSystem, builder.String()),
			llms.TextParts(llms.ChatMessageTypeHuman, input),
		}

		// Call the LLM
		resp, err := s.llm.GenerateContent(ctx, content, llms.WithMaxTokens(2048), llms.WithStreamingFunc(streamFunc))
		if err != nil {
			return nil, err
		}

		builder.Reset()

		// format the response
		for _, choice := range resp.Choices {
			builder.WriteString(choice.Content)
		}

		// Save the entry with the user input and the AI response
		_, err = s.store.CreateEntry(ctx, missionID, []Message{
			{
				Content: input,
				IsUser:  true,
			},
			{
				Content: builder.String(),
				IsUser:  false,
			}},
		)

		return nil, err
	}

	_, err := s.tx.Execute(ctx, fn)
	return err
}
