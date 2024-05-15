package main

import (
	"context"
	"cryptopasta/internal/app"
	"cryptopasta/internal/config"
	"cryptopasta/internal/rest"
	"cryptopasta/internal/rest/route"
	"cryptopasta/internal/service/agent"
	"cryptopasta/internal/service/jwt"
	"cryptopasta/internal/service/pinata"
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
	pinataSvc := pinata.NewPinataService(cfg.PinataApiKey, cfg.PinataSecretKey)

	cfg = nil

	pingRoute := route.NewPingRoute()
	agentRoute := route.NewAgentRoute(jwtSvc, agentSvc)
	pinataRoute := route.NewPinataRoute(jwtSvc, pinataSvc)

	r := rest.NewRouter(pingRoute, agentRoute, pinataRoute)

	app.NewApp(":8080", r).Run(func() {
		// cleanup
		agentSvc.Close()
	})
}
