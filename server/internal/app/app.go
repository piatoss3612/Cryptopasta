package app

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"syscall"
	"time"
)

type App struct {
	*http.Server
}

func New(addr string, handler http.Handler) *App {
	return &App{
		Server: &http.Server{
			Addr:         addr,
			Handler:      handler,
			ReadTimeout:  5 * time.Second,
			WriteTimeout: 10 * time.Second,
		},
	}
}

func (a *App) Run(cleanupFuncs ...func()) error {
	if len(cleanupFuncs) > 0 {
		a.RegisterOnShutdown(cleanupFuncs[0])
	}

	slog.Info("Starting the server...", "addr", a.Addr)

	go func() {
		if err := a.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	<-GracefulShutdown(func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		slog.Info("Shutting down the server...")

		if err := a.Shutdown(ctx); err != nil {
			log.Fatalf("Shutdown(): %v", err)
		}

		slog.Info("Server is down")
	}, syscall.SIGINT, syscall.SIGTERM)

	return nil
}
