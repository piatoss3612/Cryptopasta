package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Implicit interface implementation.
var _ jwt.Claims = (*PrivyClaims)(nil)

// Defining a Go type for Privy claims.
type PrivyClaims struct {
	AppId      string `json:"aud,omitempty"`
	Expiration int64  `json:"exp,omitempty"`
	IssuedAt   int64  `json:"iat,omitempty"`
	Issuer     string `json:"iss,omitempty"`
	UserId     string `json:"sub,omitempty"`
}

func (c *PrivyClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(unixToTime(c.Expiration)), nil
}

func (c *PrivyClaims) GetIssuedAt() (*jwt.NumericDate, error) {
	return jwt.NewNumericDate(unixToTime(c.IssuedAt)), nil
}

func (c *PrivyClaims) GetNotBefore() (*jwt.NumericDate, error) {
	// NotBefore is not used in this example.
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

func unixToTime(i int64) time.Time {
	return time.Unix(i, 0)
}
