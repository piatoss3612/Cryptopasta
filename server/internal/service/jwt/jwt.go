package jwt

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const PrivyIssuer = "privy.io"

type PrivyUserKey struct{}

type JwtService struct {
	PrivyAppID           string
	PrivyVerificationKey string
}

func NewJwtService(privyAppID, privyVerificationKey string) *JwtService {
	return &JwtService{
		PrivyAppID:           privyAppID,
		PrivyVerificationKey: privyVerificationKey,
	}
}

func (j *JwtService) ParseToken(tokenStr string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenStr, &PrivyClaims{}, j.keyFunc)
}

func (j *JwtService) ValidateClaims(token *jwt.Token) (*PrivyClaims, error) {
	privyClaim, ok := token.Claims.(*PrivyClaims)
	if !ok {
		return nil, errors.New("jwt does not have all the necessary claims")
	}

	if privyClaim.AppId != j.PrivyAppID {
		return nil, errors.New("aud claim must be your Privy App ID")
	}

	if privyClaim.Issuer != PrivyIssuer {
		return nil, errors.New("iss claim must be 'privy.io'")
	}

	if privyClaim.Expiration < uint64(time.Now().Unix()) {
		return nil, errors.New("token is expired")
	}

	return privyClaim, nil
}

func (j *JwtService) NewContext(ctx context.Context, claims *PrivyClaims) context.Context {
	return context.WithValue(ctx, PrivyUserKey{}, claims)
}

func (j *JwtService) FromContext(ctx context.Context) (*PrivyClaims, bool) {
	claims, ok := ctx.Value(PrivyUserKey{}).(*PrivyClaims)
	return claims, ok
}

func (j *JwtService) keyFunc(token *jwt.Token) (interface{}, error) {
	if token.Method.Alg() != "ES256" {
		return nil, fmt.Errorf("unexpected JWT signing method=%v", token.Header["alg"])
	}
	// https://pkg.go.dev/github.com/dgrijalva/jwt-go#ParseECPublicKeyFromPEM
	return jwt.ParseECPublicKeyFromPEM([]byte(j.PrivyVerificationKey))
}

// Defining a Go type for Privy JWTs
type PrivyClaims struct {
	AppId      string `json:"aud,omitempty"`
	Expiration uint64 `json:"exp,omitempty"`
	IssuedAt   uint64 `json:"iat,omitempty"`
	Issuer     string `json:"iss,omitempty"`
	UserId     string `json:"sub,omitempty"`
}

func (c *PrivyClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(int64(c.Expiration), 0)), nil
}

func (c *PrivyClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(time.Unix(int64(c.IssuedAt), 0)), nil
}

func (c *PrivyClaims) GetNotBefore() (*jwt.NumericDate, error) {
	return nil, nil
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
