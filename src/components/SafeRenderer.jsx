import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SafeRenderer = ({ children, fallback }) => {
  try {
    return children;
  } catch (error) {
    console.error('SafeRenderer caught error:', error);
    
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '3rem',
        border: '1px solid #ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }}>
        <AlertTriangle size={48} style={{ 
          opacity: 0.5, 
          marginBottom: '1rem',
          color: '#ef4444'
        }} />
        <h3 style={{ marginBottom: '0.5rem', color: '#ef4444' }}>
          Something went wrong
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Unable to render this section. Please refresh the page.
        </p>
      </div>
    );
  }
};

export default SafeRenderer;