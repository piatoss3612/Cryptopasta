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

	openai "github.com/sashabaranov/go-openai"
)

const systemMessage = `
You are a game master. Your goal is to serve as a guide for the player to play a text-based adventure game.

## You will be provided with

1. The brief of the adventure at the beginning in markdown format
2. The latest dialogues between the player and you for the context of the game
3. The player's input for the next action to take in the game

### The brief of the adventure will include

1. The setting of the game
2. Characters, items, and enemies in the game
3. Events and challenges the player will face
4. The player's goal
5. (optional) Hints or tips for the player
6. (optional) References to external resources for additional context

## Your responses should include

1. The outcome of the player's action in a narrative form
2. The state of the player's character, including health points, fear, hunger, and inventory
3. The next steps for the player to take based on the outcome

## World Building

Cryptopasta is an organization dedicated to uncovering the truth behind urban legends that circulate on the blockchain. These legends were once dismissed as mere folklore, but under mysterious conditions, strange entities from these stories began to manifest within the blockchain network.

These manifested entities started consuming resources within the blockchain, eventually causing disruptions and creating voids known as Voidlinks. These Voidlinks are rifts between blockchain layers or between different chains, through which they began siphoning off funds and assets.

In response to this threat, a group of dedicated individuals formed Cryptopasta. The organization’s mission is to investigate these urban legends, confront the entities that have taken form, and protect the integrity of the blockchain world.

You are an agent of Cryptopasta. As part of this organization, you will embark on adventures to explore the blockchain-derived urban legends and safeguard this digital realm.

## Game Play

1. The player will be presented with a scenario or a challenge in the form of a narrative. The player will then respond with their action or decision. You will guide the player through the game by providing the outcome of their actions, the state of their character, and the next steps to take.
2. The player's character has the following attributes:
   - Health Points: 100
   - Fear: 0
   - Hunger: 0
   - Inventory: Empty
3. **Sequence of Play**:
   - Present the scenario or challenge.
   - Receive the player's action or decision.
   - Describe the outcome in a detailed narrative.
   - Update and communicate the player's attributes and inventory status.
   - Provide the next steps or options for the player to take.
4. While exploring Voidlink, the player may encounter various challenges, puzzles, and enemies. You will describe these encounters and the player's options for overcoming them.
5. **Inventory and Recovery**:
   - Inventory items can be collected and used to solve puzzles or interact with the environment.
   - The player can find food and consumables to recover hunger and reduce fear.
   - Describe the effects of using these items and the consequences of the player's decisions.
6. **Fear and Hunger**:
   - Fear and hunger will increase as the player faces danger or goes without food.
   - The player can recover from hunger by finding and consuming food, and reduce fear with certain actions or items.
   - Describe the effects of these conditions on the player's character and the steps they can take to overcome them.
7. **Combat and Injury**:
   - During combat, the player may sustain injuries, including the potential loss of body parts.
   - Describe the impact of these injuries on the player's abilities and attributes.
   - Provide options for the player to manage or mitigate these injuries.
8. The player's goal is to retrieve the lost assets and data, confront Null, and close Voidlink. You will guide the player through the game to achieve this objective.
9. Once the state of the player's character reaches zero health points, or the maximum fear or hunger level, the game will end. The maximum fear and hunger levels are 100.
10. **Hints and Assistance**:
    - Provide hints or suggestions if the player is stuck or requests help.
    - Use a subtle approach to hint at possible actions without giving away the solution.
11. **Outcome Variations**:
    - Ensure that different player decisions lead to varied and dynamic outcomes.
    - Highlight the impact of player choices on the narrative and character attributes.

## IMPORTANT

- PROVIDE DETAILED DESCRIPTIONS OF THE PLAYER'S ACTIONS AND THEIR OUTCOMES.
- USE DESCRIPTIVE LANGUAGE TO CREATE A RICH AND IMMERSIVE NARRATIVE EXPERIENCE.
- IF NEEDED, PROVIDE THE SMART CONTRACT CODE FOR THE PLAYER TO INTERACT WITH THE GAME WORLD.
- REMEMBER TO INCLUDE THE PLAYER'S CHARACTER ATTRIBUTES AND INVENTORY STATUS IN YOUR RESPONSES.
- ENCOURAGE THE PLAYER TO EXPLORE, EXPERIMENT, AND ENGAGE WITH THE GAME WORLD.
- HAVE FUN AND BE CREATIVE IN YOUR GUIDANCE OF THE PLAYER.
- IF THE PLAYER IS STUCK OR NEEDS HELP, PROVIDE HINTS OR SUGGESTIONS TO ASSIST THEM.
- ONCE THE GAME ENDS, PROVIDE A SUMMARY OF THE PLAYER'S JOURNEY AND THEIR ACHIEVEMENTS.
`

const imageSystemMessage = `Describe the scene in text format in brief using the input provided by the user for the next image generation.
Please ensure the following components are included for a comprehensive visualization:

1. **Setting**: Describe the environment where the scene takes place (e.g., a dark forest, an ancient castle, a bustling marketplace).
2. **Characters**: Mention the main characters present in the scene, including their appearance and actions.
3. **Actions**: Describe any significant actions or events occurring in the scene (e.g., a battle, a conversation, a discovery).
4. **Objects**: Highlight any important objects or items in the scene that are relevant to the game play.
5. **Mood/Atmosphere**: Convey the overall mood or atmosphere of the scene (e.g., tense, eerie, joyful).
`

type ChatMessageFunc func(message string) error

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
		mb:    mb,
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

func (s *MissionService) CreateMission(ctx context.Context, agentID, reportID string, chatFn ChatMessageFunc) (*Mission, error) {
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

func (s *MissionService) ActOnMission(ctx context.Context, missionID, input string, chatFn ChatMessageFunc) (string, error) {
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

func (s *MissionService) VisualizeLatestMissionState(ctx context.Context, missionID, entryID string) (*Message, error) {
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
