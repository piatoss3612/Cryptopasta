package main

import (
	"context"
	"cryptopasta-api/internal/app"
	"cryptopasta-api/internal/config"
	"cryptopasta-api/internal/rest"
	"cryptopasta-api/internal/rest/route"
	"cryptopasta-api/internal/service/agent"
	"cryptopasta-api/internal/service/jwt"
	"log/slog"
)

//	@title			Cryptopasta API
//	@version		1.0
//	@description	API for Cryptopasta DApp
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	piatoss
//	@contact.url	https://piatoss.xyz
//	@contact.email	piatoss3612@gmail.com

//	@license.name	MIT
//	@license.url	http://opensource.org/licenses/MIT

//	@host	localhost:8080

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
func main() {
	defer func() {
		if r := recover(); r != nil {
			slog.Warn("Recovered from panic", "r", r)
		}
	}()

	cfg := config.LoadConfig()

	jwtSvc := jwt.NewJwtService(cfg.PrivyAppID, cfg.PrivyVerificationKey)
	agentSvc := agent.NewAgentService(context.Background(), cfg.AgentRegistryAddr, cfg.PrivateKey)

	pingRoute := route.NewPingRoute()
	tempRoute := route.NewTempRoute(jwtSvc)
	agentRoute := route.NewAgentRoute(jwtSvc, agentSvc)

	r := rest.NewRouter(pingRoute, tempRoute, agentRoute)

	app.NewApp(":8080", r).Run(func() {
		// cleanup
		agentSvc.Close()
	})
}
