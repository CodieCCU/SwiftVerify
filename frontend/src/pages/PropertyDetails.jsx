import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);

  // Mock property data - in production, this would come from an API based on ID
  const property = {
    id: id,
    address: '123 Main Street',
    city: 'Boise',
    state: 'ID',
    zip: '83702',
    rent: 1500,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    featured: true,
    description: 'Beautiful 2-bedroom apartment in the heart of downtown Boise. Features include modern kitchen, hardwood floors, in-unit laundry, and amazing views of the city. Walking distance to restaurants, shops, and public transportation.',
    amenities: ['In-unit Laundry', 'Hardwood Floors', 'Modern Kitchen', 'Dishwasher', 'Air Conditioning', 'Pet Friendly', 'Parking Included', 'Balcony'],
    availableDate: '2026-03-01',
    leaseTerms: '12 months',
    deposit: 1500,
    image: null
  };

  const handleApply = () => {
    navigate('/login', { state: { propertyId: id } });
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
        <div 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
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
            ✓
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>SwiftVerify</h1>
        </div>
        <button
          onClick={() => navigate('/properties')}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}
        >
          ← Back to Properties
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Property Image */}
        <div style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#16213e',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '6rem',
          color: '#e94560',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        }}>
          🏠
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div>
            {/* Header */}
            <div style={{
              backgroundColor: '#16213e',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '2rem',
                color: 'white',
                fontWeight: '700'
              }}>
                {property.address}
              </h2>
              <p style={{
                margin: '0 0 1.5rem 0',
                color: '#a0a0a0',
                fontSize: '1rem'
              }}>
                {property.city}, {property.state} {property.zip}
              </p>

              <div style={{
                display: 'flex',
                gap: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(233, 69, 96, 0.2)'
              }}>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Bedrooms
                  </div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
                    {property.bedrooms}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Bathrooms
                  </div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
                    {property.bathrooms}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Square Feet
                  </div>
                  <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
                    {property.sqft}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              backgroundColor: '#16213e',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: '600'
              }}>
                Description
              </h3>
              <p style={{
                margin: 0,
                color: '#a0a0a0',
                lineHeight: '1.6',
                fontSize: '0.875rem'
              }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div style={{
              backgroundColor: '#16213e',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: '600'
              }}>
                Amenities
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
              }}>
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#a0a0a0',
                      fontSize: '0.875rem'
                    }}
                  >
                    <span style={{ color: '#4caf50' }}>✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div style={{
              backgroundColor: '#16213e',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#e94560',
                marginBottom: '0.5rem'
              }}>
                ${property.rent.toLocaleString()}<span style={{ fontSize: '1rem', color: '#a0a0a0' }}>/mo</span>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Available
                  </div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    {new Date(property.availableDate).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Lease Term
                  </div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    {property.leaseTerms}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Security Deposit
                  </div>
                  <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                    ${property.deposit.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleApply}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#e94560',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 16px rgba(233, 69, 96, 0.3)'
                }}
              >
                Apply Now
              </button>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Contact Landlord
              </button>

              {showContactForm && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#0f3460',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#a0a0a0',
                  textAlign: 'center'
                }}>
                  For inquiries, please email:<br />
                  <a href="mailto:landlord@swiftverify.com" style={{ color: '#e94560', textDecoration: 'none', fontWeight: '600' }}>
                    landlord@swiftverify.com
                  </a>
                </div>
              )}
            </div>
          </div>
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
          © 2026 SwiftVerify - Path to Yes Fintech Platform
        </p>
      </footer>
    </div>
  );
};

export default PropertyDetails;
