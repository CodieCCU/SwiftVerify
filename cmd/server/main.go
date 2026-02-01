package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/CodieCCU/SwiftVerify/pkg/logger"
	"github.com/CodieCCU/SwiftVerify/pkg/models"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var auditLogger *logger.Logger

func main() {
	// Initialize audit logger
	var err error
	auditLogger, err = logger.NewLogger("./logs")
	if err != nil {
		log.Fatalf("Failed to initialize audit logger: %v", err)
	}
	defer auditLogger.Close()

	// Log server startup
	auditLogger.LogInfo(models.CategoryServerEvent, "server_started", map[string]interface{}{
		"port": 8080,
		"time": time.Now().Format(time.RFC3339),
	})

	// Setup alert configurations
	setupAlerts()

	// Create HTTP logging middleware
	loggingMiddleware := logger.NewHTTPLoggingMiddleware(auditLogger)

	// Setup routes with logging
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handleWebSocket)
	mux.HandleFunc("/api/logs", handleLogsAPI)
	mux.HandleFunc("/api/logs/export", handleLogExport)
	mux.HandleFunc("/health", handleHealth)

	// Wrap with logging middleware
	handler := loggingMiddleware.Middleware(mux)

	// Setup graceful shutdown
	server := &http.Server{
		Addr:    ":8080",
		Handler: handler,
	}

	// Handle shutdown signals
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan

		log.Println("Shutting down server...")
		auditLogger.LogInfo(models.CategoryServerEvent, "server_shutdown", map[string]interface{}{
			"time": time.Now().Format(time.RFC3339),
		})

		server.Close()
	}()

	log.Printf("Server starting on port 8080...")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		auditLogger.LogError(models.CategoryServerEvent, "server_error", err, nil)
		log.Fatalf("Server error: %v", err)
	}
}

func setupAlerts() {
	// Setup critical error alerts
	// In production, these would be loaded from database/config
	// Example: Alert on critical errors
	// auditLogger.alertManager.AddAlertConfig(models.AlertConfiguration{
	// 	Name:     "Critical Errors",
	// 	Severity: models.SeverityCritical,
	// 	IsActive: true,
	// })
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session")
	
	auditLogger.Log(models.LogEntry{
		Category:  models.CategoryServerEvent,
		Action:    "websocket_connection_attempt",
		Severity:  models.SeverityInfo,
		Source:    models.SourceBackend,
		SessionID: sessionID,
		IPAddress: r.RemoteAddr,
		UserAgent: r.UserAgent(),
		Metadata: map[string]interface{}{
			"path": r.URL.Path,
		},
	})

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		auditLogger.LogError(models.CategoryServerEvent, "websocket_upgrade_failed", err, map[string]interface{}{
			"session_id": sessionID,
			"ip_address": r.RemoteAddr,
		})
		http.Error(w, "Could not upgrade connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	auditLogger.LogInfo(models.CategoryServerEvent, "websocket_connected", map[string]interface{}{
		"session_id": sessionID,
		"ip_address": r.RemoteAddr,
	})

	// Handle WebSocket communication
	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			auditLogger.LogInfo(models.CategoryServerEvent, "websocket_disconnected", map[string]interface{}{
				"session_id": sessionID,
				"error":      err.Error(),
			})
			break
		}

		// Log incoming message (sanitize sensitive data)
		auditLogger.Log(models.LogEntry{
			Category:  models.CategoryServerEvent,
			Action:    "websocket_message_received",
			Severity:  models.SeverityInfo,
			Source:    models.SourceBackend,
			SessionID: sessionID,
			Metadata: map[string]interface{}{
				"message_type": messageType,
				"message_size": len(msg),
			},
		})

		// Handle incoming message
		if err := conn.WriteMessage(messageType, msg); err != nil {
			auditLogger.LogError(models.CategoryServerEvent, "websocket_write_failed", err, map[string]interface{}{
				"session_id": sessionID,
			})
			break
		}
	}
}

func handleLogsAPI(w http.ResponseWriter, r *http.Request) {
	// Endpoint for frontend to submit logs
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var logEntry models.LogEntry
	if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Ensure source is frontend
	logEntry.Source = models.SourceFrontend
	logEntry.IPAddress = r.RemoteAddr
	logEntry.UserAgent = r.UserAgent()

	if err := auditLogger.Log(logEntry); err != nil {
		log.Printf("Failed to log frontend entry: %v", err)
		http.Error(w, "Failed to log entry", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "logged"})
}

func handleLogExport(w http.ResponseWriter, r *http.Request) {
	// Endpoint for exporting logs to CSV
	// In production, this should have authentication and authorization
	format := r.URL.Query().Get("format")
	if format == "" {
		format = "csv"
	}

	// Read logs from file
	logs, err := logger.ReadLogsFromFile("./logs/audit_" + time.Now().Format("2006-01-02") + ".jsonl")
	if err != nil {
		log.Printf("Failed to read logs: %v", err)
		http.Error(w, "Failed to read logs", http.StatusInternalServerError)
		return
	}

	switch format {
	case "csv":
		tmpFile := "/tmp/logs_export.csv"
		if err := logger.ExportToCSV(logs, tmpFile); err != nil {
			log.Printf("Failed to export to CSV: %v", err)
			http.Error(w, "Failed to export logs", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/csv")
		w.Header().Set("Content-Disposition", "attachment; filename=audit_logs.csv")
		http.ServeFile(w, r, tmpFile)

	case "json":
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(logs)

	default:
		http.Error(w, "Unsupported format", http.StatusBadRequest)
	}

	auditLogger.LogInfo(models.CategoryServerEvent, "logs_exported", map[string]interface{}{
		"format":     format,
		"log_count":  len(logs),
		"ip_address": r.RemoteAddr,
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"uptime":    time.Since(time.Now()).String(), // Would be actual uptime in production
	})
}