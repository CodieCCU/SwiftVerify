package logger

import (
	"fmt"
	"regexp"
	"sync"

	"github.com/CodieCCU/SwiftVerify/pkg/models"
)

// AlertManager handles real-time monitoring and alerting
type AlertManager struct {
	mu      sync.RWMutex
	configs []models.AlertConfiguration
}

// NewAlertManager creates a new alert manager
func NewAlertManager() *AlertManager {
	return &AlertManager{
		configs: make([]models.AlertConfiguration, 0),
	}
}

// AddAlertConfig adds a new alert configuration
func (am *AlertManager) AddAlertConfig(config models.AlertConfiguration) {
	am.mu.Lock()
	defer am.mu.Unlock()
	am.configs = append(am.configs, config)
}

// CheckAlerts checks if a log entry matches any alert rules
func (am *AlertManager) CheckAlerts(auditLog models.AuditLog) {
	am.mu.RLock()
	defer am.mu.RUnlock()

	for _, config := range am.configs {
		if !config.IsActive {
			continue
		}

		if am.matchesAlert(auditLog, config) {
			am.triggerAlert(auditLog, config)
		}
	}
}

// matchesAlert checks if a log entry matches an alert configuration
func (am *AlertManager) matchesAlert(log models.AuditLog, config models.AlertConfiguration) bool {
	// Check category match
	if config.Category != "" && log.Category != config.Category {
		return false
	}

	// Check severity match
	if config.Severity != "" && log.Severity != config.Severity {
		return false
	}

	// Check pattern match
	if config.Pattern != "" {
		matched, err := regexp.MatchString(config.Pattern, log.Action)
		if err != nil || !matched {
			return false
		}
	}

	return true
}

// triggerAlert sends an alert notification
func (am *AlertManager) triggerAlert(auditLog models.AuditLog, config models.AlertConfiguration) {
	// In production, this would send emails, webhooks, etc.
	// For now, we'll log to console
	fmt.Printf("ALERT [%s]: %s - %s (Severity: %s)\n",
		config.Name,
		auditLog.Category,
		auditLog.Action,
		auditLog.Severity,
	)

	// TODO: Implement actual notification mechanisms:
	// - Email notifications
	// - Webhook calls
	// - SMS alerts
	// - Integration with monitoring systems (PagerDuty, etc.)
}

// GetActiveAlerts returns all active alert configurations
func (am *AlertManager) GetActiveAlerts() []models.AlertConfiguration {
	am.mu.RLock()
	defer am.mu.RUnlock()

	active := make([]models.AlertConfiguration, 0)
	for _, config := range am.configs {
		if config.IsActive {
			active = append(active, config)
		}
	}
	return active
}

// RemoveAlertConfig removes an alert configuration by name
func (am *AlertManager) RemoveAlertConfig(name string) error {
	am.mu.Lock()
	defer am.mu.Unlock()

	for i, config := range am.configs {
		if config.Name == name {
			am.configs = append(am.configs[:i], am.configs[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("alert configuration '%s' not found", name)
}
