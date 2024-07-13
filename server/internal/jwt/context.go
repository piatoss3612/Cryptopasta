package jwt

import "context"

// PrivyClaims represents the claims of the JWT token.
type privyClaimsKey struct{}

func NewContext(ctx context.Context, claims *PrivyClaims) context.Context {
	return context.WithValue(ctx, privyClaimsKey{}, claims)
}

func FromContext(ctx context.Context) (*PrivyClaims, bool) {
	claims, ok := ctx.Value(privyClaimsKey{}).(*PrivyClaims)
	return claims, ok
}
