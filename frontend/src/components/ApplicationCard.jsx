import React from 'react';

const ApplicationCard = ({ application, onSendLease, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'denied':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      case 'lease_sent':
        return '#2196f3';
      case 'lease_signed':
        return '#00897b';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'denied':
        return 'Denied';
      case 'pending':
        return 'Pending Review';
      case 'lease_sent':
        return 'Lease Sent';
      case 'lease_signed':
        return 'Lease Signed';
      default:
        return status;
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f3460',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '600'
          }}>
            {application.applicantName}
          </h3>
          <p style={{
            margin: 0,
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            {application.email}
          </p>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          backgroundColor: getStatusColor(application.status),
          color: 'white',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {getStatusLabel(application.status)}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#a0a0a0', marginBottom: '0.25rem' }}>
            Property
          </div>
          <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            {application.propertyAddress}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#a0a0a0', marginBottom: '0.25rem' }}>
            Application Date
          </div>
          <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            {new Date(application.applicationDate).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#a0a0a0', marginBottom: '0.25rem' }}>
            Income Verified
          </div>
          <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            {application.incomeVerified ? '✓ Yes' : '✗ No'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#a0a0a0', marginBottom: '0.25rem' }}>
            Background Check
          </div>
          <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            {application.backgroundCheckPassed ? '✓ Passed' : '✗ Failed'}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem'
      }}>
        <button
          onClick={() => onViewDetails(application.id)}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: '2px solid #1976d2',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}
        >
          View Details
        </button>
        {application.status === 'approved' && !application.leaseSent && (
          <button
            onClick={() => onSendLease(application.id)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Send Lease
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
