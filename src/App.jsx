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
import { CheckCircle, Heart, Activity, BarChart3, Sparkles, Zap, X, ArrowLeft, Minimize2, Plus, Zap as Lightning } from 'lucide-react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [isPageMinimized, setIsPageMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    
    // Add to page history for back navigation
    setPageHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== tabId) {
        newHistory.push(tabId);
      }
      return newHistory.slice(-10); // Keep last 10 pages
    });
    
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
      setIsPageMinimized(false);
      
      // Scroll to top on page change
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      handleTabChange(previousPage);
    } else {
      handleTabChange('dashboard');
    }
  };

  // Handle page close (minimize)
  const handlePageClose = () => {
    setIsPageMinimized(true);
    setTimeout(() => {
      handleTabChange('dashboard');
    }, 300);
  };

  // Handle page minimize toggle
  const handlePageMinimize = () => {
    setIsPageMinimized(!isPageMinimized);
  };

  // Handle sidebar toggle for mobile
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper functions for page titles
  const getPageTitle = (tabId) => {
    const titles = {
      'pain-tracking': 'Pain Tracking',
      'exercises': 'Exercise Library',
      'medications': 'Medication Manager',
      'appointments': 'Appointments',
      'education': 'Education Center',
      'reports': 'Health Reports',
      'settings': 'Settings'
    };
    return titles[tabId] || 'Dashboard';
  };

  const getPageSubtitle = (tabId) => {
    const subtitles = {
      'pain-tracking': 'Monitor your daily pain levels',
      'exercises': 'Guided routines for pain relief',
      'medications': 'Track your medication schedule',
      'appointments': 'Manage healthcare visits',
      'education': 'Learn about pain management',
      'reports': 'View your progress analytics',
      'settings': 'Customize your experience'
    };
    return subtitles[tabId] || '';
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // ESC to close/minimize page
      if (event.key === 'Escape') {
        if (activeTab !== 'dashboard') {
          if (isPageMinimized) {
            handlePageClose();
          } else {
            handlePageMinimize();
          }
        }
      }
      
      // Alt + Backspace for back navigation
      if (event.altKey && event.key === 'Backspace') {
        event.preventDefault();
        handleBackNavigation();
      }
      
      // Ctrl/Cmd + M to toggle mobile menu
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault();
        handleSidebarToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isPageMinimized]);

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
            isOpen={isSidebarOpen}
            onToggle={handleSidebarToggle}
          />
          <main className={`main-content ${isPageMinimized ? 'minimized' : ''}`}>
            {/* Infinex-style Page Controls */}
            {activeTab !== 'dashboard' && (
              <div className="page-controls">
                <div className="page-controls-left">
                  <button 
                    className="control-btn back-btn"
                    onClick={handleBackNavigation}
                    title="Go Back"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="page-title">
                    <h2>{getPageTitle(activeTab)}</h2>
                    <span className="page-subtitle">{getPageSubtitle(activeTab)}</span>
                  </div>
                </div>
                <div className="page-controls-right">
                  <button 
                    className="control-btn minimize-btn"
                    onClick={handlePageMinimize}
                    title={isPageMinimized ? "Expand" : "Minimize"}
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button 
                    className="control-btn close-btn"
                    onClick={handlePageClose}
                    title="Close Page"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
            
            <div className={`content-wrapper ${isPageMinimized ? 'minimized' : ''}`}>
              {renderActiveComponent()}
            </div>
            
            {/* Floating Action Buttons */}
            {activeTab === 'dashboard' && (
              <div className="floating-actions">
                <button 
                  className="fab quick-pain"
                  onClick={() => handleTabChange('pain-tracking')}
                  title="Quick Pain Log"
                >
                  <Lightning size={20} />
                </button>
                <button 
                  className="fab quick-exercise"
                  onClick={() => handleTabChange('exercises')}
                  title="Start Exercise"
                >
                  <Activity size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;