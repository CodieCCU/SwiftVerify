import React from 'react';

/**
 * Lease viewer component for displaying PDF documents
 */
const LeaseViewer = ({ leaseUrl, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Lease Agreement</h3>
        <button
          onClick={onClose}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Close
        </button>
      </div>
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        overflow: 'auto',
        padding: '2rem',
      }}>
        {leaseUrl ? (
          <iframe
            src={leaseUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Lease Document"
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
            <h3>Lease Document Preview</h3>
            <p>In production, this would display your actual lease PDF</p>
            <div style={{
              marginTop: '2rem',
              padding: '2rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              maxWidth: '600px',
            }}>
              <h4 style={{ marginTop: 0 }}>Sample Lease Terms:</h4>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Monthly rent amount and due date</li>
                <li>Lease term and renewal options</li>
                <li>Security deposit requirements</li>
                <li>Tenant and landlord responsibilities</li>
                <li>Property rules and regulations</li>
                <li>Maintenance and repair policies</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaseViewer;
