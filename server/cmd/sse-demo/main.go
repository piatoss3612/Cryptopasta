package main

import (
	"context"
	"cryptopasta/internal/app"
	"log"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

var llm llms.Model

func main() {
	var err error
	llm, err = ollama.New(ollama.WithModel("llama2"))
	if err != nil {
		log.Fatal(err)
	}

	r := chi.NewRouter()

	r.Get("/", http.FileServer(http.Dir("./cmd/ollama/static/")).ServeHTTP)
	r.Post("/completion", CompletionHandler)
	r.Post("/chat", ChatHandler)
	r.Get("/events", EventsHandler)

	srv := &http.Server{
		Addr:    ":1234",
		Handler: r,
	}

	slog.Info("Starting server", "port", 1234)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Server error", "error", err)
		}
	}()

	<-app.GracefulShutdown(func() {
		if err := srv.Shutdown(context.Background()); err != nil {
			slog.Error("Server shutdown error", "error", err)
		}

		slog.Info("Server stopped")
	})
}
