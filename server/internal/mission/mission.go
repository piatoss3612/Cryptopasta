package mission

import (
	"context"
	"cryptopasta/pkg/contracts"
	"cryptopasta/pkg/mongo"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"

	openai "github.com/sashabaranov/go-openai"
)

type ChatMessageFunc func(message string) error

type Service struct {
	llm   *openai.Client
	mb    *contracts.MissionBoard
	query *Query
	store *Store
	tx    *mongo.Tx
}

func NewService(llm *openai.Client, mb *contracts.MissionBoard, tx *mongo.Tx) *Service {
	return &Service{
		llm:   llm,
		mb:    mb,
		query: NewQuery(tx.Client, tx.DBName),
		store: NewStore(tx.Client, tx.DBName),
		tx:    tx,
	}
}

func (s *Service) GetMission(ctx context.Context, missionID string) (*Mission, error) {
	return s.query.FindMissionByID(ctx, missionID)
}

func (s *Service) GetMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error) {
	return s.query.FindMissionsByAgentID(ctx, agentID, lastMissionID, limit)
}

func (s *Service) GetEntriesByMissionID(ctx context.Context, missionID string) ([]Entry, error) {
	return s.query.FindEntriesByMissionID(ctx, missionID)
}

func (s *Service) GetEntryByID(ctx context.Context, entryID string) (*Entry, error) {
	return s.query.FindEntryByID(ctx, entryID)
}

func (s *Service) CreateMission(ctx context.Context, agentID, reportID string, chatFn ChatMessageFunc) (*Mission, error) {
	fn := func(ctx context.Context) (interface{}, error) {
		// Validate the report ID
		reportIdBN, ok := big.NewInt(0).SetString(reportID, 10)
		if !ok {
			return nil, errors.New("invalid report ID")
		}

		// Get the report
		report, err := s.mb.GetDiscoveryReport(&bind.CallOpts{Context: ctx}, reportIdBN)
		if err != nil {
			return nil, err
		}

		// TODO: check if the agent has report tokens

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
		req := openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemMessage,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: reportContent,
				},
			},
			MaxTokens: 2048,
		}

		chatResp, err := s.llm.CreateChatCompletion(ctx, req)
		if err != nil {
			return nil, err
		}

		builder := strings.Builder{}
		defer builder.Reset()

		for _, choice := range chatResp.Choices {
			_, _ = builder.WriteString(choice.Message.Content)
		}

		respContent := builder.String()

		if err := chatFn(respContent); err != nil {
			return nil, err
		}

		// Save the entry with the AI response
		_, err = s.store.CreateEntry(ctx, mission.ID, []Message{
			{
				Content:  reportContent,
				IsReport: true,
			},
			{
				Content: respContent,
				IsUser:  false,
			}},
		)

		// Return the mission
		return mission, err
	}

	// Execute the transaction
	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return nil, err
	}

	// Type assertion
	mission, ok := result.(*Mission)
	if !ok {
		return nil, errors.New("invalid mission type")
	}

	return mission, nil
}

func (s *Service) ActOnMission(ctx context.Context, missionID, input string, chatFn ChatMessageFunc) (string, error) {
	fn := func(ctx context.Context) (interface{}, error) {
		// Get the mission
		mission, err := s.query.FindMissionByID(ctx, missionID)
		if err != nil {
			return nil, err
		}

		if mission == nil {
			return nil, errors.New("mission not found")
		}

		// Get the latest entries
		entries, err := s.query.FindEntriesByMissionID(ctx, missionID, true)
		if err != nil {
			return nil, err
		}

		if len(entries) == 0 {
			return nil, errors.New("no entries found")
		}

		// Generate the request content with the previous messages
		builder := strings.Builder{}

		_, _ = builder.WriteString("Previous game play context:\n\n")

		for _, entry := range entries {
			for _, message := range entry.Messages {
				if message.IsImage {
					continue
				}

				if message.IsUser {
					_, _ = builder.WriteString(fmt.Sprintf("Agent: %s\n", message.Content))
				} else {
					_, _ = builder.WriteString(fmt.Sprintf("System: %s\n", message.Content))
				}
			}
		}

		_, _ = builder.WriteString(fmt.Sprintf("\nNew input from the agent: %s\n", input))

		// Initialize the chat completion request
		req := openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemMessage,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: builder.String(),
				},
			},
			MaxTokens: 2048,
		}

		chatResp, err := s.llm.CreateChatCompletion(ctx, req)
		if err != nil {
			return nil, err
		}

		builder.Reset()
		defer builder.Reset()

		for _, choice := range chatResp.Choices {
			_, _ = builder.WriteString(choice.Message.Content)
		}

		respContent := builder.String()

		if err := chatFn(respContent); err != nil {
			return nil, err
		}

		// Save the entry with the user input and the AI response
		return s.store.CreateEntry(ctx, missionID, []Message{
			{
				Content: input,
				IsUser:  true,
			},
			{
				Content: respContent,
				IsUser:  false,
			}},
		)
	}

	// Execute the transaction
	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return "", err
	}

	// Type assertion
	entryID, ok := result.(string)
	if !ok {
		return "", errors.New("invalid entry ID type")
	}

	return entryID, nil
}

func (s *Service) VisualizeLatestMissionState(ctx context.Context, missionID, entryID string) (*Message, error) {
	fn := func(ctx context.Context) (interface{}, error) {
		// Check if the mission and entry exist
		exists, err := s.query.MissionExists(ctx, missionID)
		if err != nil {
			return nil, err
		}

		if !exists {
			return nil, errors.New("mission not found")
		}

		// Check if the entry exists
		entry, err := s.query.FindEntryByID(ctx, entryID)
		if err != nil {
			return nil, err
		}

		if entry == nil {
			return nil, errors.New("entry not found")
		}

		// Get the latest entries
		entries, err := s.query.FindEntriesByMissionID(ctx, missionID, true)
		if err != nil {
			return nil, err
		}

		if len(entries) == 0 {
			return nil, errors.New("no entries found")
		}

		// Generate the request content with the previous messages
		builder := strings.Builder{}

		for _, entry := range entries {
			for _, message := range entry.Messages {
				if message.IsImage {
					continue
				}

				if message.IsUser {
					_, _ = builder.WriteString(fmt.Sprintf("Agent: %s\n", message.Content))
				} else {
					_, _ = builder.WriteString(fmt.Sprintf("System: %s\n", message.Content))
				}
			}
		}

		context := builder.String()

		// Initialize the chat completion request
		req := openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: imageSystemMessage,
				},
				{
					Role: openai.ChatMessageRoleUser,
					Content: fmt.Sprintf(`Here is the latest game play context: 
					%s

					Please generate a visual representation of the scene. 
					`, context),
				},
			},
			MaxTokens: 1024,
			Stream:    false,
		}

		// Request the chat completion
		resp, err := s.llm.CreateChatCompletion(ctx, req)
		if err != nil {
			return nil, err
		}

		// Reset the builder to store the AI response
		builder.Reset()
		defer builder.Reset()

		// Write the AI response to the builder
		for _, choice := range resp.Choices {
			builder.WriteString(choice.Message.Content)
		}

		// Get the summarized content
		prompt := builder.String()

		var inputPrompt string

		if len(prompt) > 4000 {
			inputPrompt = prompt[:4000]
		} else {
			inputPrompt = prompt
		}

		imageReq := openai.ImageRequest{
			Model:          openai.CreateImageModelDallE3,
			Size:           openai.CreateImageSize1024x1024,
			ResponseFormat: openai.CreateImageResponseFormatB64JSON,
			Prompt:         inputPrompt,
		}

		imageResp, err := s.llm.CreateImage(ctx, imageReq)
		if err != nil {
			return nil, err
		}

		if len(imageResp.Data) == 0 {
			return nil, errors.New("no images found")
		}

		imageB64JSON := imageResp.Data[0].B64JSON

		message := Message{
			Content:  prompt,
			B64Image: imageB64JSON,
			IsUser:   false,
			IsReport: false,
			IsImage:  true,
		}

		messages := entry.Messages
		messages = append(messages, message)

		err = s.store.UpdateEntry(ctx, entryID, messages)
		if err != nil {
			return nil, err
		}

		return &message, nil
	}

	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return nil, err
	}

	message, ok := result.(*Message)
	if !ok {
		return nil, errors.New("invalid message type")
	}

	return message, nil
}
