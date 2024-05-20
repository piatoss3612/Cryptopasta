package main

import (
	"context"
	"cryptopasta/internal/app"
	"cryptopasta/internal/config"
	"cryptopasta/internal/db"
	"cryptopasta/internal/rest"
	"cryptopasta/internal/rest/route"
	"cryptopasta/internal/service/agent"
	"cryptopasta/internal/service/jwt"
	"cryptopasta/internal/service/mission"
	"cryptopasta/internal/service/pinata"
	"cryptopasta/internal/zksync"
	"log"
	"log/slog"

	openai "github.com/sashabaranov/go-openai"
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

	llm := openai.NewClient(cfg.OpenaiApiKey)

	mongoClient, err := db.NewMongoClient(context.Background(), cfg.MongoUri)
	if err != nil {
		log.Fatal("failed to create mongo client", "err", err)
	}

	tx := db.NewMongoTx(mongoClient, "cryptopasta")

	zkClient, err := zksync.NewClient(context.Background())
	if err != nil {
		log.Fatal("failed to create zksync client", "err", err)
	}

	agentRegistry, err := zksync.NewAgentRegistry(cfg.AgentRegistryAddr, zkClient)
	if err != nil {
		log.Fatal("failed to create agent registry", "err", err)
	}

	missionBoard, err := zksync.NewMissionBoard(cfg.MissionBoardAddr, zkClient)
	if err != nil {
		log.Fatal("failed to create mission board", "err", err)
	}

	jwtSvc := jwt.NewJwtService(cfg.PrivyAppID, cfg.PrivyVerificationKey)
	agentSvc := agent.NewAgentService(zkClient, agentRegistry, cfg.PrivateKey)
	pinataSvc := pinata.NewPinataService(cfg.PinataApiKey, cfg.PinataSecretKey)
	missionSvc := mission.NewMissionService(llm, missionBoard, tx)

	cfg = nil

	pingRoute := route.NewPingRoutes()
	agentRoute := route.NewAgentRoutes(jwtSvc, agentSvc)
	pinataRoute := route.NewPinataRoutes(jwtSvc, pinataSvc)
	missionRoutes := route.NewMissionRoutes(jwtSvc, missionSvc)

	r := rest.NewRouter(pingRoute, agentRoute, pinataRoute, missionRoutes)

	app.NewApp(":8080", r).Run(func() {
		// cleanup
		zkClient.Close()
		mongoClient.Disconnect(context.Background())

		slog.Info("server stopped gracefully")
	})
}
