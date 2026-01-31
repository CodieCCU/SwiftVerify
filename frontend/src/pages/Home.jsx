import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import Navbar from '../components/Navbar';
import { Card, FCRANotice } from '../components/UIComponents';

const Home = () => {
  const { user } = useAuth();

  const verificationSteps = [
    {
      title: 'Driver\'s License Verification',
      description: 'Verify your identity with your driver\'s license',
      link: '/driver-license',
      icon: '🪪',
      status: 'pending'
    },
    {
      title: 'Employment & Income',
      description: 'Submit employment details and verify income',
      link: '/employment',
      icon: '💼',
      status: 'pending'
    },
    {
      title: 'Background Check',
      description: 'Complete criminal and background verification',
      link: '/background-check',
      icon: '🔍',
      status: 'pending'
    },
    {
      title: 'Application Approval',
      description: 'Review and sign your rental agreement',
      link: '/approval',
      icon: '✅',
      status: 'pending'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container">
          <Card>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Welcome, {user?.name || 'Tenant'}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              Complete your rental verification to get fast approval for your new home.
            </p>
          </Card>

          <FCRANotice />

          <Card title="Your Verification Journey">
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Follow these steps to complete your rental application. Each step is designed to be quick and secure.
            </p>

            <div className="grid grid-2">
              {verificationSteps.map((step, index) => (
                <Link 
                  key={index} 
                  to={step.link}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      border: '2px solid var(--border-color)',
                      transition: 'all 0.3s',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      {step.icon}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {step.description}
                    </p>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor: '#FEF3C7',
                      color: '#92400E'
                    }}>
                      {step.status === 'pending' ? 'Not Started' : step.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card title="Why SwiftVerify?">
            <div className="grid grid-3">
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>⚡ Fast Processing</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Get approved in minutes, not days
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>🔒 Secure & Private</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Bank-level encryption for your data
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>✓ FCRA Compliant</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Fully compliant with federal regulations
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
