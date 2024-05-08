package temp

import (
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/service/jwt"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type TempRoute struct {
	j *jwt.JwtService
}

func NewTempRoute(j *jwt.JwtService) *TempRoute {
	return &TempRoute{j: j}
}

func (t *TempRoute) Pattern() string {
	return "/temp"
}

func (t *TempRoute) Handler() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.JwtTokenRequired(t.j))
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		claims, ok := t.j.FromContext(r.Context())
		if !ok {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		_, _ = w.Write([]byte(fmt.Sprintf("Hello, %s!", claims.UserId)))
	})

	return r
}
