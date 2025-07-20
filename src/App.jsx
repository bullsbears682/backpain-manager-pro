import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Trophy,
  Flame,
  Award,
  Gift,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import './App.css';

// Duolingo-inspired Sound Manager
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.isEnabled = localStorage.getItem('soundsEnabled') !== 'false';
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Generate exercise sounds using Web Audio API
  createTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Duolingo-style success sounds
  playSuccess() {
    this.createTone(523.25, 0.2); // C5
    setTimeout(() => this.createTone(659.25, 0.2), 100); // E5
    setTimeout(() => this.createTone(783.99, 0.3), 200); // G5
  }

  playExerciseStart() {
    this.createTone(440, 0.3, 'triangle'); // A4
    setTimeout(() => this.createTone(554.37, 0.3, 'triangle'), 150); // C#5
  }

  playExerciseComplete() {
    // Triumphant chord progression
    this.createTone(261.63, 0.4); // C4
    this.createTone(329.63, 0.4); // E4
    this.createTone(392.00, 0.4); // G4
    setTimeout(() => this.createTone(523.25, 0.6), 200); // C5
  }

  playStreakSound() {
    // Fire sound effect
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(200 + Math.random() * 300, 0.1, 'sawtooth');
      }, i * 50);
    }
  }

  playLevelUp() {
    // Ascending scale
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.2), i * 100);
    });
  }

  playCorrectAnswer() {
    this.createTone(659.25, 0.2); // E5
    setTimeout(() => this.createTone(783.99, 0.2), 100); // G5
  }

  playWrongAnswer() {
    this.createTone(146.83, 0.4, 'sawtooth'); // D3 - low and dissonant
  }

  playNotification() {
    this.createTone(440, 0.15); // A4
    setTimeout(() => this.createTone(523.25, 0.15), 200); // C5
  }

  playBreathing(inhale = true) {
    if (inhale) {
      // Ascending tone for inhale
      const oscillator = this.audioContext?.createOscillator();
      const gainNode = this.audioContext?.createGain();
      
      if (oscillator && gainNode) {
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 2);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + 1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2);
      }
    } else {
      // Descending tone for exhale
      const oscillator = this.audioContext?.createOscillator();
      const gainNode = this.audioContext?.createGain();
      
      if (oscillator && gainNode) {
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 3);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 3);
      }
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('soundsEnabled', this.isEnabled);
  }
}

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

  // Duolingo-inspired state
  const [userStats, setUserStats] = useState({
    streak: 3,
    totalXP: 150,
    level: 2,
    achievements: [],
    dailyGoalCompleted: false,
    exercisesCompleted: 5,
    painLogsToday: 1
  });
  const [showAchievement, setShowAchievement] = useState(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const soundManager = useRef(new SoundManager());

  // Duolingo-inspired gamification functions
  const addXP = (amount, reason) => {
    setUserStats(prev => {
      const newXP = prev.totalXP + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      if (newLevel > prev.level) {
        setShowLevelUp(true);
        soundManager.current.playLevelUp();
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      return {
        ...prev,
        totalXP: newXP,
        level: newLevel
      };
    });
    
    soundManager.current.playSuccess();
    showNotification(`+${amount} XP - ${reason}`, 'success');
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('lastActiveDate');
    
    if (lastActive !== today) {
      setUserStats(prev => {
        const newStreak = prev.streak + 1;
        if (newStreak > 0 && newStreak % 7 === 0) {
          setShowStreakCelebration(true);
          soundManager.current.playStreakSound();
          setTimeout(() => setShowStreakCelebration(false), 4000);
          addXP(50, 'Weekly streak bonus!');
        }
        return { ...prev, streak: newStreak };
      });
      localStorage.setItem('lastActiveDate', today);
    }
  };

  const unlockAchievement = (achievementId, title, description) => {
    setUserStats(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      
      const newAchievements = [...prev.achievements, achievementId];
      setShowAchievement({ title, description });
      soundManager.current.playSuccess();
      setTimeout(() => setShowAchievement(null), 4000);
      addXP(25, `Achievement: ${title}`);
      
      return { ...prev, achievements: newAchievements };
    });
  };

  const completeExercise = (exerciseName) => {
    soundManager.current.playExerciseComplete();
    addXP(15, `Completed ${exerciseName}`);
    
    setUserStats(prev => ({
      ...prev,
      exercisesCompleted: prev.exercisesCompleted + 1
    }));

    // Check for achievements
    if (userStats.exercisesCompleted + 1 === 10) {
      unlockAchievement('first_10_exercises', 'Exercise Enthusiast', 'Completed 10 exercises!');
    }
    if (userStats.exercisesCompleted + 1 === 50) {
      unlockAchievement('exercise_master', 'Exercise Master', 'Completed 50 exercises!');
    }
  };

  const logPain = () => {
    addXP(10, 'Pain logged');
    setUserStats(prev => ({
      ...prev,
      painLogsToday: prev.painLogsToday + 1
    }));
    
    updateStreak();
    
    if (userStats.painLogsToday + 1 === 1) {
      unlockAchievement('first_log', 'Getting Started', 'Logged your first pain entry!');
    }
  };

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
        actionTab: 'reports',
        xp: 5
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
        actionTab: 'exercises',
        xp: 15
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
        actionTab: 'reports',
        xp: 25
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
        actionTab: 'medications',
        xp: 10
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
            { id: 4, label: 'Breathing Exercise', icon: PlayCircle, action: 'breathing', color: 'purple' },
            { id: 5, label: 'Demo Celebration', icon: Gift, action: 'demo', color: 'gold' }
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

  // Breathing exercise with sound
  const startBreathingExercise = () => {
    const guide = document.getElementById('breathing-guide');
    guide.classList.remove('hidden');
    
    let cycle = 0;
    const maxCycles = 5;
    
    const breathingCycle = () => {
      if (cycle >= maxCycles) {
        guide.classList.add('hidden');
        addXP(20, 'Completed breathing exercise');
        return;
      }
      
      // Inhale phase
      guide.querySelector('.breathing-text').textContent = 'Breathe In...';
      guide.querySelector('.breathing-circle').classList.add('inhale');
      soundManager.current.playBreathing(true);
      
      setTimeout(() => {
        // Exhale phase
        guide.querySelector('.breathing-text').textContent = 'Breathe Out...';
        guide.querySelector('.breathing-circle').classList.remove('inhale');
        guide.querySelector('.breathing-circle').classList.add('exhale');
        soundManager.current.playBreathing(false);
        
        setTimeout(() => {
          guide.querySelector('.breathing-circle').classList.remove('exhale');
          cycle++;
          setTimeout(breathingCycle, 1000);
        }, 3000);
      }, 4000);
    };
    
    breathingCycle();
  };

  // Handle insight actions with XP rewards
  const handleInsightAction = (insight) => {
    addXP(insight.xp, `Acted on insight: ${insight.title}`);
    handleTabChange(insight.actionTab);
    soundManager.current.playCorrectAnswer();
  };

  // Handle quick actions with sound feedback
  const handleQuickAction = (action) => {
    soundManager.current.playExerciseStart();
    
    // Handle special actions
    if (action.action === 'breathing') {
      startBreathingExercise();
      return;
    } else if (action.action === 'demo') {
      // Demo celebrations for testing
      const demos = ['streak', 'levelup', 'achievement'];
      const randomDemo = demos[Math.floor(Math.random() * demos.length)];
      
      if (randomDemo === 'streak') {
        setUserStats(prev => ({ ...prev, streak: prev.streak + 7 }));
        setShowStreakCelebration(true);
        soundManager.current.playStreakSound();
        setTimeout(() => setShowStreakCelebration(false), 4000);
      } else if (randomDemo === 'levelup') {
        setShowLevelUp(true);
        soundManager.current.playLevelUp();
        setTimeout(() => setShowLevelUp(false), 3000);
      } else if (randomDemo === 'achievement') {
        setShowAchievement({ title: 'Demo Master', description: 'You tried the demo celebration!' });
        soundManager.current.playSuccess();
        setTimeout(() => setShowAchievement(null), 4000);
      }
      return;
    }
    
    if (action.tab) {
      handleTabChange(action.tab);
    }
    
    // Add specific rewards based on action
    if (action.label === 'Log Pain') {
      setTimeout(() => logPain(), 1000);
    } else if (action.label === 'Quick Exercise') {
      setTimeout(() => completeExercise('Quick Exercise'), 5000);
    }
  };

  // Show notification with sound
  const showNotification = (message, type = 'info') => {
    soundManager.current.playNotification();
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), type, message, time: 'now' }
    ]);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Initialize user stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    // Check if user should get a streak
    updateStreak();
  }, []);

  // Save user stats to localStorage
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

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
              {/* Duolingo-style User Stats */}
              <div className="user-stats">
                <div className="streak-container">
                  <Flame className="streak-icon" />
                  <span className="streak-count">{userStats.streak}</span>
                  <span className="streak-label">day streak</span>
                </div>
                
                <div className="xp-container">
                  <Star className="xp-icon" />
                  <span className="xp-count">{userStats.totalXP}</span>
                  <span className="xp-label">XP</span>
                </div>
                
                <div className="level-container">
                  <Trophy className="level-icon" />
                  <span className="level-count">Level {userStats.level}</span>
                </div>
              </div>

              <div className="health-score">
                <Shield className="score-icon" />
                <span className="score-value">{healthScore}</span>
                <span className="score-label">Health Score</span>
              </div>
              
              {/* Sound Toggle */}
              <button 
                className="sound-toggle-btn"
                onClick={() => {
                  soundManager.current.toggle();
                  setSoundsEnabled(!soundsEnabled);
                }}
                title={soundsEnabled ? 'Disable sounds' : 'Enable sounds'}
              >
                {soundsEnabled ? <Volume2 /> : <VolumeX />}
              </button>
              
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
                        data-xp={insight.xp}
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

          {/* Duolingo-style Celebration Overlays */}
          {showStreakCelebration && (
            <div className="streak-celebration-overlay">
              <div className="celebration-content">
                <div className="celebration-animation">
                  <Flame className="celebration-flame" />
                  <div className="fire-particles">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`fire-particle particle-${i}`}>🔥</div>
                    ))}
                  </div>
                </div>
                <h2>🔥 {userStats.streak} Day Streak! 🔥</h2>
                <p>You're on fire! Keep up the amazing consistency!</p>
                <div className="celebration-xp">+50 XP Bonus!</div>
              </div>
            </div>
          )}

          {showLevelUp && (
            <div className="level-up-overlay">
              <div className="level-up-content">
                <div className="level-up-animation">
                  <Trophy className="celebration-trophy" />
                  <div className="sparkles">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
                    ))}
                  </div>
                </div>
                <h2>🎉 Level Up! 🎉</h2>
                <div className="new-level">Level {userStats.level}</div>
                <p>Congratulations! You've reached a new level in your health journey!</p>
              </div>
            </div>
          )}

          {showAchievement && (
            <div className="achievement-overlay">
              <div className="achievement-content">
                <div className="achievement-animation">
                  <Award className="celebration-award" />
                  <div className="achievement-glow"></div>
                </div>
                <h2>🏆 Achievement Unlocked! 🏆</h2>
                <div className="achievement-title">{showAchievement.title}</div>
                <p>{showAchievement.description}</p>
                <div className="achievement-xp">+25 XP</div>
              </div>
            </div>
          )}

          {/* Interactive Exercise Breathing Guide */}
          <div className="breathing-guide hidden" id="breathing-guide">
            <div className="breathing-circle">
              <div className="breathing-text">Breathe</div>
              <button className="breathing-start" onClick={() => startBreathingExercise()}>
                <PlayCircle />
              </button>
            </div>
          </div>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;