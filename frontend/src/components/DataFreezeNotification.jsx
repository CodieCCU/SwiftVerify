import React from 'react';

const DataFreezeNotification = ({ instructions, onClose }) => {
  if (!instructions) return null;

  const contact = instructions.contact || {};
  const steps = instructions.steps || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#ff9800',
          color: 'white',
          padding: '1.5rem',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            ⚠️ Data Freeze Detected
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #ff9800'
          }}>
            <p style={{ margin: 0, color: '#e65100', fontWeight: '500' }}>
              We've detected a Data Freeze on your Equifax Work Number record. This prevents us from verifying your employment information.
            </p>
          </div>

          {/* Instructions */}
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            {instructions.title || 'How to Remove Your Data Freeze'}
          </h3>
          
          <ol style={{ 
            paddingLeft: '1.5rem',
            color: '#555',
            lineHeight: '1.8'
          }}>
            {steps.map((step, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                {step}
              </li>
            ))}
          </ol>

          {/* Contact Information */}
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '4px',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              Equifax Work Number Contact Information
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#555' }}>
              {contact.phone && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${contact.phone}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.hours && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Hours:</strong> {contact.hours}
                </p>
              )}
              {contact.website && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Website:</strong>{' '}
                  <a 
                    href={contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                  >
                    {contact.website}
                  </a>
                </p>
              )}
              {contact.support_email && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${contact.support_email}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                    {contact.support_email}
                  </a>
                </p>
              )}
              {contact.form_link && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Online Form:</strong>{' '}
                  <a 
                    href={contact.form_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'none' }}
                  >
                    Submit Freeze Removal Request
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Estimated Time */}
          {instructions.estimated_time && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              color: '#1976d2'
            }}>
              <strong>⏱️ Estimated Processing Time:</strong> {instructions.estimated_time}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500',
              marginTop: '1.5rem'
            }}
          >
            I Understand - Return to Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataFreezeNotification;
