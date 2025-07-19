import React, { useState, useEffect, useMemo } from 'react';
import { usePainEntries, useExercises, useAppointments, useMedications } from '../hooks/useData';
import { useNotification } from '../components/Notification';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Clock, 
  Award, 
  Target,
  Heart,
  Brain,
  Zap,
  Shield,
  Sun,
  Moon,
  Star,
  Flame,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  AlertTriangle,
  Coffee,
  Dumbbell,
  Pill,
  BookOpen,
  Smile,
  Meh,
  Frown,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Timer,
  MapPin,
  Bell,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Layers,
  Compass,
  Hexagon,
  Play,
  ExternalLink,
  Settings,
  RefreshCw,
  Infinity,
  Waves,
  Rocket
} from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const { painEntries } = usePainEntries();
  const { exercises } = useExercises();
  const { appointments } = useAppointments();
  const { medications } = useMedications();
  const { showNotification } = useNotification();
  
  // Enhanced navigation with feedback
  const handleNavigation = (page, message) => {
    if (onNavigate) {
      showNotification(`Navigating to ${message}...`, 'info');
      onNavigate(page);
    }
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'track-pain':
        handleNavigation('pain-tracking', 'Pain Tracking');
        break;
      case 'start-exercise':
        handleNavigation('exercises', 'Exercise Library');
        break;
      case 'add-medication':
        handleNavigation('medications', 'Medication Manager');
        break;
      case 'book-appointment':
        handleNavigation('appointments', 'Appointment Scheduler');
        break;
      case 'view-reports':
        handleNavigation('reports', 'Health Reports');
        break;
      case 'education':
        handleNavigation('education', 'Educational Resources');
        break;
      case 'settings':
        handleNavigation('settings', 'Settings');
        break;
      case 'sync':
        showNotification('Syncing dashboard data...', 'info');
        // Trigger re-render or refresh data
        setIsVisible(false);
        setTimeout(() => {
          setIsVisible(true);
          showNotification('Dashboard refreshed successfully!', 'success');
        }, 1000);
        break;
      default:
        showNotification('Feature coming soon!', 'info');
    }
  };

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    const recentEntries = painEntries.slice(0, 7);
    const avgPainLevel = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / recentEntries.length 
      : 0;
    
    const painTrend = recentEntries.length >= 2 
      ? recentEntries[0].painLevel - recentEntries[recentEntries.length - 1].painLevel
      : 0;

    const weeklyExercises = 3; // Mock data
    const totalWorkoutTime = 180; // Mock minutes
    const caloriesBurned = 420; // Mock calories
    const activeMedications = medications.filter(med => med.isActive).length;
    
    const nextAppointment = appointments
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    // Wellness Score Calculation (0-100)
    const painScore = Math.max(0, 100 - (avgPainLevel * 10));
    const exerciseScore = Math.min(100, weeklyExercises * 20);
    const medicationScore = activeMedications > 0 ? 80 : 60;
    const wellnessScore = Math.round((painScore + exerciseScore + medicationScore) / 3);

    return {
      avgPainLevel: avgPainLevel.toFixed(1),
      painTrend,
      weeklyExercises,
      totalWorkoutTime,
      caloriesBurned,
      activeMedications,
      nextAppointment,
      wellnessScore,
      recentEntries: recentEntries.slice(0, 5)
    };
  }, [painEntries, medications, appointments]);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: ['Good morning', 'Rise and shine', 'Start strong'],
      afternoon: ['Good afternoon', 'Keep going', 'Stay focused'],
      evening: ['Good evening', 'Wind down', 'Reflect and relax']
    };
    
    if (hour < 12) return greetings.morning[Math.floor(Math.random() * 3)];
    if (hour < 18) return greetings.afternoon[Math.floor(Math.random() * 3)];
    return greetings.evening[Math.floor(Math.random() * 3)];
  };

  return (
    <div className={`dashboard ${isVisible ? 'visible' : ''}`}>
      {/* Infinex-Style Hero Section */}
      <div className="hero-section mb-8">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {getGreeting()}, Champion! 🌟
            </h1>
            <p className="hero-subtitle">
              Your health journey continues. Every step forward is progress.
            </p>
          </div>
          
          <div className="wellness-orb">
            <div className="orb-inner">
              <div className="wellness-score">{analytics.wellnessScore}</div>
              <div className="wellness-label">Wellness Score</div>
            </div>
            <div className="orb-glow"></div>
          </div>
        </div>

        {/* AI Health Insights */}
        <div className="ai-insights">
          <div className="insight-item">
            <Brain size={20} />
            <span>Your pain levels have improved by 15% this week</span>
          </div>
          <div className="insight-item">
            <Sparkles size={20} />
            <span>Great job completing 3 exercises! Try to reach 5 this week</span>
          </div>
          <div className="insight-item">
            <Target size={20} />
            <span>Consider gentle stretching before bed to improve sleep quality</span>
          </div>
        </div>
      </div>

      {/* Infinex-Style Quick Actions */}
      <div className="quick-actions-section mb-8">
        <h2 className="section-title">
          <Rocket size={24} />
          Quick Actions
        </h2>
        <div className="quick-actions-grid">
          {[
            {
              icon: <Activity size={28} />,
              title: 'Track Pain',
              description: 'Log your current level',
              action: 'track-pain',
              gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
              glow: '#ef4444'
            },
            {
              icon: <Dumbbell size={28} />,
              title: 'Start Exercise',
              description: 'Begin your routine',
              action: 'start-exercise',
              gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              glow: '#8b5cf6'
            },
            {
              icon: <Pill size={28} />,
              title: 'Add Medication',
              description: 'Log medication intake',
              action: 'add-medication',
              gradient: 'linear-gradient(135deg, #10b981, #059669)',
              glow: '#10b981'
            },
            {
              icon: <Calendar size={28} />,
              title: 'Book Appointment',
              description: 'Schedule with doctor',
              action: 'book-appointment',
              gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              glow: '#6366f1'
            }
          ].map((action, index) => (
            <div
              key={index}
              className="quick-action-card"
              onClick={() => handleQuickAction(action.action)}
              style={{ '--glow-color': action.glow }}
            >
              <div className="action-icon" style={{ background: action.gradient }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinex-Style Metrics Grid */}
      <div className="metrics-section mb-8">
        <h2 className="section-title">
          <BarChart3 size={24} />
          Health Metrics
        </h2>
        <div className="metrics-grid">
          {[
            {
              icon: <Activity size={32} />,
              label: 'Avg Pain Level',
              value: analytics.avgPainLevel,
              suffix: '/10',
              trend: analytics.painTrend < 0 ? 'up' : 'down',
              trendValue: Math.abs(analytics.painTrend).toFixed(1),
              gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#ef4444'
            },
            {
              icon: <Dumbbell size={32} />,
              label: 'Weekly Exercises',
              value: analytics.weeklyExercises,
              suffix: '',
              trend: 'up',
              trendValue: '2',
              gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: '#8b5cf6'
            },
            {
              icon: <Timer size={32} />,
              label: 'Workout Time',
              value: Math.floor(analytics.totalWorkoutTime / 60),
              suffix: 'h',
              trend: 'up',
              trendValue: '30m',
              gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: '#06b6d4'
            },
            {
              icon: <Flame size={32} />,
              label: 'Calories Burned',
              value: analytics.caloriesBurned,
              suffix: '',
              trend: 'up',
              trendValue: '50',
              gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#f59e0b'
            }
          ].map((metric, index) => (
            <div
              key={index}
              className="metric-card"
              onClick={() => {
                const actions = ['track-pain', 'start-exercise', 'start-exercise', 'start-exercise'];
                handleQuickAction(actions[index] || 'view-reports');
              }}
              onMouseEnter={() => setActiveMetric(index)}
              onMouseLeave={() => setActiveMetric(null)}
              style={{
                '--metric-color': metric.color,
                transform: activeMetric === index ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div className="metric-icon" style={{ background: metric.gradient }}>
                {metric.icon}
              </div>
              <div className="metric-content">
                <div className="metric-value">
                  {metric.value}<span className="metric-suffix">{metric.suffix}</span>
                </div>
                <div className="metric-label">{metric.label}</div>
                <div className={`metric-trend ${metric.trend}`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{metric.trendValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinex-Style Activity Feed & Schedule */}
      <div className="grid-2 mb-8">
        {/* Activity Feed */}
        <div className="activity-feed card">
          <div className="card-header">
            <div className="section-icon">
              <Waves size={24} />
              <h3>Recent Activity</h3>
            </div>
            <button className="icon-btn" onClick={() => handleQuickAction('view-reports')}>
              <Eye size={16} />
            </button>
          </div>
          
          <div className="activity-list">
            {[
              { type: 'exercise', text: 'Completed Cat-Cow Stretch', time: '2h ago', icon: <Dumbbell size={16} />, color: '#8b5cf6' },
              { type: 'pain', text: 'Logged pain level: 4/10', time: '5h ago', icon: <Activity size={16} />, color: '#ef4444' },
              { type: 'medication', text: 'Took Ibuprofen 400mg', time: '8h ago', icon: <Pill size={16} />, color: '#10b981' },
              { type: 'insight', text: 'AI detected improvement', time: '1d ago', icon: <Brain size={16} />, color: '#06b6d4' }
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ background: `${activity.color}20`, color: activity.color }}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="schedule-card card">
          <div className="card-header">
            <div className="section-icon">
              <Calendar size={24} />
              <h3>Upcoming Events</h3>
            </div>
            <button className="icon-btn" onClick={() => handleQuickAction('book-appointment')}>
              <Plus size={16} />
            </button>
          </div>
          
          <div className="schedule-list">
            {[
              { type: 'appointment', title: 'Dr. Smith Checkup', time: 'Tomorrow 2:00 PM', icon: <Calendar size={16} />, urgent: false },
              { type: 'exercise', title: 'Morning Stretches', time: 'Daily 8:00 AM', icon: <Dumbbell size={16} />, urgent: false },
              { type: 'medication', title: 'Evening Medication', time: 'Daily 9:00 PM', icon: <Pill size={16} />, urgent: true },
              { type: 'reminder', title: 'Weekly Progress Review', time: 'Friday 6:00 PM', icon: <BarChart3 size={16} />, urgent: false }
            ].map((event, index) => (
              <div key={index} className={`schedule-item ${event.urgent ? 'urgent' : ''}`}>
                <div className="schedule-icon">
                  {event.icon}
                </div>
                <div className="schedule-content">
                  <p className="schedule-title">{event.title}</p>
                  <span className="schedule-time">{event.time}</span>
                </div>
                {event.urgent && <div className="urgent-indicator">!</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infinex-Style Floating Action Button */}
      <div 
        className="floating-action-btn"
        onClick={() => handleQuickAction('track-pain')}
        title="Quick Pain Tracking"
      >
        <Infinity size={28} />
      </div>

      {/* Background Decorative Elements */}
      <div className="dashboard-decoration">
        <div className="decoration-orb orb-1"></div>
        <div className="decoration-orb orb-2"></div>
        <div className="decoration-orb orb-3"></div>
      </div>
    </div>
  );
};

export default Dashboard;