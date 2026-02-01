package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/CodieCCU/SwiftVerify/internal/database"
	"github.com/CodieCCU/SwiftVerify/internal/handlers"
	"github.com/CodieCCU/SwiftVerify/internal/services"
	"github.com/CodieCCU/SwiftVerify/internal/utils"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// Get configuration from environment variables
	dbConnString := os.Getenv("DATABASE_URL")
	if dbConnString == "" {
		dbConnString = "postgres://user:password@localhost:5432/swiftverify?sslmode=disable"
		log.Println("DATABASE_URL not set, using default connection string")
	}

	encryptionKey := os.Getenv("ENCRYPTION_KEY")
	if encryptionKey == "" {
		// Generate a random 32-byte key for development (DO NOT use in production)
		encryptionKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
		log.Println("WARNING: Using default encryption key. Set ENCRYPTION_KEY in production!")
	}

	// Initialize database connection
	db, err := database.NewDB(dbConnString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Database connection established")

	// Initialize encryption service
	encryptionService, err := utils.NewEncryptionService(encryptionKey)
	if err != nil {
		log.Fatalf("Failed to initialize encryption service: %v", err)
	}

	// Initialize notification service
	notificationService := services.NewNotificationService(db)

	// Initialize handlers
	dlHandler := handlers.NewDriversLicenseHandler(db, encryptionService, notificationService)

	// Setup router
	router := mux.NewRouter()

	// WebSocket endpoint (existing)
	router.HandleFunc("/ws", handleWebSocket)

	// API endpoints for driver's license lifecycle management
	router.HandleFunc("/api/drivers-license", dlHandler.CreateDriversLicense).Methods("POST")
	router.HandleFunc("/api/audit-logs", dlHandler.GetAuditLogs).Methods("GET")
	router.HandleFunc("/api/deletion-reports", dlHandler.GetDeletionReport).Methods("GET")
	router.HandleFunc("/api/deletion-job-logs", dlHandler.GetDeletionJobLogs).Methods("GET")
	router.HandleFunc("/api/process-notifications", dlHandler.ProcessNotifications).Methods("POST")

	// CORS middleware
	router.Use(corsMiddleware)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	// Handle WebSocket communication
	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}
		// Handle incoming message
		if err := conn.WriteMessage(messageType, msg); err != nil {
			break
		}
	}
}

// corsMiddleware adds CORS headers to allow frontend access
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
