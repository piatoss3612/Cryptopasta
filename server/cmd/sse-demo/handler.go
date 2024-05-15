package main

import (
	"context"
	"cryptopasta/internal/utils"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/tmc/langchaingo/llms"
)

type CompletionRequest struct {
	Text string `json:"text"`
}

func CompletionHandler(w http.ResponseWriter, r *http.Request) {
	var req CompletionRequest

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		slog.Error("Failed to read request", "error", err)
		utils.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	f, ok := w.(http.Flusher)
	if !ok {
		utils.WriteError(w, http.StatusInternalServerError, "Streaming unsupported")
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(http.StatusOK)

	_, err = llms.GenerateFromSinglePrompt(r.Context(), llm, req.Text, llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
		_, err := w.Write(chunk)
		f.Flush()
		return err
	}))
	if err != nil {
		slog.Error("Failed to generate completion", "error", err)
		return
	}
}

type ChatRequest struct {
	Text string `json:"text"`
}

func ChatHandler(w http.ResponseWriter, r *http.Request) {}

func EventsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// Simulate sending events (you can replace this with real data)
	for i := 0; i < 10; i++ {
		fmt.Fprintf(w, "data: %s\n\n", fmt.Sprintf("Event %d", i))
		w.(http.Flusher).Flush()
	}
}
