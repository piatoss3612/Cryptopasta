package rest

import (
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/rest/websocket"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	chiddleware "github.com/go-chi/chi/v5/middleware"
)

type Route interface {
	Pattern() string
	Handler() http.Handler
}

type Router struct {
	version string
	*chi.Mux
}

func NewRouter(version string, routes ...Route) *Router {
	r := chi.NewRouter()

	// middlewares
	r.Use(chiddleware.RequestID)
	r.Use(chiddleware.RealIP)
	r.Use(chiddleware.Logger)
	r.Use(chiddleware.Recoverer)
	r.Use(middleware.NewCors())
	r.Use(middleware.NewHttpRateLimit())

	r.Route(fmt.Sprintf("/%s", version), func(r chi.Router) {
		for _, route := range routes {
			r.Mount(route.Pattern(), route.Handler())
		}
	})
	r.Handle("/ws", websocket.Serve())

	return &Router{
		version: version,
		Mux:     r,
	}
}
