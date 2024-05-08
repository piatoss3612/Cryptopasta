package middleware

import (
	"cryptopasta-api/internal/service/jwt"
	"fmt"
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

func JwtTokenRequired(j *jwt.JwtService) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Authorization")

			authHeader := r.Header.Get("Authorization")

			if authHeader == "" {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			// Split the header into two parts
			// The first part is the type of the token
			// The second part is the token itself
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			// Check if the token type is Bearer
			if parts[0] != "Bearer" {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			// Parse the token
			token, err := j.ParseToken(parts[1])
			if err != nil {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			fmt.Println(token.Claims)

			// Check if the token is valid
			claims, err := j.ValidateClaims(token)
			if err != nil {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r.WithContext(j.NewContext(r.Context(), claims)))
		})
	}
}
