import React, { useState, useEffect, useRef, Fragment } from 'react';
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
  PauseCircle,
  DollarSign,
  LineChart,
  PieChart,
  BarChart2,
  Wallet,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Smartphone,
  Headphones
} from 'lucide-react';
import './App.css';

// Robinhood-inspired Sound Manager with Financial Audio Feedback
class RobinhoodSoundManager {
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

  // Generate complex tones for financial-style feedback
  createTone(frequency, duration, type = 'sine', envelope = 'standard') {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    // Robinhood-style filter for crisp sounds
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime);
    
    // Different envelopes for different actions
    switch (envelope) {
      case 'buy':
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + duration);
        break;
      case 'sell':
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
      default:
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    }
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Robinhood-style success sounds (like stock purchase)
  playPortfolioGain() {
    // Ascending arpeggio like a winning trade
    const notes = [220, 277.18, 329.63, 415.30]; // A3, C#4, E4, G#4
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.3, 'triangle', 'buy'), i * 100);
    });
  }

  playPortfolioLoss() {
    // Descending tone like a losing trade
    const notes = [415.30, 329.63, 277.18, 220]; // G#4, E4, C#4, A3
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.4, 'sawtooth', 'sell'), i * 150);
    });
  }

  playTransaction() {
    // Clean transaction sound (like Robinhood buy/sell)
    this.createTone(800, 0.1, 'triangle');
    setTimeout(() => this.createTone(600, 0.15, 'sine'), 100);
  }

  playNotification() {
    // Subtle notification (like price alert)
    this.createTone(1000, 0.08, 'sine');
    setTimeout(() => this.createTone(1200, 0.08, 'sine'), 120);
  }

  playSwipe() {
    // Card swipe sound for navigation
    const frequency = 400 + Math.random() * 200;
    this.createTone(frequency, 0.05, 'triangle');
  }

  playPullToRefresh() {
    // Refresh sound like pulling down stocks
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createTone(300 + i * 100, 0.1, 'sine');
      }, i * 50);
    }
  }

  playHealthImprovement() {
    // Like a stock going up
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.2, 'triangle', 'buy'), i * 80);
    });
  }

  playHealthDecline() {
    // Like a stock going down
    const notes = [523.25, 392.00, 329.63, 261.63]; // C5, G4, E4, C4
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.25, 'sawtooth', 'sell'), i * 100);
    });
  }

  playAchievement() {
    // Like hitting a profit target
    this.createTone(523.25, 0.2); // C5
    setTimeout(() => this.createTone(659.25, 0.2), 100); // E5
    setTimeout(() => this.createTone(783.99, 0.3), 200); // G5
    setTimeout(() => this.createTone(1046.50, 0.4), 300); // C6
  }

  playCardFlip() {
    // Card flip animation sound
    this.createTone(600, 0.08, 'square');
    setTimeout(() => this.createTone(400, 0.08, 'square'), 80);
  }

  playButtonPress() {
    // Subtle button feedback
    this.createTone(800, 0.05, 'triangle');
  }

  playMarketOpen() {
    // Like market opening bell
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(800 + Math.sin(i) * 200, 0.1, 'triangle');
      }, i * 200);
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('soundsEnabled', this.isEnabled);
    
    // Play feedback sound when toggling
    if (this.isEnabled) {
      setTimeout(() => this.playNotification(), 100);
    }
  }
}

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Robinhood-style state management
  const [portfolioVisible, setPortfolioVisible] = useState(true);
  const [healthPortfolio, setHealthPortfolio] = useState({
    totalValue: 8750.23,
    dailyChange: 125.67,
    dailyChangePercent: 1.46,
    positions: [
      { name: 'Pain Management', value: 3250.50, change: 45.23, changePercent: 1.41, color: '#00C805' },
      { name: 'Exercise Routine', value: 2100.75, change: 32.15, changePercent: 1.55, color: '#00C805' },
      { name: 'Medication Adherence', value: 1890.25, change: 25.30, changePercent: 1.36, color: '#00C805' },
      { name: 'Sleep Quality', value: 1508.73, change: 22.99, changePercent: 1.55, color: '#00C805' }
    ]
  });
  
  // Enhanced gamification with investment metaphors
  const [userStats, setUserStats] = useState({
    streak: 7,
    totalXP: 350,
    level: 4,
    achievements: ['early_investor', 'consistent_trader'],
    portfolioValue: 8750.23,
    dailyGoalCompleted: false,
    exercisesCompleted: 12,
    painLogsToday: 2,
    investmentGrade: 'A+'
  });
  
  const [showCelebration, setShowCelebration] = useState(null);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const soundManager = useRef(new RobinhoodSoundManager());
  
  // Robinhood-style UI state
  const [showPortfolioDetails, setShowPortfolioDetails] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Existing state for compatibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [isPageMinimized, setIsPageMinimized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [smartInsights, setSmartInsights] = useState([]);
  const [healthScore, setHealthScore] = useState(85);
  const [dailyGoals, setDailyGoals] = useState({
    painLog: { completed: true, target: 1 },
    exercise: { completed: true, target: 20 },
    medication: { completed: true, target: 1 },
    sleep: { completed: false, target: 8 }
  });

  // Investment-style functions
  const updatePortfolio = (type, amount) => {
    setHealthPortfolio(prev => {
      const newValue = prev.totalValue + amount;
      const changeAmount = amount;
      const changePercent = (amount / prev.totalValue) * 100;
      
      if (amount > 0) {
        soundManager.current.playHealthImprovement();
      } else {
        soundManager.current.playHealthDecline();
      }
      
      return {
        ...prev,
        totalValue: newValue,
        dailyChange: prev.dailyChange + changeAmount,
        dailyChangePercent: ((prev.dailyChange + changeAmount) / prev.totalValue) * 100
      };
    });
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

  const addXP = (amount, reason) => {
    setUserStats(prev => {
      const newXP = prev.totalXP + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const portfolioIncrease = amount * 12.5; // XP to portfolio conversion
      
      updatePortfolio('gain', portfolioIncrease);
      
      if (newLevel > prev.level) {
        setShowCelebration({ type: 'levelup', level: newLevel });
        soundManager.current.playAchievement();
        setTimeout(() => setShowCelebration(null), 4000);
      } else {
        soundManager.current.playPortfolioGain();
      }
      
      showNotification(`+${amount} XP - ${reason}`, 'success');
      
      return {
        ...prev,
        totalXP: newXP,
        level: newLevel,
        portfolioValue: prev.portfolioValue + portfolioIncrease
      };
    });
  };

  const completeTransaction = (type, description) => {
    soundManager.current.playTransaction();
    addXP(15, description);
    
    // Add to portfolio positions
    setHealthPortfolio(prev => ({
      ...prev,
      positions: prev.positions.map(pos => 
        pos.name === type ? {
          ...pos,
          value: pos.value + 50,
          change: pos.change + 25,
          changePercent: ((pos.change + 25) / pos.value) * 100
        } : pos
      )
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    soundManager.current.playPullToRefresh();
    
    // Simulate portfolio update
    setTimeout(() => {
      const randomChange = (Math.random() - 0.5) * 100;
      updatePortfolio('update', randomChange);
      setIsRefreshing(false);
    }, 1500);
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

  // Handle insight actions (updated version)
  const handleInsightActionLegacy = (insight) => {
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
        <div className="app robinhood-style">
          {/* Robinhood-style Header */}
          <header className="robinhood-header">
            <div className="header-left">
              <button 
                className="sidebar-toggle"
                onClick={() => {
                  soundManager.current.playSwipe();
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                aria-label="Toggle menu"
              >
                <Menu />
              </button>
              <div className="app-title">
                <Wallet className="app-icon" />
                <span>HealthFolio</span>
              </div>
            </div>
            
            <div className="header-center">
              <div className="portfolio-summary">
                <button
                  className="portfolio-toggle"
                  onClick={() => {
                    soundManager.current.playButtonPress();
                    setPortfolioVisible(!portfolioVisible);
                  }}
                >
                  {portfolioVisible ? <Eye /> : <EyeOff />}
                </button>
                {portfolioVisible ? (
                  <div className="portfolio-value">
                    <div className="total-value">${healthPortfolio.totalValue.toLocaleString()}</div>
                    <div className={`daily-change ${healthPortfolio.dailyChange >= 0 ? 'positive' : 'negative'}`}>
                      {healthPortfolio.dailyChange >= 0 ? <ArrowUp /> : <ArrowDown />}
                      ${Math.abs(healthPortfolio.dailyChange).toFixed(2)} ({healthPortfolio.dailyChangePercent.toFixed(2)}%)
                    </div>
                  </div>
                ) : (
                  <div className="portfolio-hidden">••••••</div>
                )}
              </div>
            </div>
            
            <div className="header-right">
              {/* Investment Grade Badge */}
              <div className="investment-grade">
                <div className="grade-badge">{userStats.investmentGrade}</div>
                <div className="grade-label">Health Grade</div>
              </div>
              
              {/* Sound Toggle */}
              <button 
                className="robinhood-sound-toggle"
                onClick={() => {
                  soundManager.current.toggle();
                  setSoundsEnabled(!soundsEnabled);
                }}
                title={soundsEnabled ? 'Disable sounds' : 'Enable sounds'}
              >
                {soundsEnabled ? <Headphones /> : <VolumeX />}
              </button>
              
              {/* Notifications */}
              <button 
                className="robinhood-notifications"
                onClick={() => soundManager.current.playButtonPress()}
              >
                <Bell />
                {notifications.length > 0 && (
                  <span className="notification-dot">{notifications.length}</span>
                )}
              </button>
              
              {/* Profile */}
              <button 
                className="robinhood-profile"
                onClick={() => soundManager.current.playButtonPress()}
              >
                <User />
              </button>
            </div>
          </header>

          <div className="app-body">
            {/* Robinhood-style Portfolio Dashboard */}
            <div className="portfolio-dashboard">
              {/* Pull to Refresh */}
              <div 
                className={`refresh-indicator ${isRefreshing ? 'active' : ''}`}
                onClick={handleRefresh}
              >
                <div className="refresh-circle">
                  <ArrowDown className={`refresh-arrow ${isRefreshing ? 'spinning' : ''}`} />
                </div>
                <span>Pull to refresh</span>
              </div>

              {/* Portfolio Chart Area */}
              <div className="chart-container">
                <div className="chart-header">
                  <h2>Health Portfolio</h2>
                  <div className="time-range">
                    <button className="time-btn active">1D</button>
                    <button className="time-btn">1W</button>
                    <button className="time-btn">1M</button>
                    <button className="time-btn">1Y</button>
                  </div>
                </div>
                
                {/* Simulated Chart */}
                <div className="portfolio-chart">
                  <div className="chart-line">
                    <svg width="100%" height="200" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#00C805', stopOpacity: 0.3}} />
                          <stop offset="100%" style={{stopColor: '#00C805', stopOpacity: 0}} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,150 Q100,120 200,100 T400,80"
                        stroke="#00C805"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M0,150 Q100,120 200,100 T400,80 L400,200 L0,200 Z"
                        fill="url(#chartGradient)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Holdings List */}
              <div className="holdings-container">
                <div className="holdings-header">
                  <h3>Your Health Holdings</h3>
                  <button 
                    className="view-all-btn"
                    onClick={() => soundManager.current.playButtonPress()}
                  >
                    View All
                  </button>
                </div>
                
                <div className="holdings-list">
                  {healthPortfolio.positions.map((position, index) => (
                    <div 
                      key={position.name}
                      className="holding-item"
                      onClick={() => {
                        soundManager.current.playCardFlip();
                        setSelectedPosition(position);
                      }}
                    >
                      <div className="holding-info">
                        <div className="holding-name">{position.name}</div>
                        <div className="holding-subtitle">Health Investment</div>
                      </div>
                      
                      <div className="holding-chart">
                        <div className="mini-chart">
                          <LineChart size={24} color={position.color} />
                        </div>
                      </div>
                      
                      <div className="holding-values">
                        <div className="holding-value">${position.value.toLocaleString()}</div>
                        <div className={`holding-change ${position.change >= 0 ? 'positive' : 'negative'}`}>
                          {position.change >= 0 ? '+' : ''}${position.change.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions - Robinhood Style */}
              <div className="robinhood-actions">
                <div className="actions-row">
                  <button 
                    className="action-btn primary"
                    onClick={() => completeTransaction('Pain Management', 'Pain tracking session')}
                  >
                    <Heart />
                    <span>Log Pain</span>
                  </button>
                  
                  <button 
                    className="action-btn secondary"
                    onClick={() => completeTransaction('Exercise Routine', 'Exercise completed')}
                  >
                    <Activity />
                    <span>Exercise</span>
                  </button>
                  
                  <button 
                    className="action-btn secondary"
                    onClick={() => completeTransaction('Medication Adherence', 'Medication taken')}
                  >
                    <Pill />
                    <span>Medication</span>
                  </button>
                  
                  <button 
                    className="action-btn secondary"
                    onClick={() => soundManager.current.playMarketOpen()}
                  >
                    <BarChart2 />
                    <span>Reports</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Traditional Sidebar for Navigation */}
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              activeTab={activeTab}
              onTabChange={(tab) => {
                soundManager.current.playSwipe();
                handleTabChange(tab);
              }}
              tabs={tabs}
            />

            {/* Page Content when not on dashboard */}
            {activeTab !== 'dashboard' && (
              <main className="page-content">
                <div className="page-header">
                  <button 
                    className="back-btn"
                    onClick={() => {
                      soundManager.current.playSwipe();
                      setActiveTab('dashboard');
                    }}
                  >
                    <ArrowLeft />
                    Back to Portfolio
                  </button>
                  <h1>{currentTab.label}</h1>
                </div>
                <CurrentComponent />
              </main>
            )}

            {/* Robinhood-style Celebration Overlays */}
            {showCelebration && (
            <div className="robinhood-celebration-overlay">
              <div className="celebration-content">
                {showCelebration.type === 'levelup' && (
                  <>
                    <div className="celebration-icon">
                      <Trophy size={80} color="#00C805" />
                    </div>
                    <h2>Portfolio Upgraded!</h2>
                    <p>You've reached Level {showCelebration.level}</p>
                    <div className="celebration-value">+$500 Portfolio Value</div>
                  </>
                )}
                {showCelebration.type === 'achievement' && (
                  <>
                    <div className="celebration-icon">
                      <Award size={80} color="#00C805" />
                    </div>
                    <h2>Achievement Unlocked!</h2>
                    <p>{showCelebration.title}</p>
                    <div className="celebration-value">+$250 Bonus</div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Notifications Toast */}
          {notifications.length > 0 && (
            <div className="robinhood-notifications-toast">
              {notifications.map(notification => (
                <div key={notification.id} className={`toast-item ${notification.type}`}>
                  {notification.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;
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

          {/* Robinhood-style Celebration Overlays */}
          <Fragment>
            {showCelebration && (
              <div className="robinhood-celebration-overlay">
                <div className="celebration-content">
                  {showCelebration.type === 'levelup' && (
                    <>
                      <div className="celebration-icon">
                        <Trophy size={80} color="#00C805" />
                      </div>
                      <h2>Portfolio Upgraded!</h2>
                      <p>You've reached Level {showCelebration.level}</p>
                      <div className="celebration-value">+$500 Portfolio Value</div>
                    </>
                  )}
                  {showCelebration.type === 'achievement' && (
                    <>
                      <div className="celebration-icon">
                        <Award size={80} color="#00C805" />
                      </div>
                      <h2>Achievement Unlocked!</h2>
                      <p>{showCelebration.title}</p>
                      <div className="celebration-value">+$250 Bonus</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Toast */}
            {notifications.length > 0 && (
              <div className="robinhood-notifications-toast">
                {notifications.map(notification => (
                  <div key={notification.id} className={`toast-item ${notification.type}`}>
                    {notification.message}
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;