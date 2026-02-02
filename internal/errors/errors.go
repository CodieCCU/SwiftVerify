package errors

import (
	"fmt"
	"net/http"
)

// ErrorType represents different types of errors in the system
type ErrorType string

const (
	// ErrorTypeValidation indicates a validation error
	ErrorTypeValidation ErrorType = "VALIDATION_ERROR"
	// ErrorTypeNotFound indicates a resource was not found
	ErrorTypeNotFound ErrorType = "NOT_FOUND"
	// ErrorTypeInternal indicates an internal server error
	ErrorTypeInternal ErrorType = "INTERNAL_ERROR"
	// ErrorTypeUnauthorized indicates an unauthorized request
	ErrorTypeUnauthorized ErrorType = "UNAUTHORIZED"
	// ErrorTypeVerificationFailed indicates verification failed
	ErrorTypeVerificationFailed ErrorType = "VERIFICATION_FAILED"
	// ErrorTypeVerificationTimeout indicates verification timed out
	ErrorTypeVerificationTimeout ErrorType = "VERIFICATION_TIMEOUT"
	// ErrorTypeEquifaxAPI indicates an error from Equifax API
	ErrorTypeEquifaxAPI ErrorType = "EQUIFAX_API_ERROR"
	// ErrorTypeDatabase indicates a database error
	ErrorTypeDatabase ErrorType = "DATABASE_ERROR"
)

// AppError represents an application error with context
type AppError struct {
	Type       ErrorType
	Message    string
	StatusCode int
	Err        error
	Details    map[string]interface{}
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s (caused by: %v)", e.Type, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

// NewValidationError creates a new validation error
func NewValidationError(message string, details map[string]interface{}) *AppError {
	return &AppError{
		Type:       ErrorTypeValidation,
		Message:    message,
		StatusCode: http.StatusBadRequest,
		Details:    details,
	}
}

// NewNotFoundError creates a new not found error
func NewNotFoundError(message string) *AppError {
	return &AppError{
		Type:       ErrorTypeNotFound,
		Message:    message,
		StatusCode: http.StatusNotFound,
	}
}

// NewInternalError creates a new internal error
func NewInternalError(message string, err error) *AppError {
	return &AppError{
		Type:       ErrorTypeInternal,
		Message:    message,
		StatusCode: http.StatusInternalServerError,
		Err:        err,
	}
}

// NewUnauthorizedError creates a new unauthorized error
func NewUnauthorizedError(message string) *AppError {
	return &AppError{
		Type:       ErrorTypeUnauthorized,
		Message:    message,
		StatusCode: http.StatusUnauthorized,
	}
}

// NewVerificationError creates a new verification error
func NewVerificationError(message string, err error, details map[string]interface{}) *AppError {
	return &AppError{
		Type:       ErrorTypeVerificationFailed,
		Message:    message,
		StatusCode: http.StatusUnprocessableEntity,
		Err:        err,
		Details:    details,
	}
}

// NewVerificationTimeoutError creates a new verification timeout error
func NewVerificationTimeoutError(message string) *AppError {
	return &AppError{
		Type:       ErrorTypeVerificationTimeout,
		Message:    message,
		StatusCode: http.StatusRequestTimeout,
	}
}

// NewEquifaxAPIError creates a new Equifax API error
func NewEquifaxAPIError(message string, err error, statusCode int) *AppError {
	return &AppError{
		Type:       ErrorTypeEquifaxAPI,
		Message:    message,
		StatusCode: statusCode,
		Err:        err,
	}
}

// NewDatabaseError creates a new database error
func NewDatabaseError(message string, err error) *AppError {
	return &AppError{
		Type:       ErrorTypeDatabase,
		Message:    message,
		StatusCode: http.StatusInternalServerError,
		Err:        err,
	}
}
