import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { logPageView, logUserAction, logDriversLicenseCheck, logFormSubmit, logAuthentication } from '../services/logger';

const DriversLicense = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [scanNotification, setScanNotification] = useState('');
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'scan'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log page view
    logPageView('drivers_license', { user: user?.username });
  }, [user]);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      logUserAction('email_validation_failed', { reason: 'Invalid format' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      logDriversLicenseCheck('form_validation_failed', { reason: 'Invalid email' });
      return;
    }

    if (inputMethod === 'manual' && !licenseNumber) {
      setLicenseError('Please enter your driver\'s license number');
      logDriversLicenseCheck('form_validation_failed', { reason: 'Missing license number' });
      return;
    }

    // Log form submission (with sanitized data)
    logFormSubmit('drivers_license_form', {
      email,
      inputMethod,
      hasLicenseNumber: !!licenseNumber,
    });

    // Log driver's license check initiation
    logDriversLicenseCheck('verification_initiated', {
      email,
      inputMethod,
      user: user?.username,
    });

    // Navigate to verification processing screen
    navigate('/verification-processing', {
      state: {
        email,
        licenseNumber,
        inputMethod
      }
    });
  };

  const handleLogout = () => {
    logAuthentication('logout', { user: user?.username, page: 'drivers_license' });
    logout();
    navigate('/login');
  };

  const handleScanLicense = () => {
    // Simulated scan - in production this would integrate with camera/scanner
    setInputMethod('scan');
    logUserAction('scan_license_clicked', { user: user?.username });
    setScanNotification('Camera/Scanner integration is not yet available. Please use manual entry.');
    setTimeout(() => {
      setScanNotification('');
      setInputMethod('manual');
    }, 3000);
  };

  const handleLicenseNumberChange = (e) => {
    setLicenseNumber(e.target.value);
    logUserAction('license_number_input', { length: e.target.value.length });
    if (licenseError) {
      setLicenseError('');
    }
  };

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
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.username}</span>
          <button
            onClick={handleLogout}
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
            Logout
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
            Driver's License Verification
          </h2>
          
          {scanNotification && (
            <div style={{
              backgroundColor: '#fff3e0',
              color: '#e65100',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {scanNotification}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Email Field - Added as per requirements */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: emailError ? '2px solid #d32f2f' : '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                required
                placeholder="your.email@example.com"
              />
              {emailError && (
                <div style={{ 
                  color: '#d32f2f', 
                  marginTop: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  {emailError}
                </div>
              )}
              <div style={{ 
                color: '#666', 
                marginTop: '0.25rem',
                fontSize: '0.875rem'
              }}>
                We'll use this email to send you verification updates
              </div>
            </div>

            {/* Driver's License Input Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#555',
                fontWeight: '500'
              }}>
                Driver's License *
              </label>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMethod('manual');
                      logUserAction('manual_entry_selected', { user: user?.username });
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: inputMethod === 'manual' ? '#1976d2' : 'white',
                      color: inputMethod === 'manual' ? 'white' : '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Manual Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMethod('scan');
                      handleScanLicense();
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: inputMethod === 'scan' ? '#1976d2' : 'white',
                      color: inputMethod === 'scan' ? 'white' : '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Scan License
                  </button>
                </div>
              </div>

              {inputMethod === 'manual' && (
                <>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={handleLicenseNumberChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: licenseError ? '2px solid #d32f2f' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your driver's license number"
                    required
                  />
                  {licenseError && (
                    <div style={{ 
                      color: '#d32f2f', 
                      marginTop: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      {licenseError}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Submit for Verification
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#1976d2'
          }}>
            <strong>Privacy Notice:</strong> Your information is encrypted and securely processed 
            according to industry standards.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversLicense;
