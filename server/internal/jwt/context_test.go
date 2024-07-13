package jwt

import (
	"context"
	"testing"
)

func TestContext(t *testing.T) {
	// Create a new PrivyClaims.
	claims := &PrivyClaims{
		AppId:      "12345678",
		Expiration: 1609459200,
		IssuedAt:   1609455600,
		Issuer:     "privy.io",
		UserId:     "user123",
	}

	// Create a new context.
	ctx := NewContext(context.Background(), claims)

	// Retrieve the PrivyClaims from the context.
	got, ok := FromContext(ctx)
	if !ok {
		t.Error("FromContext(ctx) returned !ok, want ok")
	}

	// Check if the retrieved PrivyClaims is the same as the original.
	if got.AppId != claims.AppId {
		t.Errorf("got.AppId = %s, want %s", got.AppId, claims.AppId)
	}

	if got.Expiration != claims.Expiration {
		t.Errorf("got.Expiration = %d, want %d", got.Expiration, claims.Expiration)
	}

	if got.IssuedAt != claims.IssuedAt {
		t.Errorf("got.IssuedAt = %d, want %d", got.IssuedAt, claims.IssuedAt)
	}

	if got.Issuer != claims.Issuer {
		t.Errorf("got.Issuer = %s, want %s", got.Issuer, claims.Issuer)
	}

	if got.UserId != claims.UserId {
		t.Errorf("got.UserId = %s, want %s", got.UserId, claims.UserId)
	}
}
