import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

const PropertyListings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [bedroomFilter, setBedroomFilter] = useState('all');

  // Mock property data - in production, this would come from an API
  const mockProperties = [
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
      featured: true,
      image: null
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
      featured: false,
      image: null
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
      featured: true,
      image: null
    },
    {
      id: 4,
      address: '321 Elm Court',
      city: 'Boise',
      state: 'ID',
      zip: '83706',
      rent: 1350,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 950,
      featured: false,
      image: null
    },
    {
      id: 5,
      address: '654 Maple Lane',
      city: 'Eagle',
      state: 'ID',
      zip: '83616',
      rent: 2500,
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 2400,
      featured: true,
      image: null
    },
    {
      id: 6,
      address: '987 Cedar Street',
      city: 'Boise',
      state: 'ID',
      zip: '83703',
      rent: 1650,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1350,
      featured: false,
      image: null
    }
  ];

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'under1500' && property.rent < 1500) ||
                        (priceFilter === '1500-2000' && property.rent >= 1500 && property.rent <= 2000) ||
                        (priceFilter === 'over2000' && property.rent > 2000);
    
    const matchesBedrooms = bedroomFilter === 'all' ||
                           (bedroomFilter === '1' && property.bedrooms === 1) ||
                           (bedroomFilter === '2' && property.bedrooms === 2) ||
                           (bedroomFilter === '3' && property.bedrooms === 3) ||
                           (bedroomFilter === '4+' && property.bedrooms >= 4);
    
    return matchesSearch && matchesPrice && matchesBedrooms;
  });

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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Header */}
      <div style={{
        backgroundColor: '#16213e',
        padding: '2rem 2rem 3rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(233, 69, 96, 0.2)'
      }}>
        <h2 style={{
          margin: '0 0 1rem 0',
          fontSize: '2rem',
          color: 'white',
          fontWeight: '700'
        }}>
          Available Properties in Boise Area
        </h2>
        <p style={{
          margin: 0,
          color: '#a0a0a0',
          fontSize: '1rem'
        }}>
          Find your perfect rental home and start your application today
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Filters */}
        <div style={{
          backgroundColor: '#16213e',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                color: '#a0a0a0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Search Location
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Address or city..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0f3460',
                  border: '1px solid #1a1a2e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Price Filter */}
            <div>
              <label style={{
                display: 'block',
                color: '#a0a0a0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Price Range
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0f3460',
                  border: '1px solid #1a1a2e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Prices</option>
                <option value="under1500">Under $1,500</option>
                <option value="1500-2000">$1,500 - $2,000</option>
                <option value="over2000">Over $2,000</option>
              </select>
            </div>

            {/* Bedroom Filter */}
            <div>
              <label style={{
                display: 'block',
                color: '#a0a0a0',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Bedrooms
              </label>
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0f3460',
                  border: '1px solid #1a1a2e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            Showing {filteredProperties.length} of {mockProperties.length} properties
          </div>
        </div>

        {/* Property Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: '#16213e',
            borderRadius: '12px',
            color: '#a0a0a0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Properties Found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        )}
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
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#a0a0a0' }}>
          Serving the Boise Rental Market
        </p>
      </footer>
    </div>
  );
};

export default PropertyListings;
