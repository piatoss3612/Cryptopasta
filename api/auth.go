package main

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Defining a Go type for Privy JWTs
type PrivyClaims struct {
	AppId      string `json:"aud,omitempty"`
	Expiration uint64 `json:"exp,omitempty"`
	Issuer     string `json:"iss,omitempty"`
	UserId     string `json:"sub,omitempty"`
}

// This method will be used to check the token's claims later
func (c *PrivyClaims) Valid() error {
	if c.AppId != cfg.PrivyAppID {
		return errors.New("aud claim must be your Privy App ID.")
	}
	if c.Issuer != "privy.io" {
		return errors.New("iss claim must be 'privy.io'")
	}
	if c.Expiration < uint64(time.Now().Unix()) {
		return errors.New("Token is expired.")
	}

	return nil
}

func (c *PrivyClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(int64(c.Expiration), 0)), nil
}

func (c *PrivyClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Now()), nil
}

func (c *PrivyClaims) GetNotBefore() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Now()), nil
}

func (c *PrivyClaims) GetIssuer() (string, error) {
	return c.Issuer, nil
}

func (c *PrivyClaims) GetSubject() (string, error) {
	return c.UserId, nil
}

func (c *PrivyClaims) GetAudience() (jwt.ClaimStrings, error) {
	return jwt.ClaimStrings{c.AppId}, nil
}

// This method will be used to load the verification key in the required format later
func keyFunc(token *jwt.Token) (interface{}, error) {
	if token.Method.Alg() != "ES256" {
		return nil, fmt.Errorf("unexpected JWT signing method=%v", token.Header["alg"])
	}
	// https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
	return jwt.ParseECPublicKeyFromPEM([]byte(cfg.PrivyVerificationKey))
}

func JwtTokenRequired(next http.Handler) http.Handler {
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
		token, err := jwt.ParseWithClaims(parts[1], &PrivyClaims{}, keyFunc)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		fmt.Println(token)

		// Check if the token is valid
		privyClaim, ok := token.Claims.(*PrivyClaims)
		if !ok {
			fmt.Println("JWT does not have all the necessary claims.")
		}

		fmt.Println(privyClaim)

		if err := privyClaim.Valid(); err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
