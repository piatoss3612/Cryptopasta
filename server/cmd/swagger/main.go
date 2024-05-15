package main

import (
	"context"
	"log/slog"
	"net/http"
	"syscall"

	_ "cryptopasta/docs"
	"cryptopasta/internal/app"

	"github.com/go-chi/chi/v5"
	httpSwagger "github.com/swaggo/http-swagger/v2"
)

func main() {
	r := chi.NewRouter()

	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:1323/swagger/doc.json"),
	))

	srv := &http.Server{
		Addr:    ":1323",
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()

	slog.Info("Browse to http://localhost:1323/swagger/index.html")

	<-app.GracefulShutdown(func() {
		if err := srv.Shutdown(context.Background()); err != nil {
			slog.Error("Server shutdown failed", "err", err)
		}
	}, syscall.SIGINT, syscall.SIGTERM)
}
