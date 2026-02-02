package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Equifax  EquifaxConfig
	JWT      JWTConfig
	Logging  LoggingConfig
	CORS     CORSConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	Port string
	Host string
}

// DatabaseConfig holds database connection configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	Name     string
	User     string
	Password string
	SSLMode  string
}

// EquifaxConfig holds Equifax API configuration
type EquifaxConfig struct {
	APIURL       string
	APIKey       string
	ClientID     string
	ClientSecret string
	Environment  string // sandbox or production
	Timeout      time.Duration
}

// JWTConfig holds JWT authentication configuration
type JWTConfig struct {
	Secret     string
	Expiration time.Duration
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level  string
	Format string // json or text
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Try to load .env file, but don't fail if it doesn't exist
	_ = godotenv.Load()

	cfg := &Config{
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
			Host: getEnv("SERVER_HOST", "localhost"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			Name:     getEnv("DB_NAME", "swiftverify"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		Equifax: EquifaxConfig{
			APIURL:       getEnv("EQUIFAX_API_URL", ""),
			APIKey:       getEnv("EQUIFAX_API_KEY", ""),
			ClientID:     getEnv("EQUIFAX_CLIENT_ID", ""),
			ClientSecret: getEnv("EQUIFAX_CLIENT_SECRET", ""),
			Environment:  getEnv("EQUIFAX_ENVIRONMENT", "sandbox"),
			Timeout:      time.Duration(getEnvAsInt("EQUIFAX_TIMEOUT_SECONDS", 30)) * time.Second,
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", ""),
			Expiration: time.Duration(getEnvAsInt("JWT_EXPIRATION_HOURS", 24)) * time.Hour,
		},
		Logging: LoggingConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "json"),
		},
		CORS: CORSConfig{
			AllowedOrigins: getEnvAsSlice("CORS_ALLOWED_ORIGINS", []string{"http://localhost:5173"}),
			AllowedMethods: getEnvAsSlice("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			AllowedHeaders: getEnvAsSlice("CORS_ALLOWED_HEADERS", []string{"Content-Type", "Authorization"}),
		},
	}

	return cfg, nil
}

// Validate checks if all required configuration is present
func (c *Config) Validate() error {
	// Check required Equifax configuration
	if c.Equifax.APIURL == "" {
		return fmt.Errorf("EQUIFAX_API_URL is required")
	}
	if c.Equifax.APIKey == "" {
		return fmt.Errorf("EQUIFAX_API_KEY is required")
	}
	if c.Equifax.ClientID == "" {
		return fmt.Errorf("EQUIFAX_CLIENT_ID is required")
	}
	if c.Equifax.ClientSecret == "" {
		return fmt.Errorf("EQUIFAX_CLIENT_SECRET is required")
	}

	// Check JWT secret
	if c.JWT.Secret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}

	// Check database configuration
	if c.Database.Password == "" {
		return fmt.Errorf("DB_PASSWORD is required")
	}

	return nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt gets an environment variable as an integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsSlice gets an environment variable as a slice (comma-separated) or returns a default value
func getEnvAsSlice(key string, defaultValue []string) []string {
	valueStr := getEnv(key, "")
	if valueStr == "" {
		return defaultValue
	}

	var result []string
	for _, v := range splitString(valueStr, ',') {
		if trimmed := trimSpace(v); trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

// Helper functions to avoid importing strings package
func splitString(s string, sep rune) []string {
	var result []string
	var current string
	for _, c := range s {
		if c == sep {
			result = append(result, current)
			current = ""
		} else {
			current += string(c)
		}
	}
	result = append(result, current)
	return result
}

func trimSpace(s string) string {
	start := 0
	end := len(s)

	for start < end && (s[start] == ' ' || s[start] == '\t' || s[start] == '\n' || s[start] == '\r') {
		start++
	}

	for end > start && (s[end-1] == ' ' || s[end-1] == '\t' || s[end-1] == '\n' || s[end-1] == '\r') {
		end--
	}

	return s[start:end]
}
