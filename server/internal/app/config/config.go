package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	PrivateKey           string `json:"privateKey"`
	AgentRegistryAddr    string `json:"agentRegistryAddr"`
	MissionBoardAddr     string `json:"missionBoardAddr"`
	PrivyAppID           string `json:"privyAppId"`
	PrivyVerificationKey string `json:"privyVerificationKey"`
	PinataApiKey         string `json:"pinataApiKey"`
	PinataSecretKey      string `json:"pinataSecretKey"`
	OpenaiApiKey         string `json:"openaiApiKey"`
	MongoUri             string `json:"mongoUri"`
}

func (cfg *Config) Clear() {
	cfg.PrivateKey = ""
	cfg.AgentRegistryAddr = ""
	cfg.MissionBoardAddr = ""
	cfg.PrivyAppID = ""
	cfg.PrivyVerificationKey = ""
	cfg.PinataApiKey = ""
	cfg.PinataSecretKey = ""
	cfg.OpenaiApiKey = ""
	cfg.MongoUri = ""
}

func LoadConfig() *Config {
	viper.SetConfigFile("config.json")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}

	var config Config

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}

	return &config
}
