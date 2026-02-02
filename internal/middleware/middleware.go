package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/CodieCCU/SwiftVerify/internal/logger"
)

type contextKey string

const (
	RequestIDKey contextKey = "request_id"
)

// RequestID middleware adds a unique request ID to each request
func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}

		// Add to context
		ctx := context.WithValue(r.Context(), RequestIDKey, requestID)

		// Add to response headers
		w.Header().Set("X-Request-ID", requestID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Logging middleware logs all HTTP requests
func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create a custom response writer to capture status code
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		requestID := r.Context().Value(RequestIDKey)

		logger.WithFields(map[string]interface{}{
			"method":     r.Method,
			"path":       r.URL.Path,
			"request_id": requestID,
			"remote_ip":  r.RemoteAddr,
		}).Info("HTTP request started")

		next.ServeHTTP(lrw, r)

		duration := time.Since(start)

		logger.WithFields(map[string]interface{}{
			"method":      r.Method,
			"path":        r.URL.Path,
			"status_code": lrw.statusCode,
			"duration_ms": duration.Milliseconds(),
			"request_id":  requestID,
		}).Info("HTTP request completed")
	})
}

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

// Recovery middleware recovers from panics
func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				requestID := r.Context().Value(RequestIDKey)
				
				logger.WithFields(map[string]interface{}{
					"error":      err,
					"request_id": requestID,
					"path":       r.URL.Path,
				}).Error("Panic recovered")

				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(`{"error": {"type": "INTERNAL_ERROR", "message": "An unexpected error occurred"}}`))
			}
		}()

		next.ServeHTTP(w, r)
	})
}
