import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Property Image */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#e0e0e0',
        backgroundImage: property.image ? `url(${property.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {!property.image && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '3rem',
            color: '#999'
          }}>
            🏠
          </div>
        )}
        {property.featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#e94560',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            Featured
          </div>
        )}
      </div>

      {/* Property Details */}
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.25rem',
          color: '#333',
          fontWeight: '600'
        }}>
          {property.address}
        </h3>
        
        <p style={{
          margin: '0 0 1rem 0',
          color: '#666',
          fontSize: '0.875rem'
        }}>
          {property.city}, {property.state} {property.zip}
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#555'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>🛏️</span>
            <span>{property.bedrooms} bed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>🚿</span>
            <span>{property.bathrooms} bath</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>📐</span>
            <span>{property.sqft} sqft</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1976d2'
          }}>
            ${property.rent.toLocaleString()}/mo
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
