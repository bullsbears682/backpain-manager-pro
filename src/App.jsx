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
import { 
  CheckCircle, 
  Heart, 
  Activity, 
  BarChart3, 
  Sparkles, 
  Zap, 
  X, 
  ArrowLeft, 
  Minimize2, 
  Plus, 
  Search,
  Bell,
  User,
  HelpCircle,
  Star,
  TrendingUp,
  Calendar,
  Pill,
  Menu,
  BookOpen,
  FileText
} from 'lucide-react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [isPageMinimized, setIsPageMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  const loadingSteps = [
    { icon: CheckCircle, text: 'Initializing pain tracking system', delay: 0 },
    { icon: Activity, text: 'Loading exercise library', delay: 300 },
    { icon: Heart, text: 'Setting up medication management', delay: 600 },
    { icon: BarChart3, text: 'Preparing analytics dashboard', delay: 900 },
    { icon: Sparkles, text: 'Optimizing user experience', delay: 1200 },
    { icon: Zap, text: 'Finalizing setup', delay: 1500 }
  ];

  // Quick actions for easy access
  const getQuickActions = () => [
    {
      id: 'log-pain',
      title: 'Log Pain',
      description: 'Quick pain entry',
      icon: TrendingUp,
      color: 'danger',
      action: () => handleTabChange('pain-tracking')
    },
    {
      id: 'start-exercise',
      title: 'Start Exercise',
      description: 'Begin workout',
      icon: Activity,
      color: 'success',
      action: () => handleTabChange('exercises')
    },
    {
      id: 'take-medication',
      title: 'Take Medication',
      description: 'Log medication',
      icon: Pill,
      color: 'info',
      action: () => handleTabChange('medications')
    },
    {
      id: 'schedule-appointment',
      title: 'Book Appointment',
      description: 'Schedule visit',
      icon: Calendar,
      color: 'warning',
      action: () => handleTabChange('appointments')
    }
  ];

  // Enhanced tab change with smooth transitions and breadcrumbs
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
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    }, 150);
  };

  // Enhanced back navigation
  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      
      setPageHistory(newHistory);
      setActiveTab(previousPage);
      setIsPageMinimized(false);
    }
  };

  // Page minimize/maximize
  const handleMinimize = () => {
    setIsPageMinimized(!isPageMinimized);
  };

  // Close page (go back to dashboard)
  const handleClose = () => {
    setActiveTab('dashboard');
    setPageHistory(['dashboard']);
    setIsPageMinimized(false);
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to minimize/close
      if (e.key === 'Escape') {
        if (isPageMinimized) {
          handleClose();
        } else {
          handleMinimize();
        }
      }
      
      // Alt + Backspace to go back
      if (e.altKey && e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
      
      // Ctrl/Cmd + M to toggle mobile menu
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
      }

      // Quick navigation shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            handleTabChange('dashboard');
            break;
          case '2':
            e.preventDefault();
            handleTabChange('pain-tracking');
            break;
          case '3':
            e.preventDefault();
            handleTabChange('exercises');
            break;
          case '4':
            e.preventDefault();
            handleTabChange('medications');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPageMinimized, isSidebarOpen, pageHistory]);

  // Initialize app data and simulate loading
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize default data
        await initializeDefaultData();
        
        // Simulate loading steps
        for (let i = 0; i < loadingSteps.length; i++) {
          setTimeout(() => {
            setLoadingProgress((i + 1) / loadingSteps.length * 100);
          }, loadingSteps[i].delay);
        }
        
        // Complete loading
        setTimeout(() => {
          setIsLoading(false);
          setQuickActions(getQuickActions());
        }, 1800);
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Get page title and breadcrumbs
  const getPageInfo = () => {
    const pages = {
      'dashboard': { title: 'Dashboard', icon: BarChart3, breadcrumb: 'Home' },
      'pain-tracking': { title: 'Pain Tracking', icon: TrendingUp, breadcrumb: 'Health > Pain' },
      'exercises': { title: 'Exercises', icon: Activity, breadcrumb: 'Health > Exercises' },
      'appointments': { title: 'Appointments', icon: Calendar, breadcrumb: 'Schedule > Appointments' },
      'medications': { title: 'Medications', icon: Pill, breadcrumb: 'Health > Medications' },
      'education': { title: 'Education', icon: BookOpen, breadcrumb: 'Resources > Education' },
      'reports': { title: 'Reports', icon: FileText, breadcrumb: 'Analytics > Reports' },
      'settings': { title: 'Settings', icon: Settings, breadcrumb: 'System > Settings' }
    };
    
    return pages[activeTab] || pages['dashboard'];
  };

  const renderPage = () => {
    const pageProps = {
      isMinimized: isPageMinimized,
      onQuickAction: handleTabChange
    };

    switch (activeTab) {
      case 'pain-tracking':
        return <PainTracking {...pageProps} />;
      case 'exercises':
        return <Exercises {...pageProps} />;
      case 'appointments':
        return <Appointments {...pageProps} />;
      case 'medications':
        return <Medications {...pageProps} />;
      case 'education':
        return <Education {...pageProps} />;
      case 'reports':
        return <Reports {...pageProps} />;
      case 'settings':
        return <Settings {...pageProps} />;
      default:
        return <Dashboard {...pageProps} quickActions={quickActions} />;
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-header">
            <Heart className="loading-logo" />
            <h1>BackPain Manager Pro</h1>
            <p>Professional Pain Management Solution</p>
          </div>
          
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(loadingProgress)}%</span>
          </div>
          
          <div className="loading-steps">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = loadingProgress >= ((index + 1) / loadingSteps.length * 100);
              const isCompleted = loadingProgress > ((index + 1) / loadingSteps.length * 100);
              
              return (
                <div 
                  key={index} 
                  className={`loading-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <StepIcon size={20} />
                  <span>{step.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="app">
          {/* Enhanced Header */}
          <header className="app-header">
            <div className="header-left">
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
              
              <div className="app-brand">
                <Heart className="brand-icon" />
                <span className="brand-text">BackPain Pro</span>
              </div>
            </div>

            <div className="header-center">
              <div className="search-container">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search pain logs, exercises, medications..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="header-right">
              <button className="header-action" aria-label="Help">
                <HelpCircle size={20} />
              </button>
              <button className="header-action notification-btn" aria-label="Notifications">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              <button className="header-action" aria-label="Profile">
                <User size={20} />
              </button>
            </div>
          </header>

          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className={`main-content ${isPageMinimized ? 'minimized' : ''}`}>
            {/* Enhanced Page Controls */}
            <div className="page-controls">
              <div className="page-info">
                <div className="breadcrumb">
                  <span className="breadcrumb-text">{pageInfo.breadcrumb}</span>
                </div>
                <div className="page-title">
                  <PageIcon className="page-icon" size={24} />
                  <h2>{pageInfo.title}</h2>
                  {activeTab !== 'dashboard' && (
                    <span className="page-badge">Active</span>
                  )}
                </div>
              </div>
              
              <div className="page-actions">
                {pageHistory.length > 1 && (
                  <button 
                    className="control-btn back-btn" 
                    onClick={handleBack}
                    title="Go back (Alt+Backspace)"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                
                <button 
                  className="control-btn minimize-btn" 
                  onClick={handleMinimize}
                  title={isPageMinimized ? "Maximize (Esc)" : "Minimize (Esc)"}
                >
                  <Minimize2 size={16} />
                </button>
                
                {activeTab !== 'dashboard' && (
                  <button 
                    className="control-btn close-btn" 
                    onClick={handleClose}
                    title="Close page"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Page Content */}
            <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
              {renderPage()}
            </div>
          </main>

          {/* Quick Actions FAB */}
          {activeTab === 'dashboard' && (
            <div className="floating-actions">
              <button 
                className="fab quick-pain"
                onClick={() => handleTabChange('pain-tracking')}
                title="Quick Pain Log"
              >
                <TrendingUp size={24} />
              </button>
              
              <button 
                className="fab quick-exercise"
                onClick={() => handleTabChange('exercises')}
                title="Start Exercise"
              >
                <Activity size={24} />
              </button>
            </div>
          )}

          {/* Keyboard Shortcuts Helper */}
          <div className="keyboard-shortcuts" title="Keyboard Shortcuts">
            <div className="shortcut-item">
              <kbd>Esc</kbd> <span>Minimize/Close</span>
            </div>
            <div className="shortcut-item">
              <kbd>Alt</kbd> + <kbd>⌫</kbd> <span>Back</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>1-4</kbd> <span>Quick Nav</span>
            </div>
          </div>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;