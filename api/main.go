package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

var cfg *Config

//	@title			Cryptopasta API
//	@version		1.0
//	@description	API for Cryptopasta DApp
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	piatoss
//	@contact.url	https://piatoss.xyz
//	@contact.email	piatoss3612@gmail.com

//	@license.name	MIT
//	@license.url	http://opensource.org/licenses/MIT

//	@host	localhost:8080

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
func main() {
	cfg = LoadConfig()

	fmt.Println(cfg.PrivyAppID)
	fmt.Println(cfg.PrivyVerificationKey)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://*", "https://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	r.Use(JwtTokenRequired)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Authenticated with JWT!"))
	})

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("Server is running on %s", srv.Addr)

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	<-GracefulShutdown(func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		log.Println("Shutting down the server...")

		if err := srv.Shutdown(ctx); err != nil {
			log.Fatalf("Shutdown(): %v", err)
		}

		log.Println("Gracefully shutdown the server")
	}, syscall.SIGINT, syscall.SIGTERM)
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
