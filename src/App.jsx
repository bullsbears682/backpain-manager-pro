import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PainTracking from './pages/PainTracking';
import Exercises from './pages/Exercises';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import Education from './pages/Education';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { initializeDefaultData } from './utils/storage';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default data on first load
    initializeDefaultData();
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const renderActiveComponent = () => {
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
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '2rem'
          }} />
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #fff, #f0f8ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            BackPain Manager Pro
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            marginBottom: '2rem'
          }}>
            Professional Back Pain Management System
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            <div>✅ Initializing pain tracking system</div>
            <div>✅ Loading exercise library</div>
            <div>✅ Setting up medication management</div>
            <div>✅ Preparing analytics dashboard</div>
          </div>
          
          <div style={{
            marginTop: '3rem',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2rem',
            fontSize: '0.9rem'
          }}>
            🏥 Professional-grade healthcare software
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-container">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default App;