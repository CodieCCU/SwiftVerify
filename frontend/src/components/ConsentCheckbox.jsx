import React from 'react';

/**
 * Reusable consent checkbox component
 */
const ConsentCheckbox = ({ id, label, checked, onChange, required = true }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label 
        htmlFor={id}
        style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          cursor: 'pointer',
          padding: '0.75rem',
          backgroundColor: checked ? '#e8f5e9' : '#ffffff',
          border: checked ? '2px solid #4caf50' : '1px solid #e0e0e0',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          required={required}
          style={{
            marginTop: '0.25rem',
            marginRight: '0.75rem',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <span style={{ 
          fontSize: '1rem', 
          lineHeight: '1.5', 
          color: '#333',
          fontWeight: checked ? '500' : '400',
        }}>
          {label}
        </span>
      </label>
    </div>
  );
};

export default ConsentCheckbox;
