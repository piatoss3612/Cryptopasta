package main

import (
	"cryptopasta/internal/app"
	"cryptopasta/internal/app/config"
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

	// load config
	cfg := config.LoadConfig()

	// create services
	// llm := openai.NewClient(cfg.OpenaiApiKey)
	// mongoClient := mongo.MustNewClient(context.Background(), cfg.MongoUri)
	// tx := mongo.NewTx(mongoClient, "cryptopasta")
	// zkClient := zksync.MustNewClient(context.Background())
	// agentRegistry := zksync.MustNewAgentRegistry(cfg.AgentRegistryAddr, zkClient)
	// missionBoard := zksync.MustNewMissionBoard(cfg.MissionBoardAddr, zkClient)

	// a := agent.NewService(zkClient, agentRegistry, tx, cfg.PrivateKey)
	// j := jwt.NewService(cfg.PrivyAppID, cfg.PrivyVerificationKey)
	// m := mission.NewService(llm, missionBoard, tx)
	// p := pinata.NewService(cfg.PinataApiKey, cfg.PinataSecretKey)

	cfg.Clear()

	// create router
	r := app.NewRouter(
	// route.NewPingRoutes(),
	// route.NewAgentRoutes(j, a),
	// route.NewPinataRoutes(j, p),
	// route.NewMissionRoutes(a, j, m),
	)

	// cleanup function on server shutdown
	cleanup := func() {
		// zkClient.Close()
		// mongoClient.Disconnect(context.Background())

		slog.Info("server stopped gracefully")
	}

	// run server
	app.New(":8080", r).Run(cleanup)
}
