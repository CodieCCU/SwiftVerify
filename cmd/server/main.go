package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/CodieCCU/SwiftVerify/internal/config"
	"github.com/CodieCCU/SwiftVerify/internal/database"
	"github.com/CodieCCU/SwiftVerify/internal/handlers"
	"github.com/CodieCCU/SwiftVerify/internal/logger"
	"github.com/CodieCCU/SwiftVerify/internal/middleware"
	"github.com/CodieCCU/SwiftVerify/internal/services/verification"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	logger.Init(cfg.Logging.Level, cfg.Logging.Format)
	logger.Info("Starting SwiftVerify server...")

	// Validate configuration (commented out for now as credentials may not be set)
	// Uncomment when Equifax integration is ready
	// if err := cfg.Validate(); err != nil {
	// 	logger.Errorf("Configuration validation failed: %v", err)
	// 	os.Exit(1)
	// }

	// Connect to database (optional for initial setup)
	if cfg.Database.Password != "" {
		err = database.Connect(
			cfg.Database.Host,
			cfg.Database.Port,
			cfg.Database.User,
			cfg.Database.Password,
			cfg.Database.Name,
			cfg.Database.SSLMode,
		)
		if err != nil {
			logger.Warnf("Failed to connect to database: %v (continuing without database)", err)
		} else {
			logger.Info("Connected to database successfully")
			defer database.Close()
		}
	} else {
		logger.Warn("Database password not set, running without database connection")
	}

	// Initialize verification provider (using mock for now)
	// Replace with actual Equifax provider when integration is ready
	provider := verification.NewMockProvider(0.7) // 70% approval rate for testing

	// Initialize repository
	var repo verification.Repository
	if database.GetDB() != nil {
		repo = verification.NewPostgresRepository(database.GetDB())
	}

	// Initialize verification service
	verificationService := verification.NewService(provider, repo)

	// Initialize handlers
	verificationHandler := handlers.NewVerificationHandler(verificationService)

	// Setup router
	router := mux.NewRouter()

	// Apply global middleware
	router.Use(middleware.RequestID)
	router.Use(middleware.Logging)
	router.Use(middleware.Recovery)

	// Health check endpoint
	router.HandleFunc("/health", handlers.HealthCheck).Methods("GET")

	// Verification endpoints
	apiRouter := router.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/verify", verificationHandler.SubmitVerification).Methods("POST")
	apiRouter.HandleFunc("/verify/{id}", verificationHandler.GetVerificationStatus).Methods("GET")
	apiRouter.HandleFunc("/verify/{id}/retry", verificationHandler.RetryVerification).Methods("POST")

	// Setup CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   cfg.CORS.AllowedOrigins,
		AllowedMethods:   cfg.CORS.AllowedMethods,
		AllowedHeaders:   cfg.CORS.AllowedHeaders,
		AllowCredentials: true,
	})

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	logger.Infof("Server starting on %s", addr)

	if err := http.ListenAndServe(addr, corsHandler.Handler(router)); err != nil {
		logger.Errorf("Server failed to start: %v", err)
		os.Exit(1)
	}
}