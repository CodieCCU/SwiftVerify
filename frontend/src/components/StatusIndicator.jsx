import React from 'react';

const StatusIndicator = ({ status, label, isActive = false }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'processing':
        return '#ff9800';
      case 'pending':
        return '#9e9e9e';
      case 'failed':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⟳';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: isActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 'bold',
        flexShrink: 0
      }}>
        {getStatusIcon()}
      </div>
      <div>
        <div style={{
          color: 'white',
          fontWeight: '500',
          fontSize: '0.875rem'
        }}>
          {label}
        </div>
        <div style={{
          color: '#a0a0a0',
          fontSize: '0.75rem',
          textTransform: 'capitalize'
        }}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
