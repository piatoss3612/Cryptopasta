package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	PrivateKey           string `mapstructure:"privateKey"`
	AgentRegistryAddr    string `mapstructure:"agentRegistryAddr"`
	MissionBoardAddr     string `mapstructure:"missionBoardAddr"`
	PrivyAppID           string `mapstructure:"privyAppId"`
	PrivyVerificationKey string `mapstructure:"privyVerificationKey"`
	PinataApiKey         string `mapstructure:"pinataApiKey"`
	PinataSecretKey      string `mapstructure:"pinataSecretKey"`
	OpenaiApiKey         string `mapstructure:"openaiApiKey"`
	MongoUri             string `mapstructure:"mongoUri"`
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

func LoadConfig(filename string, paths ...string) *Config {
	viper.SetConfigFile(filename)

	if len(paths) > 0 {
		viper.AddConfigPath(paths[0])
	}

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}

	var config Config

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}

	return &config
}
