package middleware

import (
	"cryptopasta/internal/jwt"
	"cryptopasta/pkg/utils"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"
)

func NewCors() func(next http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://*", "https://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}

func NewHttpRateLimit() func(next http.Handler) http.Handler {
	return httprate.Limit(
		100,           // requests
		1*time.Minute, // per duration
		httprate.WithKeyFuncs(httprate.KeyByIP, httprate.KeyByEndpoint),
	)
}

func JwtTokenRequired(j *jwt.Service) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Authorization")

			authHeader := r.Header.Get("Authorization")

			if authHeader == "" {
				utils.WriteError(w, http.StatusUnauthorized, "authorization header is required")
				return
			}

			// Split the header into two parts
			// The first part is the type of the token
			// The second part is the token itself
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 {
				utils.WriteError(w, http.StatusUnauthorized, "authorization header is formatted incorrectly")
				return
			}

			// Check if the token type is Bearer
			if parts[0] != "Bearer" {
				utils.WriteError(w, http.StatusUnauthorized, "authorization header must be a Bearer token")
				return
			}

			// Parse the token
			token, err := j.ParseToken(parts[1])
			if err != nil {
				slog.Error("error while parsing token", "error", err)
				utils.WriteError(w, http.StatusUnauthorized, "invalid token")
				return
			}

			// Check if the token is valid
			claims, err := j.ValidateClaims(token)
			if err != nil {
				slog.Error("error while validating token", "error", err)
				utils.WriteError(w, http.StatusUnauthorized, "invalid token")
				return
			}

			next.ServeHTTP(w, r.WithContext(jwt.NewContext(r.Context(), claims)))
		})
	}
}
