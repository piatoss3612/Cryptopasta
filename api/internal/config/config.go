package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	PrivateKey           string `json:"privateKey"`
	AgentRegistryAddr    string `json:"agentRegistryAddr"`
	PrivyAppID           string `json:"privyAppId"`
	PrivyVerificationKey string `json:"privyVerificationKey"`
	PinataApiKey         string `json:"pinataApiKey"`
	PinataSecretKey      string `json:"pinataSecretKey"`
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
