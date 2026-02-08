import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import { getProperties, createProperty, updateScreeningCriteria } from '../../services/landlord';

const PropertyManagement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    units: '',
    screeningCriteria: {
      minIncomeMultiplier: 2.5,
      minEmploymentMonths: 3,
    },
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const result = await getProperties();
    if (result.success) {
      setProperties(result.properties);
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    const result = await createProperty(newProperty);
    if (result.success) {
      setProperties([...properties, result.property]);
      setShowAddProperty(false);
      setNewProperty({
        name: '',
        address: '',
        units: '',
        screeningCriteria: {
          minIncomeMultiplier: 2.5,
          minEmploymentMonths: 3,
        },
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Property Management</h1>
        <button
          onClick={() => navigate('/landlord/dashboard')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem',
      }}>
        {/* NO CREDIT CHECK Reminder */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
        }}>
          <p style={{ margin: 0, color: '#856404', fontWeight: '600' }}>
            🚫💳 Screening criteria must NOT include credit checks or credit scores
          </p>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '2rem', color: '#333' }}>
              Your Properties
            </h2>
            <p style={{ margin: 0, color: '#666' }}>
              Manage properties and set screening criteria
            </p>
          </div>
          <button
            onClick={() => setShowAddProperty(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            + Add Property
          </button>
        </div>

        {/* Add Property Form */}
        {showAddProperty && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>Add New Property</h3>
            <form onSubmit={handleCreateProperty}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Property Name *
                </label>
                <input
                  type="text"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Address *
                </label>
                <input
                  type="text"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Number of Units *
                </label>
                <input
                  type="number"
                  value={newProperty.units}
                  onChange={(e) => setNewProperty({...newProperty, units: e.target.value})}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              
              <h4 style={{ marginTop: '1.5rem', color: '#1976d2' }}>Screening Criteria (NO CREDIT CHECKS)</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Minimum Income Multiplier (e.g., 2.5x rent)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newProperty.screeningCriteria.minIncomeMultiplier}
                  onChange={(e) => setNewProperty({
                    ...newProperty,
                    screeningCriteria: {
                      ...newProperty.screeningCriteria,
                      minIncomeMultiplier: parseFloat(e.target.value)
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Minimum Employment Duration (months)
                </label>
                <input
                  type="number"
                  value={newProperty.screeningCriteria.minEmploymentMonths}
                  onChange={(e) => setNewProperty({
                    ...newProperty,
                    screeningCriteria: {
                      ...newProperty.screeningCriteria,
                      minEmploymentMonths: parseInt(e.target.value)
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Create Property
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProperty(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Properties Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => navigate(`/landlord/applications/${property.id}`)}
            />
          ))}
        </div>

        {properties.length === 0 && !showAddProperty && (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ color: '#666' }}>No properties yet</h3>
            <p style={{ color: '#999' }}>Add your first property to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagement;
