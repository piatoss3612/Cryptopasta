package mission

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/common"
)

type ChatMessageFunc func(message string) error

type service struct {
	boarder Boarder
	llm     LLMAdapter
	repo    Repository
}

func NewService(boarder Boarder, llm LLMAdapter, repo Repository) *service {
	return &service{
		boarder: boarder,
		llm:     llm,
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

func (s *service) HasReport(ctx context.Context, user common.Address, reportID *big.Int) (bool, error) {
	return s.boarder.HasReport(ctx, user, reportID)
}

func (s *service) CreateMission(ctx context.Context, agentID string, agentAccountAddress common.Address, reportID *big.Int, chatFn ChatMessageFunc) (*Mission, error) {
	// 1. Get the report
	report, err := s.boarder.GetDiscoveryReportData(ctx, reportID)
	if err != nil {
		return nil, err
	}

	title := report.Title
	metadata := report.Metadata

	// 2. Get the content of the report
	reportContent := metadata.Description

	// 3. Create the mission
	mission, err := s.repo.CreateMission(ctx, title, agentID, reportID.String())
	if err != nil {
		return nil, err
	}

	// 4. Initialize the mission(game) with a message from the AI
	respContent, err := s.llm.ChatCompletion(ctx, []string{reportContent})
	if err != nil {
		return nil, err
	}

	// 5. Save the entry with the AI response
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

	// 7. Return the mission
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

	// 2. Get the latest entries
	entries, err := s.repo.FindEntriesByMissionID(ctx, missionID, true)
	if err != nil {
		return "", err
	}

	if len(entries) == 0 {
		return "", errors.New("no entries found")
	}

	// 3. Build the context with the previous messages and add the user input
	userMessage, err := buildContext(entries, input)
	if err != nil {
		return "", err
	}

	// 4. Initialize the chat completion request
	respContent, err := s.llm.ChatCompletion(ctx, []string{userMessage})
	if err != nil {
		return "", err
	}

	// 5. Send the AI response to the chat function
	if err := chatFn(respContent); err != nil {
		return "", err
	}

	// 6. Save the entry with the user input and the AI response
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
	// 1. Check if the mission and entry exist
	exists, err := s.repo.MissionExists(ctx, missionID)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, errors.New("mission not found")
	}

	// 2. Check if the entry exists
	entry, err := s.repo.FindEntryByID(ctx, entryID)
	if err != nil {
		return nil, err
	}

	if entry == nil {
		return nil, errors.New("entry not found")
	}

	// 3. Get the latest entries
	entries, err := s.repo.FindEntriesByMissionID(ctx, missionID, true)
	if err != nil {
		return nil, err
	}

	if len(entries) == 0 {
		return nil, errors.New("no entries found")
	}

	// 4. Build the context with the previous messages
	contextMessage, err := buildContext(entries)
	if err != nil {
		return nil, err
	}

	contextMessage = fmt.Sprintf(`Here is the latest game play context: %s
		Please generate a visual representation of the scene.
		`, contextMessage)

	// 5. Get the AI response
	prompt, err := s.llm.ChatCompletion(ctx, []string{contextMessage})
	if err != nil {
		return nil, err
	}

	// 6. Generate the image with the AI response (prompt)
	image, err := s.llm.Visualize(ctx, prompt)
	if err != nil {
		return nil, err
	}

	imageB64JSON := image.B64JSON

	message := Message{
		Content:  prompt,
		B64Image: imageB64JSON,
		IsUser:   false,
		IsReport: false,
		IsImage:  true,
	}

	messages := entry.Messages
	messages = append(messages, message)

	// 7. Update the entry with the AI response
	err = s.repo.UpdateEntry(ctx, entryID, messages)
	if err != nil {
		return nil, err
	}

	return &message, nil
}

func buildContext(entries []Entry, input ...string) (string, error) {
	builder := strings.Builder{}

	for _, entry := range entries {
		for _, message := range entry.Messages {
			if message.IsImage {
				continue
			}

			var prefix string

			if message.IsUser {
				prefix = "Agent"
			} else {
				prefix = "System"
			}

			_, err := builder.WriteString(fmt.Sprintf("%s: %s\n", prefix, message.Content))
			if err != nil {
				return "", err
			}
		}
	}

	for _, msg := range input {
		_, err := builder.WriteString(fmt.Sprintf("New input from the agent: %s\n", msg))
		if err != nil {
			return "", err
		}
	}

	return builder.String(), nil
}
