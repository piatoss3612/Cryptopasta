package rest

import (
	"cryptopasta/internal/rest/middleware"
	"net/http"

	"github.com/go-chi/chi/v5"
	chiddleware "github.com/go-chi/chi/v5/middleware"
)

type Route interface {
	Pattern() string
	Handler() http.Handler
}

type Router struct {
	*chi.Mux
}

func NewRouter(routes ...Route) *Router {
	r := chi.NewRouter()

	// middlewares
	r.Use(chiddleware.RequestID)
	r.Use(chiddleware.RealIP)
	r.Use(chiddleware.Logger)
	r.Use(chiddleware.Recoverer)
	r.Use(middleware.NewCors())
	r.Use(middleware.NewHttpRateLimit())

	for _, route := range routes {
		r.Mount(route.Pattern(), route.Handler())
	}

	return &Router{
		Mux: r,
	}
}
