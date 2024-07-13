package chat

import (
	"context"
	"cryptopasta/internal/mission"
	"errors"
	"io"
	"strings"

	"github.com/sashabaranov/go-openai"
)

const openaiChatMaxTokens = 2048
const openaiImagePromptMaxLen = 4000

type openaiChat struct {
	llm *openai.Client
}

func NewOpenAIChat(llm *openai.Client) *openaiChat {
	return &openaiChat{llm: llm}
}

func (c *openaiChat) ChatCompletion(ctx context.Context, userMsgs []string) (string, error) {
	// Create a list of messages to send to the model
	messages := make([]openai.ChatCompletionMessage, 0, len(userMsgs)+1)

	messages = append(messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleSystem,
		Content: mission.ChatSystemMessage,
	})

	for _, msg := range userMsgs {
		messages = append(messages, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleUser,
			Content: msg,
		})
	}

	// Create the chat completion request
	req := openai.ChatCompletionRequest{
		Model:     openai.GPT4o,
		Messages:  messages,
		MaxTokens: openaiChatMaxTokens,
		Stream:    false,
	}

	// Request the chat completion
	resp, err := c.llm.CreateChatCompletion(ctx, req)
	if err != nil {
		return "", err
	}

	// Extract the response content
	builder := strings.Builder{}
	defer builder.Reset()

	for _, choice := range resp.Choices {
		_, err := builder.WriteString(choice.Message.Content)
		if err != nil {
			return "", err
		}
	}

	// Return the response content
	return builder.String(), nil
}

func (c *openaiChat) ChatCompletionStream(ctx context.Context, userMsgs []string, chatFn mission.ChatMessageFunc) error {
	// Create a list of messages to send to the model
	messages := make([]openai.ChatCompletionMessage, 0, len(userMsgs)+1)

	messages = append(messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleSystem,
		Content: mission.ChatSystemMessage,
	})

	for _, msg := range userMsgs {
		messages = append(messages, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleUser,
			Content: msg,
		})
	}

	// Create the chat completion request
	req := openai.ChatCompletionRequest{
		Model:     openai.GPT4o,
		Messages:  messages,
		MaxTokens: openaiChatMaxTokens,
		Stream:    true,
	}

	// Create the chat completion stream
	stream, err := c.llm.CreateChatCompletionStream(ctx, req)
	if err != nil {
		return err
	}
	defer stream.Close()

	// Process the chat completion stream
	for {
		resp, err := stream.Recv()
		if err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return err
		}

		if len(resp.Choices) == 0 {
			return nil
		}

		if err := chatFn(resp.Choices[0].Delta.Content); err != nil {
			return err
		}
	}
}

func (c *openaiChat) Visualize(ctx context.Context, prompt string) (*mission.MissionImage, error) {
	if len(prompt) > openaiImagePromptMaxLen {
		prompt = prompt[:openaiImagePromptMaxLen]
	}

	// Create the image request
	req := openai.ImageRequest{
		Model:          openai.CreateImageModelDallE3,
		Size:           openai.CreateImageSize1024x1024,
		ResponseFormat: openai.CreateImageResponseFormatB64JSON,
		Prompt:         prompt,
	}

	// Request the image
	resp, err := c.llm.CreateImage(ctx, req)
	if err != nil {
		return nil, err
	}

	if len(resp.Data) == 0 {
		return nil, errors.New("no images found")
	}

	// Return the image
	return &mission.MissionImage{
		URL:     resp.Data[0].URL,
		B64JSON: resp.Data[0].B64JSON,
	}, nil
}
