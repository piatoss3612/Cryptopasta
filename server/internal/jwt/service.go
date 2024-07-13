package jwt

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	PrivyIssuer = "privy.io"
	JwtSignAlg  = "ES256"
)

var (
	ErrMissingClaims = errors.New("jwt does not have all the necessary claims")
	ErrInvalidAud    = errors.New("aud claim must be your Privy App ID")
	ErrInvalidIss    = errors.New("iss claim must be 'privy.io'")
	ErrTokenExpired  = errors.New("token is expired")
)

// Service is the interface that provides methods for parsing and validating JWT tokens.
// Generating a JWT token is handled by the Privy. The service only needs to parse and validate the token.
type Service interface {
	ParseToken(tokenStr string) (*jwt.Token, error)        // ParseToken parses the JWT token string.
	ValidateClaims(token *jwt.Token) (*PrivyClaims, error) // ValidateClaims validates the claims of the JWT token.
}

type service struct {
	PrivyAppID           string
	PrivyVerificationKey string
}

// NewService creates a new JWT service.
// privyAppID is the App ID of your Privy application.
// privyVerificationKey is the secret key used to verify the JWT token.
func NewService(privyAppID, privyVerificationKey string) *service {
	return &service{
		PrivyAppID:           privyAppID,
		PrivyVerificationKey: privyVerificationKey,
	}
}

// ParseToken parses the JWT token string.
// tokenStr is the JWT token string.
func (s *service) ParseToken(tokenStr string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenStr, &PrivyClaims{}, s.keyFunc)
}

// ValidateClaims validates the claims of the JWT token.
// token is the JWT token to validate.
func (s *service) ValidateClaims(token *jwt.Token) (*PrivyClaims, error) {
	// Cast the token claims to PrivyClaims.
	privyClaim, ok := token.Claims.(*PrivyClaims)
	if !ok {
		return nil, ErrMissingClaims
	}

	// aud claim must be your Privy App ID.
	if privyClaim.AppId != s.PrivyAppID {
		return nil, ErrInvalidAud
	}

	// iss claim must be 'privy.io'.
	if privyClaim.Issuer != PrivyIssuer {
		return nil, ErrInvalidIss
	}

	// Check if the token is expired.
	if privyClaim.Expiration < time.Now().Unix() {
		return nil, ErrTokenExpired
	}

	return privyClaim, nil
}

func (s *service) keyFunc(token *jwt.Token) (interface{}, error) {
	if token.Method.Alg() != JwtSignAlg {
		return nil, fmt.Errorf("unexpected JWT signing method=%v", token.Header["alg"])
	}
	// https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
	return jwt.ParseECPublicKeyFromPEM([]byte(s.PrivyVerificationKey))
}

var _ Service = (*service)(nil) // Ensure service implements the Service interface.
