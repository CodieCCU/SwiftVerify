import React, { useRef, useState, useEffect } from 'react';

const ESignaturePad = ({ onSave, applicantName }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [useTypedSignature, setUseTypedSignature] = useState(false);
  const [typedName, setTypedName] = useState(applicantName || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    setIsDrawing(true);
    ctx.beginPath();
    
    const x = e.type.includes('touch') ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.type.includes('touch') ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const x = e.type.includes('touch') ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.type.includes('touch') ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    if (useTypedSignature && typedName) {
      // Generate typed signature
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '48px "Brush Script MT", cursive';
      ctx.fillStyle = '#000';
      ctx.fillText(typedName, 20, 80);
    }
    
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.25rem',
        color: '#333'
      }}>
        Sign Lease Agreement
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setUseTypedSignature(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: !useTypedSignature ? '#1976d2' : 'white',
              color: !useTypedSignature ? 'white' : '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Draw Signature
          </button>
          <button
            onClick={() => setUseTypedSignature(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: useTypedSignature ? '#1976d2' : 'white',
              color: useTypedSignature ? 'white' : '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Type Signature
          </button>
        </div>

        {useTypedSignature ? (
          <div>
            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value);
                setHasSignature(e.target.value.length > 0);
              }}
              placeholder="Type your full name"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.5rem',
                fontFamily: '"Brush Script MT", cursive',
                border: '2px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={600}
            height={150}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              border: '2px solid #ddd',
              borderRadius: '6px',
              cursor: 'crosshair',
              width: '100%',
              height: '150px',
              backgroundColor: '#fafafa'
            }}
          />
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          onClick={clearSignature}
          disabled={!hasSignature}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: 'white',
            color: '#666',
            border: '2px solid #ddd',
            borderRadius: '6px',
            cursor: hasSignature ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            opacity: hasSignature ? 1 : 0.5
          }}
        >
          Clear
        </button>
        <button
          onClick={saveSignature}
          disabled={!hasSignature}
          style={{
            flex: 2,
            padding: '0.75rem',
            backgroundColor: hasSignature ? '#4caf50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: hasSignature ? 'pointer' : 'not-allowed',
            fontWeight: '600'
          }}
        >
          Save Signature & Complete
        </button>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#fff3e0',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#e65100'
      }}>
        <strong>Legal Notice:</strong> By signing this document electronically, you agree that your electronic signature is legally binding and equivalent to a handwritten signature.
      </div>
    </div>
  );
};

export default ESignaturePad;
