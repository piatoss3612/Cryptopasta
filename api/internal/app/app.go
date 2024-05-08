package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type App struct {
	*http.Server
}

func NewApp(addr string, handler http.Handler) *App {
	return &App{
		Server: &http.Server{
			Addr:         addr,
			Handler:      handler,
			ReadTimeout:  5 * time.Second,
			WriteTimeout: 10 * time.Second,
		},
	}
}

func (a *App) Run() error {
	go func() {
		if err := a.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	<-GracefulShutdown(func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		log.Println("Shutting down the server...")

		if err := a.Shutdown(ctx); err != nil {
			log.Fatalf("Shutdown(): %v", err)
		}

		log.Println("Gracefully shutdown the server")
	}, syscall.SIGINT, syscall.SIGTERM)

	return nil
}

func GracefulShutdown(callback func(), sig ...os.Signal) <-chan struct{} {
	stop := make(chan struct{})
	sigChan := make(chan os.Signal, 1)

	sigs := sig
	if len(sigs) == 0 {
		sigs = []os.Signal{os.Interrupt}
	}

	signal.Notify(sigChan, sigs...)

	go func() {
		<-sigChan

		signal.Stop(sigChan)

		callback()

		close(sigChan)
		close(stop)
	}()

	return stop
}
