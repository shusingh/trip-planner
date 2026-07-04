package config

import (
	"fmt"
	"os"
)

// Config holds application configuration loaded from environment variables.
type Config struct {
	Port        string // Port on which the server listens (default "8080")
	GroqAPIKey string // Groq API token (required)
}

// LoadConfig reads configuration from environment variables and applies defaults.
func LoadConfig() (*Config, error) {
	token := os.Getenv("GROQ_API_KEY")
	if token == "" {
		return nil, fmt.Errorf("environment variable GROQ_API_KEY is required")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Port:        port,
		GroqAPIKey: token,
	}, nil
}
