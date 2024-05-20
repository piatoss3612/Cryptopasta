package mission

import (
	"context"
	"cryptopasta/internal/db"
	"cryptopasta/pkg/contracts"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"

	openai "github.com/sashabaranov/go-openai"
)

type StreamFunc func(chunk []byte) error

type MissionService struct {
	llm   *openai.Client
	mb    *contracts.MissionBoard
	query *MissionQuery
	store *MissionStore
	tx    *db.MongoTx
}

func NewMissionService(llm *openai.Client, mb *contracts.MissionBoard, tx *db.MongoTx) *MissionService {
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

func (s *MissionService) GetEntryByID(ctx context.Context, entryID string) (*Entry, error) {
	return s.query.FindEntryByID(ctx, entryID)
}

func (s *MissionService) UpdateEntry(ctx context.Context, entryID string, messages []Message) error {
	return s.store.UpdateEntry(ctx, entryID, messages)
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
		req := openai.ChatCompletionRequest{}

		stream, err := s.llm.CreateChatCompletionStream(ctx, req)
		if err != nil {
			return nil, err
		}
		defer stream.Close()

		builder := strings.Builder{}

	Stream:
		for {
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			default:
				streamResp, err := stream.Recv()
				if err != nil {
					if errors.Is(err, io.EOF) {
						break Stream
					}

					return nil, err
				}

				for _, choice := range streamResp.Choices {
					content := choice.Delta.Content

					err = streamFunc([]byte(content))
					if err != nil {
						return nil, err
					}

					_, _ = builder.WriteString(content)
				}
			}
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

func (s *MissionService) ActOnMission(ctx context.Context, missionID, input string, streamFunc StreamFunc) (string, error) {
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

		_, _ = builder.WriteString("Previous game play context:\n")

		for _, entry := range entries {
			for _, message := range entry.Messages {
				if message.IsUser {
					_, _ = builder.WriteString(fmt.Sprintf("User: %s\n", message.Content))
				} else {
					_, _ = builder.WriteString(fmt.Sprintf("System: %s\n", message.Content))
				}
			}
		}

		req := openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: builder.String(),
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: input,
				},
			},
			Stream: true,
		}

		stream, err := s.llm.CreateChatCompletionStream(ctx, req)
		if err != nil {
			return nil, err
		}
		defer stream.Close()

		builder.Reset()

	Stream:
		for {
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			default:
				streamResp, err := stream.Recv()
				if err != nil {
					if errors.Is(err, io.EOF) {
						break Stream
					}

					return nil, err
				}

				for _, choice := range streamResp.Choices {
					content := choice.Delta.Content

					err = streamFunc([]byte(content))
					if err != nil {
						return nil, err
					}

					_, _ = builder.WriteString(content)
				}
			}

		}

		// Save the entry with the user input and the AI response
		return s.store.CreateEntry(ctx, missionID, []Message{
			{
				Content: input,
				IsUser:  true,
			},
			{
				Content: builder.String(),
				IsUser:  false,
			}},
		)
	}

	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return "", err
	}

	entryID, ok := result.(string)
	if !ok {
		return "", errors.New("invalid entry ID type")
	}

	return entryID, nil
}

func (s *MissionService) VisualizeLatestMissionState(ctx context.Context, missionID, entryID string) (string, error) {
	fn := func(ctx context.Context) (interface{}, error) {
		entries, err := s.query.FindEntriesByMissionID(ctx, missionID, true)
		if err != nil {
			return "", err
		}

		if len(entries) == 0 {
			return "", errors.New("no entries found")
		}

		builder := strings.Builder{}

		for _, entry := range entries {
			for _, message := range entry.Messages {
				if message.IsUser {
					_, _ = builder.WriteString(fmt.Sprintf("User: %s\n", message.Content))
				} else {
					_, _ = builder.WriteString(fmt.Sprintf("System: %s\n", message.Content))
				}
			}
		}

		req := openai.ChatCompletionRequest{}

		resp, err := s.llm.CreateChatCompletion(ctx, req)
		if err != nil {
			return "", err
		}

		builder.Reset()

		for _, choice := range resp.Choices {
			builder.WriteString(choice.Message.Content)
		}

		summarizedContent := builder.String()

		imageReq := openai.ImageRequest{
			Model:          openai.CreateImageModelDallE3,
			Size:           openai.CreateImageSize1024x1024,
			ResponseFormat: openai.CreateImageResponseFormatB64JSON,
			Prompt:         summarizedContent,
		}

		imageResp, err := s.llm.CreateImage(ctx, imageReq)
		if err != nil {
			return "", err
		}

		if len(imageResp.Data) == 0 {
			return "", errors.New("no images found")
		}

		imageB64JSON := imageResp.Data[0].B64JSON

		for _, entry := range entries {
			if entry.ID == entryID {
				for _, message := range entry.Messages {
					if !message.IsUser {
						message.Image = imageB64JSON
					}
				}

				err = s.store.UpdateEntry(ctx, entryID, entry.Messages)
				if err != nil {
					return "", err
				}

				break
			}
		}

		return imageB64JSON, nil
	}

	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return "", err
	}

	imageB64JSON, ok := result.(string)
	if !ok {
		return "", errors.New("invalid image type")
	}

	return imageB64JSON, nil
}
