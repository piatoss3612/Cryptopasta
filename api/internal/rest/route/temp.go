package route

import (
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/service/jwt"
	"cryptopasta-api/internal/utils"
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
	r.Get("/", t.temp)

	return r
}

// Temp godoc
//
//	@Summary		Temp
//	@Description	Temporary route for testing JWT middleware
//	@Tags			common
//	@Accept			plain
//	@Produce		plain
//	@Success		200	{string}	string	"OK"
//	@Failure		401	{string}	string	"Unauthorized"
//	@Router			/temp [get]
//	@Security		BearerAuth
func (t *TempRoute) temp(w http.ResponseWriter, r *http.Request) {
	claims, ok := t.j.FromContext(r.Context())
	if !ok {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	_, _ = w.Write([]byte(fmt.Sprintf("Hello, %s!", claims.UserId)))
}
