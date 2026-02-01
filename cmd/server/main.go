package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/CodieCCU/SwiftVerify/internal/db"
	"github.com/CodieCCU/SwiftVerify/internal/handlers"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// Initialize database connection
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://localhost/swiftverify?sslmode=disable"
	}

	database, err := db.NewDatabase(connStr)
	if err != nil {
		log.Printf("Warning: Database connection failed: %v", err)
		log.Println("Continuing without database (some features will not work)")
		database = nil
	} else {
		defer database.Close()
	}

	// Initialize handlers
	var landlordHandler *handlers.LandlordHandler
	var applicationHandler *handlers.ApplicationHandler
	
	if database != nil {
		landlordHandler = handlers.NewLandlordHandler(database)
		applicationHandler = handlers.NewApplicationHandler(database)
	}

	// Setup router
	r := mux.NewRouter()

	// WebSocket endpoint (original)
	r.HandleFunc("/ws", handleWebSocket)

	// API endpoints
	api := r.PathPrefix("/api").Subrouter()

	if landlordHandler != nil && applicationHandler != nil {
		// Landlord endpoints
		api.HandleFunc("/landlord/applications", landlordHandler.GetApplications).Methods("GET")
		api.HandleFunc("/landlord/reapplication-link", landlordHandler.CreateReapplicationLink).Methods("POST")
		api.HandleFunc("/landlord/token/{token}/validate", landlordHandler.ValidateToken).Methods("GET")

		// Application endpoints
		api.HandleFunc("/applications", applicationHandler.SubmitApplication).Methods("POST")
	}

	// CORS middleware
	r.Use(func(next http.Handler) http.Handler {
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
	})

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
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
