import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyManagement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([
    {
      id: 1,
      address: '123 Main Street',
      city: 'Boise',
      state: 'ID',
      zip: '83702',
      rent: 1500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      status: 'available',
      units: 1,
      leaseDocument: 'lease_123main.pdf'
    },
    {
      id: 2,
      address: '456 Oak Avenue',
      city: 'Boise',
      state: 'ID',
      zip: '83704',
      rent: 1800,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1500,
      status: 'occupied',
      units: 1,
      leaseDocument: 'lease_456oak.pdf'
    },
    {
      id: 3,
      address: '789 Pine Drive',
      city: 'Meridian',
      state: 'ID',
      zip: '83642',
      rent: 2200,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2000,
      status: 'available',
      units: 1,
      leaseDocument: null
    }
  ]);

  const handleLogout = () => {
    sessionStorage.removeItem('landlordAuth');
    sessionStorage.removeItem('landlordEmail');
    navigate('/landlord/login');
  };

  const handleUploadLease = (propertyId) => {
    alert(`Upload lease for property ${propertyId}. In production, this would open a file upload dialog.`);
  };

  const handleEditProperty = (propertyId) => {
    alert(`Edit property ${propertyId}. In production, this would open an edit form.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#4caf50';
      case 'occupied':
        return '#2196f3';
      case 'maintenance':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#16213e',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e94560',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🏢
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Landlord Portal</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a0a0a0' }}>SwiftVerify</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/landlord/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            ← Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '2rem',
              color: 'white',
              fontWeight: '700'
            }}>
              Property Management
            </h2>
            <p style={{
              margin: 0,
              color: '#a0a0a0',
              fontSize: '0.875rem'
            }}>
              Manage your properties and lease documents
            </p>
          </div>
          <button
            onClick={() => alert('Add new property. In production, this would open a form.')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)'
            }}
          >
            + Add Property
          </button>
        </div>

        {/* Properties Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {properties.map(property => (
            <div
              key={property.id}
              style={{
                backgroundColor: '#16213e',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {/* Property Header */}
              <div style={{
                backgroundColor: '#0f3460',
                padding: '1.5rem',
                borderBottom: '1px solid rgba(233, 69, 96, 0.2)'
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
                      {property.address}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#a0a0a0',
                      fontSize: '0.875rem'
                    }}>
                      {property.city}, {property.state} {property.zip}
                    </p>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: getStatusColor(property.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {property.status}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#a0a0a0'
                }}>
                  <div>🛏️ {property.bedrooms} bed</div>
                  <div>🚿 {property.bathrooms} bath</div>
                  <div>📐 {property.sqft} sqft</div>
                </div>
              </div>

              {/* Property Details */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      Monthly Rent
                    </div>
                    <div style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: '700' }}>
                      ${property.rent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      Units
                    </div>
                    <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                      {property.units}
                    </div>
                  </div>
                </div>

                {/* Lease Document Status */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: property.leaseDocument ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: `1px solid ${property.leaseDocument ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>
                      {property.leaseDocument ? '✓' : '⚠'}
                    </span>
                    <span style={{
                      color: property.leaseDocument ? '#4caf50' : '#ff9800',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {property.leaseDocument ? 'Lease Document Uploaded' : 'No Lease Document'}
                    </span>
                  </div>
                  {property.leaseDocument && (
                    <div style={{
                      color: '#a0a0a0',
                      fontSize: '0.75rem'
                    }}>
                      {property.leaseDocument}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem'
                }}>
                  <button
                    onClick={() => handleEditProperty(property.id)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '2px solid white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUploadLease(property.id)}
                    style={{
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
                    {property.leaseDocument ? 'Update Lease' : 'Upload Lease'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#16213e',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '4rem',
        borderTop: '1px solid rgba(233, 69, 96, 0.2)'
      }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem' }}>
          © 2026 SwiftVerify - Landlord Portal
        </p>
      </footer>
    </div>
  );
};

export default PropertyManagement;
