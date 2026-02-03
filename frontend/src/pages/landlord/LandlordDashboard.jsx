import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../../components/ApplicationCard';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const landlordEmail = sessionStorage.getItem('landlordEmail') || 'landlord@swiftverify.com';

  // Check authentication
  React.useEffect(() => {
    if (!sessionStorage.getItem('landlordAuth')) {
      navigate('/landlord/login');
    }
  }, [navigate]);

  // Mock applications data
  const [applications] = useState([
    {
      id: 1,
      applicantName: 'John Doe',
      email: 'john.doe@email.com',
      propertyAddress: '123 Main Street',
      applicationDate: '2026-02-01',
      status: 'approved',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: false
    },
    {
      id: 2,
      applicantName: 'Jane Smith',
      email: 'jane.smith@email.com',
      propertyAddress: '456 Oak Avenue',
      applicationDate: '2026-02-02',
      status: 'pending',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: false
    },
    {
      id: 3,
      applicantName: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      propertyAddress: '789 Pine Drive',
      applicationDate: '2026-01-30',
      status: 'lease_sent',
      incomeVerified: true,
      backgroundCheckPassed: true,
      leaseSent: true
    },
    {
      id: 4,
      applicantName: 'Alice Williams',
      email: 'alice.w@email.com',
      propertyAddress: '321 Elm Court',
      applicationDate: '2026-01-28',
      status: 'denied',
      incomeVerified: false,
      backgroundCheckPassed: true,
      leaseSent: false
    }
  ]);

  const handleLogout = () => {
    sessionStorage.removeItem('landlordAuth');
    sessionStorage.removeItem('landlordEmail');
    navigate('/landlord/login');
  };

  const handleSendLease = (applicationId) => {
    alert(`Lease sent to applicant ${applicationId}. In production, this would trigger email with lease document.`);
  };

  const handleViewDetails = (applicationId) => {
    alert(`Viewing details for application ${applicationId}. In production, this would open a detailed view.`);
  };

  const stats = {
    totalApplications: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    pending: applications.filter(a => a.status === 'pending').length,
    denied: applications.filter(a => a.status === 'denied').length
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
          <span style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>{landlordEmail}</span>
          <button
            onClick={() => navigate('/landlord/properties')}
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
            Manage Properties
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
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            color: 'white',
            fontWeight: '700'
          }}>
            Dashboard
          </h2>
          <p style={{
            margin: 0,
            color: '#a0a0a0',
            fontSize: '0.875rem'
          }}>
            Manage your properties and tenant applications
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#16213e',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(233, 69, 96, 0.2)'
          }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Total Applications
            </div>
            <div style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>
              {stats.totalApplications}
            </div>
          </div>

          <div style={{
            backgroundColor: '#16213e',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(76, 175, 80, 0.2)'
          }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Approved
            </div>
            <div style={{ color: '#4caf50', fontSize: '2.5rem', fontWeight: '700' }}>
              {stats.approved}
            </div>
          </div>

          <div style={{
            backgroundColor: '#16213e',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 152, 0, 0.2)'
          }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Pending Review
            </div>
            <div style={{ color: '#ff9800', fontSize: '2.5rem', fontWeight: '700' }}>
              {stats.pending}
            </div>
          </div>

          <div style={{
            backgroundColor: '#16213e',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(244, 67, 54, 0.2)'
          }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Denied
            </div>
            <div style={{ color: '#f44336', fontSize: '2.5rem', fontWeight: '700' }}>
              {stats.denied}
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div style={{
          backgroundColor: '#16213e',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: '600'
            }}>
              Recent Applications
            </h3>
            <button
              onClick={() => navigate('/landlord/applications')}
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
              View All
            </button>
          </div>

          <div>
            {applications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application}
                onSendLease={handleSendLease}
                onViewDetails={handleViewDetails}
              />
            ))}
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
          © 2026 SwiftVerify - Landlord Portal
        </p>
      </footer>
    </div>
  );
};

export default LandlordDashboard;
