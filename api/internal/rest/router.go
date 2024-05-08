package rest

import (
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/rest/websocket"
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

	r.Handle("/ws", websocket.Serve())

	return &Router{
		Mux: r,
	}
}
