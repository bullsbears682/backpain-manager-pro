import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/Notification';
import Dashboard from './pages/Dashboard';
import PainTracking from './pages/PainTracking';
import Exercises from './pages/Exercises';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import Education from './pages/Education';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { initializeDefaultData } from './utils/storage';
import { CheckCircle, Heart, Activity, BarChart3, Sparkles, Zap } from 'lucide-react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loadingSteps = [
    { icon: CheckCircle, text: 'Initializing pain tracking system', delay: 0 },
    { icon: Activity, text: 'Loading exercise library', delay: 300 },
    { icon: Heart, text: 'Setting up medication management', delay: 600 },
    { icon: BarChart3, text: 'Preparing analytics dashboard', delay: 900 },
    { icon: Sparkles, text: 'Optimizing user experience', delay: 1200 },
    { icon: Zap, text: 'Finalizing setup', delay: 1500 }
  ];

  // Enhanced tab change with smooth transitions
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
      
      // Scroll to top on page change
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    // Initialize default data on first load
    try {
      initializeDefaultData();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
    
    // Enhanced loading simulation with realistic timing
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 25);

    return () => clearInterval(progressInterval);
  }, []);

  // Enhanced render component logic
  const renderActiveComponent = () => {
    const componentProps = {
      onNavigate: handleTabChange
    };

    const components = {
      dashboard: () => <Dashboard {...componentProps} />,
      'pain-tracking': () => <PainTracking {...componentProps} />,
      exercises: () => <Exercises {...componentProps} />,
      appointments: () => <Appointments {...componentProps} />,
      medications: () => <Medications {...componentProps} />,
      education: () => <Education {...componentProps} />,
      reports: () => <Reports {...componentProps} />,
      settings: () => <Settings {...componentProps} />
    };

    const renderComponent = components[activeTab] || components.dashboard;
    
    return (
      <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
        {renderComponent()}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-logo">
            <Activity className="loading-icon" />
            <h1>BackPain Manager Pro</h1>
            <p>Professional Pain Management System</p>
          </div>
          
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(loadingProgress)}%</span>
          </div>
          
          <div className="loading-steps">
            {loadingSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = loadingProgress > (index * 16.67);
              const isCompleted = loadingProgress > ((index + 1) * 16.67);
              
              return (
                <div 
                  key={index} 
                  className={`loading-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  style={{ animationDelay: `${step.delay}ms` }}
                >
                  <IconComponent className="step-icon" />
                  <span className="step-text">{step.text}</span>
                  {isCompleted && <CheckCircle className="check-icon" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="app">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
          <main className="main-content">
            <div className="content-wrapper">
              {renderActiveComponent()}
            </div>
          </main>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;