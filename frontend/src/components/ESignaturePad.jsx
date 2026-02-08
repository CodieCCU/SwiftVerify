import React, { useRef, useState } from 'react';

/**
 * E-Signature pad component for signing documents
 */
const ESignaturePad = ({ onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onClear) onClear();
  };

  const saveSignature = () => {
    if (isEmpty) {
      alert('Please provide your signature first');
      return;
    }
    
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    if (onSave) onSave(signatureData);
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
    }}>
      <h4 style={{ marginTop: 0, color: '#333', fontSize: '1.1rem' }}>
        Sign Below
      </h4>
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #1976d2',
        borderRadius: '4px',
        marginBottom: '1rem',
        position: 'relative',
      }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          style={{
            display: 'block',
            width: '100%',
            cursor: 'crosshair',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '1rem',
          color: '#999',
          fontSize: '0.875rem',
          pointerEvents: 'none',
        }}>
          {isEmpty && 'Sign here with your mouse or touch screen'}
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '1rem',
      }}>
        <button
          type="button"
          onClick={clearSignature}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#f44336',
            border: '2px solid #f44336',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={saveSignature}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default ESignaturePad;
