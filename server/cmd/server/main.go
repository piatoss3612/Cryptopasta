package main

import (
	"context"
	"cryptopasta/internal/agent"
	"cryptopasta/internal/agent/registry"
	agentRepo "cryptopasta/internal/agent/repository"
	"cryptopasta/internal/app"
	"cryptopasta/internal/app/config"
	"cryptopasta/internal/app/route"
	"cryptopasta/internal/jwt"
	"cryptopasta/internal/mission"
	"cryptopasta/internal/mission/board"
	"cryptopasta/internal/mission/llm"
	missionRepo "cryptopasta/internal/mission/repository"
	"cryptopasta/internal/pinata"
	"cryptopasta/pkg/db/mongo"
	"cryptopasta/pkg/zksync"
	"log"
	"log/slog"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/sashabaranov/go-openai"
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

	// 1. Load config
	cfg := config.LoadConfig()
	dbname := "cryptopasta"
	port := ":8080"

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	// 2. Parse private key and addresses
	privKey, err := crypto.HexToECDSA(cfg.PrivateKey)
	if err != nil {
		log.Fatal(err)
	}

	agentRegistryAddress := common.HexToAddress(cfg.AgentRegistryAddr)
	missionBoardAddress := common.HexToAddress(cfg.MissionBoardAddr)

	// 3. Create instances for services
	mongoClient := mongo.MustNewClient(ctx, cfg.MongoUri)
	zkClient := zksync.MustNewClient(ctx)

	register := registry.MustNew(zkClient, agentRegistryAddress, privKey)
	agentRepo := agentRepo.NewMongoRepository(mongoClient, dbname)

	boarder := board.MustNew(zkClient, missionBoardAddress)
	llmAdapter := llm.NewOpenAIAdapter(openai.NewClient(cfg.OpenaiApiKey))
	missionRepo := missionRepo.NewMongoRepository(mongoClient, dbname)

	tx := mongo.NewTx(mongoClient, dbname)

	// 4. Create services
	a := agent.NewService(register, agentRepo)
	j := jwt.NewService(cfg.PrivyAppID, cfg.PrivyVerificationKey)
	m := mission.NewService(boarder, llmAdapter, missionRepo)
	p := pinata.NewService(cfg.PinataApiKey, cfg.PinataSecretKey)

	cfg.Clear()

	// 5. Create router
	r := app.NewRouter(
		route.NewPingRoutes(),
		route.NewAgentRoutes(j, a, tx),
		route.NewPinataRoutes(j, p),
		route.NewMissionRoutes(a, j, m, tx),
	)

	// 6. Setup cleanup function for graceful shutdown
	cleanup := func() {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
		defer cancel()

		zkClient.Close()
		mongoClient.Disconnect(ctx)

		slog.Info("server stopped gracefully")
	}

	// 7. Run server
	app.New(port, r).Run(cleanup)
}
