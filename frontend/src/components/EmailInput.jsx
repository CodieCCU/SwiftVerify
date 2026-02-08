import React, { useState } from 'react';
import { validateEmail } from '../utils/validators';

/**
 * Validated email input component
 */
const EmailInput = ({ value, onChange, required = true }) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email address');
    } else if (required && !value) {
      setError('Email is required');
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    onChange(e);
    if (touched && error) {
      setError('');
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        color: '#555',
        fontWeight: '500',
      }}>
        Email Address {required && '*'}
      </label>
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        placeholder="your.email@example.com"
        style={{
          width: '100%',
          padding: '0.75rem',
          border: error ? '2px solid #f44336' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <div style={{ 
          color: '#f44336', 
          marginTop: '0.25rem',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}
      <div style={{ 
        color: '#666', 
        marginTop: '0.25rem',
        fontSize: '0.875rem',
      }}>
        We'll use this email to send you verification updates
      </div>
    </div>
  );
};

export default EmailInput;
