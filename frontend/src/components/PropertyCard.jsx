import React from 'react';

/**
 * Property card component for landlord dashboard
 */
const PropertyCard = ({ property, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid #e0e0e0',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '1.3rem', 
            color: '#333',
          }}>
            {property.name}
          </h3>
          <p style={{ 
            margin: 0, 
            color: '#666', 
            fontSize: '0.9rem',
          }}>
            📍 {property.address}
          </p>
        </div>
        {property.activeApplications > 0 && (
          <div style={{
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem',
          }}>
            {property.activeApplications}
          </div>
        )}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e0e0e0',
      }}>
        <div>
          <p style={{ 
            margin: '0 0 0.25rem', 
            fontSize: '0.875rem', 
            color: '#666',
          }}>
            Total Units
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: '#1976d2',
          }}>
            {property.units}
          </p>
        </div>
        <div>
          <p style={{ 
            margin: '0 0 0.25rem', 
            fontSize: '0.875rem', 
            color: '#666',
          }}>
            Active Applications
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: property.activeApplications > 0 ? '#ff9800' : '#4caf50',
          }}>
            {property.activeApplications}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
