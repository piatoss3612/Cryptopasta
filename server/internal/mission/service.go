package mission

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/common"

	openai "github.com/sashabaranov/go-openai"
)

type ChatMessageFunc func(message string) error

type service struct {
	llm     *openai.Client
	boarder Boarder
	repo    Repository
}

func NewService(llm *openai.Client, boarder Boarder, repo Repository) *service {
	return &service{
		llm:     llm,
		boarder: boarder,
		repo:    repo,
	}
}

func (s *service) GetMission(ctx context.Context, missionID string) (*Mission, error) {
	return s.repo.FindMissionByID(ctx, missionID)
}

func (s *service) GetMissionsByAgentID(ctx context.Context, agentID, lastMissionID string, limit int) ([]Mission, error) {
	return s.repo.FindMissionsByAgentID(ctx, agentID, lastMissionID, limit)
}

func (s *service) GetEntriesByMissionID(ctx context.Context, missionID string) ([]Entry, error) {
	return s.repo.FindEntriesByMissionID(ctx, missionID)
}

func (s *service) GetEntryByID(ctx context.Context, entryID string) (*Entry, error) {
	return s.repo.FindEntryByID(ctx, entryID)
}

func (s *service) CreateMission(ctx context.Context, agentID string, agentAccountAddress common.Address, reportID *big.Int, chatFn ChatMessageFunc) (*Mission, error) {
	// 1. check if the agent has report tokens
	hasReport, err := s.boarder.HasReport(ctx, agentAccountAddress, reportID)
	if err != nil {
		return nil, err
	}

	if !hasReport {
		return nil, errors.New("agent does not have required report tokens")
	}

	// 2. Get the report
	report, err := s.boarder.GetDiscoveryReportData(ctx, reportID)
	if err != nil {
		return nil, err
	}

	title := report.Title
	metadata := report.Metadata

	// 3. Get the content of the report
	reportContent := metadata.Description

	// 4. Create the mission
	mission, err := s.repo.CreateMission(ctx, title, agentID, reportID.String())
	if err != nil {
		return nil, err
	}

	// 5. Initialize the mission(game) with a message from the AI
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

	// 6. Save the entry with the AI response
	_, err = s.repo.CreateEntry(ctx, mission.ID, []Message{
		{
			Content:  reportContent,
			IsReport: true,
		},
		{
			Content: respContent,
			IsUser:  false,
		}},
	)

	// 7.Return the mission
	return mission, err
}

func (s *service) ActOnMission(ctx context.Context, missionID, input string, chatFn ChatMessageFunc) (string, error) {
	// 1. Get the mission
	mission, err := s.repo.FindMissionByID(ctx, missionID)
	if err != nil {
		return "", err
	}

	if mission == nil {
		return "", errors.New("mission not found")
	}

	// Get the latest entries
	entries, err := s.repo.FindEntriesByMissionID(ctx, missionID, true)
	if err != nil {
		return "", err
	}

	if len(entries) == 0 {
		return "", errors.New("no entries found")
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
		return "", err
	}

	builder.Reset()
	defer builder.Reset()

	for _, choice := range chatResp.Choices {
		_, _ = builder.WriteString(choice.Message.Content)
	}

	respContent := builder.String()

	if err := chatFn(respContent); err != nil {
		return "", err
	}

	// Save the entry with the user input and the AI response
	return s.repo.CreateEntry(ctx, missionID, []Message{
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

func (s *service) VisualizeLatestMissionState(ctx context.Context, missionID, entryID string) (*Message, error) {
	// Check if the mission and entry exist
	exists, err := s.repo.MissionExists(ctx, missionID)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, errors.New("mission not found")
	}

	// Check if the entry exists
	entry, err := s.repo.FindEntryByID(ctx, entryID)
	if err != nil {
		return nil, err
	}

	if entry == nil {
		return nil, errors.New("entry not found")
	}

	// Get the latest entries
	entries, err := s.repo.FindEntriesByMissionID(ctx, missionID, true)
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

	err = s.repo.UpdateEntry(ctx, entryID, messages)
	if err != nil {
		return nil, err
	}

	return &message, nil
}
