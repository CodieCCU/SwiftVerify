package logger

import (
	"net/http"
	"time"

	"github.com/CodieCCU/SwiftVerify/pkg/models"
)

// HTTPLoggingMiddleware logs all HTTP requests and responses
type HTTPLoggingMiddleware struct {
	logger *Logger
}

// NewHTTPLoggingMiddleware creates a new HTTP logging middleware
func NewHTTPLoggingMiddleware(logger *Logger) *HTTPLoggingMiddleware {
	return &HTTPLoggingMiddleware{
		logger: logger,
	}
}

// Middleware returns the HTTP middleware handler
func (m *HTTPLoggingMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Create a response writer wrapper to capture status code
		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		// Log incoming request
		requestMetadata := map[string]interface{}{
			"method":      r.Method,
			"path":        r.URL.Path,
			"query":       r.URL.RawQuery,
			"remote_addr": r.RemoteAddr,
			"user_agent":  r.UserAgent(),
			"referer":     r.Referer(),
		}

		m.logger.Log(models.LogEntry{
			Category:    models.CategoryAPICall,
			Action:      "http_request_received",
			Severity:    models.SeverityInfo,
			Source:      models.SourceBackend,
			IPAddress:   r.RemoteAddr,
			UserAgent:   r.UserAgent(),
			Metadata:    requestMetadata,
			RequestData: requestMetadata,
		})

		// Call next handler
		next.ServeHTTP(rw, r)

		// Log response
		duration := time.Since(startTime)
		responseMetadata := map[string]interface{}{
			"status_code":    rw.statusCode,
			"duration_ms":    duration.Milliseconds(),
			"bytes_written":  rw.bytesWritten,
			"method":         r.Method,
			"path":           r.URL.Path,
		}

		severity := models.SeverityInfo
		if rw.statusCode >= 400 && rw.statusCode < 500 {
			severity = models.SeverityWarn
		} else if rw.statusCode >= 500 {
			severity = models.SeverityError
		}

		m.logger.Log(models.LogEntry{
			Category:     models.CategoryAPICall,
			Action:       "http_request_completed",
			Severity:     severity,
			Source:       models.SourceBackend,
			IPAddress:    r.RemoteAddr,
			UserAgent:    r.UserAgent(),
			Metadata:     responseMetadata,
			ResponseData: responseMetadata,
		})
	})
}

// responseWriter wraps http.ResponseWriter to capture response details
type responseWriter struct {
	http.ResponseWriter
	statusCode   int
	bytesWritten int
}

// WriteHeader captures the status code
func (rw *responseWriter) WriteHeader(statusCode int) {
	rw.statusCode = statusCode
	rw.ResponseWriter.WriteHeader(statusCode)
}

// Write captures the bytes written
func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytesWritten += n
	return n, err
}
