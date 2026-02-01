import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SwiftVerify</h1>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Back
        </button>
      </nav>

      <div style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            marginBottom: '1rem', 
            color: '#333',
            fontSize: '2rem'
          }}>
            Privacy Policy
          </h1>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          {/* SSN Non-Storage Section - Prominently Featured */}
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #1976d2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              marginTop: 0,
              marginBottom: '1rem',
              color: '#1976d2',
              fontSize: '1.5rem'
            }}>
              Social Security Number (SSN) Policy
            </h2>
            <p style={{ 
              color: '#333',
              lineHeight: '1.6',
              marginBottom: '0.75rem',
              fontSize: '1rem'
            }}>
              <strong>SwiftVerify does NOT store Social Security Numbers (SSNs) in any form.</strong>
            </p>
            <p style={{ 
              color: '#333',
              lineHeight: '1.6',
              marginBottom: '0.75rem'
            }}>
              We maintain absolute transparency and compliance by ensuring that:
            </p>
            <ul style={{ 
              color: '#333',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '0.75rem'
            }}>
              <li>SSNs are <strong>never stored in plaintext</strong> on our servers</li>
              <li>SSNs are <strong>never stored in encrypted form</strong> on our servers</li>
              <li>SSNs are <strong>never stored as secure hashes</strong> on our servers</li>
              <li>SSNs are <strong>never stored in any equivalent form</strong> on our servers</li>
            </ul>
            <p style={{ 
              color: '#333',
              lineHeight: '1.6',
              marginBottom: 0
            }}>
              This policy applies to all users including Tenants, Landlords, and Property Managers.
              If SSN information is required for verification purposes, it is processed in real-time
              through secure third-party verification services and is not retained by SwiftVerify.
            </p>
          </div>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Information We Collect
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            We collect information necessary to provide our verification services, including:
          </p>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Email addresses</li>
            <li>Driver's license information (for verification purposes only)</li>
            <li>Account credentials (encrypted)</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            How We Use Your Information
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your information is used exclusively for:
          </p>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Identity verification services</li>
            <li>Account management and authentication</li>
            <li>Communication regarding verification status</li>
            <li>Compliance with legal requirements</li>
            <li>Service improvement and analytics</li>
          </ul>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Data Security
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            We employ industry-standard security measures to protect your data:
          </p>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>End-to-end encryption for data transmission</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security audits and updates</li>
            <li>Minimal data retention policies</li>
          </ul>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Third-Party Services
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            We may use trusted third-party services for verification purposes. These services
            are carefully vetted and comply with strict privacy and security standards. Any
            sensitive information processed by third parties is handled in accordance with
            applicable regulations and is not stored by SwiftVerify.
          </p>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Your Rights
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            You have the right to:
          </p>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of certain data collection practices</li>
            <li>Receive a copy of your data</li>
          </ul>

          <h2 style={{ 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Contact Us
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            If you have questions or concerns about our privacy practices, please contact us at:
          </p>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            Email: <a href="mailto:privacy@swiftverify.com" style={{ color: '#1976d2' }}>privacy@swiftverify.com</a>
          </p>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Support: <a href="mailto:support@swiftverify.com" style={{ color: '#1976d2' }}>support@swiftverify.com</a>
          </p>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            <strong>Note:</strong> This privacy policy may be updated periodically. 
            We will notify users of significant changes via email or through our platform.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
