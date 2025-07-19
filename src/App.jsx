import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import PainTracking from './pages/PainTracking';
import Exercises from './pages/Exercises';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import Education from './pages/Education';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { initializeDefaultData } from './utils/storage';
import { CheckCircle, Heart, Activity, BarChart3 } from 'lucide-react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadingSteps = [
    { icon: CheckCircle, text: 'Initializing pain tracking system', delay: 0 },
    { icon: Activity, text: 'Loading exercise library', delay: 300 },
    { icon: Heart, text: 'Setting up medication management', delay: 600 },
    { icon: BarChart3, text: 'Preparing analytics dashboard', delay: 900 }
  ];

  useEffect(() => {
    // Initialize default data on first load
    try {
      initializeDefaultData();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  const renderActiveComponent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'pain-tracking':
          return <PainTracking />;
        case 'exercises':
          return <Exercises />;
        case 'appointments':
          return <Appointments />;
        case 'medications':
          return <Medications />;
        case 'education':
          return <Education />;
        case 'reports':
          return <Reports />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering component:', error);
      return <Dashboard />;
    }
  };

  const handleGoHome = () => {
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="app">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
          textAlign: 'center',
          padding: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Enhanced Loading Spinner */}
          <div style={{
            position: 'relative',
            marginBottom: '3rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              border: '6px solid rgba(255, 255, 255, 0.1)',
              borderTop: '6px solid white',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite',
              position: 'relative'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              borderBottom: '4px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              animation: 'spin 2s linear infinite reverse'
            }} />
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff, #f0f8ff, #e6f3ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(255, 255, 255, 0.3)'
          }}>
            BackPain Manager Pro
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            marginBottom: '3rem',
            fontWeight: '500',
            maxWidth: '500px',
            lineHeight: '1.6'
          }}>
            Professional Back Pain Management System
          </p>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            maxWidth: '400px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            marginBottom: '3rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
              borderRadius: '3px',
              width: `${loadingProgress}%`,
              transition: 'width 0.3s ease',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }} />
          </div>
          
          {/* Enhanced Loading Steps */}
          <div style={{
            display: 'grid',
            gap: '1rem',
            fontSize: '0.95rem',
            opacity: 0.9,
            maxWidth: '500px',
            width: '100%'
          }}>
            {loadingSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = loadingProgress > (index + 1) * 25;
              const isAnimating = loadingProgress > index * 25 && loadingProgress <= (index + 1) * 25;
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    background: isActive 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : isAnimating 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isActive ? '0 8px 32px rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                >
                  <IconComponent 
                    size={20} 
                    style={{
                      color: isActive ? '#60f472' : isAnimating ? '#60a5fa' : 'rgba(255, 255, 255, 0.6)',
                      transition: 'color 0.3s ease'
                    }}
                  />
                  <span style={{
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.3s ease'
                  }}>
                    {step.text}
                  </span>
                  {isActive && (
                    <CheckCircle 
                      size={16} 
                      style={{
                        marginLeft: 'auto',
                        color: '#60f472'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Enhanced Badge */}
          <div style={{
            marginTop: '4rem',
            padding: '1.25rem 2.5rem',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '2rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)'
          }}>
            🏥 Professional-grade healthcare software
          </div>

          {/* Loading percentage */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            fontSize: '0.875rem',
            opacity: 0.7,
            fontWeight: '500'
          }}>
            Loading... {Math.round(loadingProgress)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary onGoHome={handleGoHome}>
      <div className="app">
        <div className="app-container">
          <ErrorBoundary>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </ErrorBoundary>
          <main className="main-content">
            <ErrorBoundary>
              {renderActiveComponent()}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;