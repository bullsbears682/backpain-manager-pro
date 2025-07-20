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
  FileText,
  Brain,
  Target,
  Lightbulb,
  AlertCircle,
  TrendingDown,
  Shield,
  Clock
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
  const [smartInsights, setSmartInsights] = useState([]);
  const [healthScore, setHealthScore] = useState(85);
  const [dailyGoals, setDailyGoals] = useState({
    painLog: { completed: false, target: 1 },
    exercise: { completed: false, target: 20 }, // minutes
    medication: { completed: true, target: 1 },
    sleep: { completed: true, target: 8 } // hours
  });

  // Smart insights generation (Apple Health/Notion AI style)
  const generateSmartInsights = () => {
    const insights = [
      {
        id: 1,
        type: 'trend',
        icon: TrendingDown,
        title: 'Pain levels decreasing',
        description: 'Your average pain has reduced by 15% this week. Keep up the great work!',
        priority: 'high',
        color: 'green',
        action: 'View detailed report',
        actionTab: 'reports'
      },
      {
        id: 2,
        type: 'suggestion',
        icon: Lightbulb,
        title: 'Exercise reminder',
        description: 'You haven\'t done your back exercises today. 10 minutes now could prevent tomorrow\'s pain.',
        priority: 'medium',
        color: 'blue',
        action: 'Start exercises',
        actionTab: 'exercises'
      },
      {
        id: 3,
        type: 'achievement',
        icon: Target,
        title: 'Weekly streak!',
        description: 'You\'ve logged pain consistently for 7 days. This helps identify patterns.',
        priority: 'low',
        color: 'purple',
        action: 'View patterns',
        actionTab: 'reports'
      },
      {
        id: 4,
        type: 'alert',
        icon: AlertCircle,
        title: 'Medication due',
        description: 'Your evening medication is due in 30 minutes.',
        priority: 'high',
        color: 'orange',
        action: 'Mark as taken',
        actionTab: 'medications'
      }
    ];
    
    setSmartInsights(insights.slice(0, 3)); // Show top 3 insights
  };

  // Calculate health score (Apple Health style)
  const calculateHealthScore = () => {
    const completedGoals = Object.values(dailyGoals).filter(goal => goal.completed).length;
    const totalGoals = Object.keys(dailyGoals).length;
    const baseScore = (completedGoals / totalGoals) * 100;
    
    // Add bonus points for consistency, trends, etc.
    const bonusPoints = Math.random() * 10; // Simulate trend analysis
    const finalScore = Math.min(100, Math.round(baseScore + bonusPoints));
    
    setHealthScore(finalScore);
  };

  // Enhanced loading with realistic progress steps
  useEffect(() => {
    const loadingSteps = [
      { progress: 10, message: 'Initializing health data...' },
      { progress: 25, message: 'Loading pain history...' },
      { progress: 45, message: 'Analyzing patterns...' },
      { progress: 65, message: 'Preparing insights...' },
      { progress: 80, message: 'Setting up personalized dashboard...' },
      { progress: 95, message: 'Almost ready...' },
      { progress: 100, message: 'Welcome back!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          initializeDefaultData();
          generateSmartInsights();
          calculateHealthScore();
          
          // Initialize notifications with smart suggestions
          setNotifications([
            { id: 1, type: 'insight', message: 'New health insights available', time: '2m ago' },
            { id: 2, type: 'reminder', message: 'Time for your afternoon stretch', time: '1h ago' }
          ]);

          // Set up quick actions based on user patterns
          setQuickActions([
            { id: 1, label: 'Log Pain', icon: Heart, tab: 'pain-tracking', color: 'red' },
            { id: 2, label: 'Quick Exercise', icon: Activity, tab: 'exercises', color: 'blue' },
            { id: 3, label: 'Take Medication', icon: Pill, tab: 'medications', color: 'green' },
            { id: 4, label: 'Book Appointment', icon: Calendar, tab: 'appointments', color: 'purple' }
          ]);
        }, 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Enhanced tab switching with smooth transitions
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setPageHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1] !== tab) {
          newHistory.push(tab);
        }
        return newHistory.slice(-10); // Keep last 10 pages
      });
      setIsTransitioning(false);
    }, 150);
  };

  // Smart search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real app, this would search across all data
    if (query.toLowerCase().includes('pain')) {
      handleTabChange('pain-tracking');
    } else if (query.toLowerCase().includes('exercise')) {
      handleTabChange('exercises');
    } else if (query.toLowerCase().includes('appointment')) {
      handleTabChange('appointments');
    }
  };

  // Handle keyboard shortcuts (Linear/Notion style)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
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
          case 'k':
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
            break;
        }
      }
      
      if (e.key === 'Escape') {
        if (isPageMinimized) {
          setIsPageMinimized(false);
        } else {
          setIsPageMinimized(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPageMinimized]);

  // Handle back navigation
  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setActiveTab(previousPage);
    }
  };

  // Handle quick action clicks
  const handleQuickAction = (action) => {
    handleTabChange(action.tab);
    
    // Add haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Handle insight actions
  const handleInsightAction = (insight) => {
    if (insight.actionTab) {
      handleTabChange(insight.actionTab);
    }
    
    // Remove insight after action
    setSmartInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  // Loading screen with modern design
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-logo">
            <div className="logo-icon">
              <Heart className="heart-icon" />
            </div>
            <h1>BackPain Pro</h1>
            <p>AI-Powered Pain Management</p>
          </div>
          
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="progress-text">{loadingProgress}%</p>
          </div>
          
          <div className="loading-steps">
            <div className={`step ${loadingProgress >= 25 ? 'completed' : 'active'}`}>
              <CheckCircle className="step-icon" />
              <span>Analyzing your health data</span>
            </div>
            <div className={`step ${loadingProgress >= 65 ? 'completed' : loadingProgress >= 25 ? 'active' : ''}`}>
              <Brain className="step-icon" />
              <span>Generating personalized insights</span>
            </div>
            <div className={`step ${loadingProgress >= 100 ? 'completed' : loadingProgress >= 65 ? 'active' : ''}`}>
              <Sparkles className="step-icon" />
              <span>Setting up your dashboard</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tab configuration with enhanced metadata
  const tabs = {
    dashboard: { 
      component: Dashboard, 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Your health overview',
      color: 'blue'
    },
    'pain-tracking': { 
      component: PainTracking, 
      label: 'Pain Tracking', 
      icon: Heart,
      description: 'Log and monitor pain levels',
      color: 'red'
    },
    exercises: { 
      component: Exercises, 
      label: 'Exercises', 
      icon: Activity,
      description: 'Therapeutic exercises',
      color: 'green'
    },
    appointments: { 
      component: Appointments, 
      label: 'Appointments', 
      icon: Calendar,
      description: 'Medical appointments',
      color: 'purple'
    },
    medications: { 
      component: Medications, 
      label: 'Medications', 
      icon: Pill,
      description: 'Medication management',
      color: 'orange'
    },
    education: { 
      component: Education, 
      label: 'Education', 
      icon: BookOpen,
      description: 'Learn about back health',
      color: 'indigo'
    },
    reports: { 
      component: Reports, 
      label: 'Reports', 
      icon: FileText,
      description: 'Detailed health reports',
      color: 'teal'
    },
    settings: { 
      component: Settings, 
      label: 'Settings', 
      icon: Star,
      description: 'App preferences',
      color: 'gray'
    }
  };

  const currentTab = tabs[activeTab];
  const CurrentComponent = currentTab.component;

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="app">
          {/* Enhanced Header with Apple Health style */}
          <header className="app-header">
            <div className="header-left">
              <button 
                className="sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu />
              </button>
              <div className="app-title">
                <Heart className="app-icon" />
                <span>BackPain Pro</span>
              </div>
            </div>
            
            <div className="header-center">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search health data, exercises, insights..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="search-shortcut">⌘K</div>
              </div>
            </div>
            
            <div className="header-right">
              <div className="health-score">
                <Shield className="score-icon" />
                <span className="score-value">{healthScore}</span>
                <span className="score-label">Health Score</span>
              </div>
              
              <button className="notification-btn">
                <Bell />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
              
              <button className="profile-btn">
                <User />
              </button>
              
              <button className="help-btn">
                <HelpCircle />
              </button>
            </div>
          </header>

          <div className="app-body">
            {/* Enhanced Sidebar */}
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabs={tabs}
            />

            {/* Main Content Area */}
            <main className="main-content">
              {/* Smart Insights Panel (Notion AI style) */}
              {smartInsights.length > 0 && (
                <div className="insights-panel">
                  <div className="insights-header">
                    <Brain className="insights-icon" />
                    <h3>Smart Insights</h3>
                    <span className="insights-count">{smartInsights.length}</span>
                  </div>
                  
                  <div className="insights-list">
                    {smartInsights.map(insight => (
                      <div 
                        key={insight.id} 
                        className={`insight-card ${insight.priority} ${insight.color}`}
                        onClick={() => handleInsightAction(insight)}
                      >
                        <div className="insight-icon">
                          <insight.icon />
                        </div>
                        <div className="insight-content">
                          <h4>{insight.title}</h4>
                          <p>{insight.description}</p>
                          <button className="insight-action">
                            {insight.action}
                          </button>
                        </div>
                        <button 
                          className="insight-dismiss"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSmartInsights(prev => prev.filter(i => i.id !== insight.id));
                          }}
                        >
                          <X />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Controls with breadcrumbs */}
              <div className="page-controls">
                <div className="breadcrumbs">
                  <span className="breadcrumb">Home</span>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb active">{currentTab.label}</span>
                </div>
                
                <div className="page-actions">
                  {pageHistory.length > 1 && (
                    <button 
                      className="control-btn back-btn"
                      onClick={handleBack}
                      title="Go back"
                    >
                      <ArrowLeft />
                    </button>
                  )}
                  
                  <div className="page-info">
                    <currentTab.icon className="page-icon" />
                    <div className="page-details">
                      <h2>{currentTab.label}</h2>
                      <p>{currentTab.description}</p>
                    </div>
                  </div>
                  
                  <div className="page-controls-right">
                    <button 
                      className="control-btn minimize-btn"
                      onClick={() => setIsPageMinimized(!isPageMinimized)}
                      title="Minimize page (Esc)"
                    >
                      <Minimize2 />
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Goals Progress (Apple Health style) */}
              <div className="daily-goals">
                <h3>Today's Goals</h3>
                <div className="goals-grid">
                  {Object.entries(dailyGoals).map(([key, goal]) => (
                    <div key={key} className={`goal-card ${goal.completed ? 'completed' : ''}`}>
                      <div className="goal-icon">
                        {key === 'painLog' && <Heart />}
                        {key === 'exercise' && <Activity />}
                        {key === 'medication' && <Pill />}
                        {key === 'sleep' && <Clock />}
                      </div>
                      <div className="goal-info">
                        <span className="goal-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="goal-status">
                          {goal.completed ? '✓ Complete' : `Target: ${goal.target}${key === 'exercise' || key === 'sleep' ? 'h' : ''}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Content */}
              <div className={`page-content ${isPageMinimized ? 'minimized' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
                <CurrentComponent />
              </div>

              {/* Quick Actions FAB (Notion style) */}
              <div className="quick-actions-fab">
                <div className="fab-main">
                  <Plus />
                </div>
                
                <div className="fab-actions">
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      className={`fab-action ${action.color}`}
                      onClick={() => handleQuickAction(action)}
                      title={action.label}
                    >
                      <action.icon />
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts Helper */}
              <div className="keyboard-shortcuts">
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>1-3</kbd> <span>Switch pages</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>K</kbd> <span>Search</span>
                </div>
                <div className="shortcut">
                  <kbd>Esc</kbd> <span>Minimize</span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;