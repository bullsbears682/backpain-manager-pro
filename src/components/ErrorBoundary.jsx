import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isRetrying: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });
    
    // Clear error state after a brief delay
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        isRetrying: false 
      });
    }, 500);
  };

  handleGoHome = () => {
    // Clear error and redirect to home
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // If we have access to a navigation function, use it
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      // Fallback: reload the page
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem',
            padding: '3rem',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
            }}>
              <AlertTriangle size={40} color="white" />
            </div>

            {/* Error Message */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '1rem',
              letterSpacing: '-0.025em'
            }}>
              Oops! Something went wrong
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              We're sorry for the inconvenience. The application encountered an unexpected error, 
              but don't worry - your data is safe and we're here to help you get back on track.
            </p>

            {/* Error Details (Development Only) */}
            {isDevelopment && this.state.error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#dc2626',
                  marginBottom: '1rem'
                }}>
                  Error Details (Development Mode):
                </h3>
                <pre style={{
                  fontSize: '0.875rem',
                  color: '#7f1d1d',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  margin: 0,
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Help Information */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#0369a1',
                marginBottom: '0.5rem'
              }}>
                What you can do:
              </h3>
              <ul style={{
                fontSize: '0.875rem',
                color: '#0c4a6e',
                textAlign: 'left',
                paddingLeft: '1.5rem',
                margin: 0
              }}>
                <li>Try refreshing the page or retrying the action</li>
                <li>Check your internet connection</li>
                <li>Clear your browser cache and cookies</li>
                <li>Make sure you're using a supported browser</li>
                <li>Your pain tracking data is safely stored locally</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: this.state.isRetrying ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: this.state.isRetrying ? 0.7 : 1,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                <RefreshCw 
                  size={16} 
                  style={{ 
                    animation: this.state.isRetrying ? 'spin 1s linear infinite' : 'none' 
                  }} 
                />
                {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  background: 'white',
                  color: '#4b5563',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <Home size={16} />
                Go to Dashboard
              </button>
            </div>

            {/* Support Information */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(99, 102, 241, 0.05)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0 }}>
                If the problem persists, your data is safely stored in your browser. 
                You can export your data from Settings → Data Management.
              </p>
            </div>
          </div>

          {/* Keyframe animation for spinner */}
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;