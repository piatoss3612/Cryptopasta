package ping

import "net/http"

type PingRoute struct {
}

func NewPingRoute() *PingRoute {
	return &PingRoute{}
}

func (p *PingRoute) Pattern() string {
	return "/ping"
}

func (p *PingRoute) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("pong"))
	})
}
