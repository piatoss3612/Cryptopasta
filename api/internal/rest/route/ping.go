package route

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
	return http.HandlerFunc(p.ping)
}

// Ping godoc
//
//	@Summary		Ping
//	@Description	Ping
//	@Tags			common
//	@Accept			plain
//	@Produce		plain
//	@Success		200	{string}	string	"OK"
//	@Router			/ping [get]
func (p *PingRoute) ping(w http.ResponseWriter, _ *http.Request) {
	_, _ = w.Write([]byte("pong"))
}
