package main

import (
	"context"
	"cryptopasta/internal/agent"
	"cryptopasta/internal/app"
	"cryptopasta/internal/app/config"
	"cryptopasta/internal/app/route"
	"cryptopasta/internal/jwt"
	"cryptopasta/internal/mission"
	"cryptopasta/internal/pinata"
	"cryptopasta/pkg/mongo"
	"cryptopasta/pkg/zksync"
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

	mongoClient, err := mongo.NewClient(context.Background(), cfg.MongoUri)
	if err != nil {
		log.Fatal("failed to create mongo client", "err", err)
	}

	tx := mongo.NewTx(mongoClient, "cryptopasta")

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

	a := agent.NewService(zkClient, agentRegistry, cfg.PrivateKey)
	j := jwt.NewService(cfg.PrivyAppID, cfg.PrivyVerificationKey)
	m := mission.NewService(llm, missionBoard, tx)
	p := pinata.NewService(cfg.PinataApiKey, cfg.PinataSecretKey)

	cfg = nil

	pingRoute := route.NewPingRoutes()
	agentRoute := route.NewAgentRoutes(j, a)
	pinataRoute := route.NewPinataRoutes(j, p)
	missionRoutes := route.NewMissionRoutes(j, m)

	r := app.NewRouter(pingRoute, agentRoute, pinataRoute, missionRoutes)

	app.New(":8080", r).Run(func() {
		// cleanup
		zkClient.Close()
		mongoClient.Disconnect(context.Background())

		slog.Info("server stopped gracefully")
	})
}
