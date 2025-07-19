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
  RefreshCw
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
  const [timeOfDay, setTimeOfDay] = useState('morning');

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Pain analytics
    const recentPainEntries = painEntries.filter(entry => new Date(entry.date) >= thisWeek);
    const avgPainLevel = recentPainEntries.length > 0 
      ? recentPainEntries.reduce((sum, entry) => sum + entry.level, 0) / recentPainEntries.length 
      : 0;
    
    const painTrend = recentPainEntries.length >= 2 ? 
      recentPainEntries[recentPainEntries.length - 1].level - recentPainEntries[0].level : 0;

    // Exercise analytics
    const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    const exerciseHistory = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
    const weeklyExercises = exerciseHistory.filter(entry => 
      new Date(entry.completedAt) >= thisWeek
    );

    // Medication adherence
    const todayMedications = medications.filter(med => 
      med.frequency === 'daily' || 
      (med.frequency === 'weekly' && today.getDay() === 0) ||
      (med.frequency === 'monthly' && today.getDate() === 1)
    );

    // Upcoming appointments
    const upcomingAppointments = appointments.filter(apt => 
      new Date(apt.date) >= today
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Wellness score calculation
    const painScore = Math.max(0, 100 - (avgPainLevel * 10));
    const exerciseScore = Math.min(100, weeklyExercises.length * 20);
    const medicationScore = todayMedications.length > 0 ? 85 : 100;
    const wellnessScore = Math.round((painScore + exerciseScore + medicationScore) / 3);

    return {
      avgPainLevel: Math.round(avgPainLevel * 10) / 10,
      painTrend,
      totalPainEntries: painEntries.length,
      weeklyPainEntries: recentPainEntries.length,
      
      totalExercises: exercises.length,
      completedToday: completedExercises.length,
      weeklyExercises: weeklyExercises.length,
      totalWorkoutTime: exerciseHistory.reduce((sum, entry) => sum + (entry.duration || 0), 0),
      caloriesBurned: exerciseHistory.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0),
      
      totalMedications: medications.length,
      activeMedications: medications.filter(med => med.isActive !== false).length,
      
      totalAppointments: appointments.length,
      upcomingAppointments: upcomingAppointments.slice(0, 3),
      nextAppointment: upcomingAppointments[0],
      
      wellnessScore,
      painScore,
      exerciseScore,
      medicationScore
    };
  }, [painEntries, exercises, appointments, medications]);

  // Initialize animations and time of day
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    return () => clearTimeout(timer);
  }, []);

  // Get greeting based on time and wellness score
  const getGreeting = () => {
    const greetings = {
      morning: {
        high: "🌅 Good morning! You're doing amazing!",
        medium: "🌤️ Good morning! Ready for a great day?",
        low: "☀️ Good morning! Let's make today better!"
      },
      afternoon: {
        high: "🌞 Good afternoon! Keep up the excellent work!",
        medium: "🌤️ Good afternoon! You're making progress!",
        low: "⛅ Good afternoon! One step at a time!"
      },
      evening: {
        high: "🌙 Good evening! What a productive day!",
        medium: "🌆 Good evening! You've made good progress!",
        low: "🌙 Good evening! Tomorrow is a new opportunity!"
      }
    };

    const level = analytics.wellnessScore >= 80 ? 'high' : 
                  analytics.wellnessScore >= 60 ? 'medium' : 'low';
    
    return greetings[timeOfDay][level];
  };

  // Get wellness insights
  const getWellnessInsights = () => {
    const insights = [];
    
    if (analytics.painTrend < 0) {
      insights.push({
        type: 'success',
        icon: <TrendingDown className="text-green-400" />,
        message: `Great news! Your pain level has decreased by ${Math.abs(analytics.painTrend).toFixed(1)} points this week.`,
        action: 'Keep up your current routine!'
      });
    } else if (analytics.painTrend > 0) {
      insights.push({
        type: 'warning',
        icon: <TrendingUp className="text-orange-400" />,
        message: `Your pain level has increased by ${analytics.painTrend.toFixed(1)} points this week.`,
        action: 'Consider adjusting your exercise routine or consulting your doctor.'
      });
    }

    if (analytics.weeklyExercises >= 5) {
      insights.push({
        type: 'success',
        icon: <Award className="text-yellow-400" />,
        message: `Excellent! You've completed ${analytics.weeklyExercises} exercises this week.`,
        action: 'You\'re building a strong foundation for recovery!'
      });
    } else if (analytics.weeklyExercises < 3) {
      insights.push({
        type: 'info',
        icon: <Target className="text-blue-400" />,
        message: 'Try to complete at least 3 exercises this week for optimal results.',
        action: 'Start with gentle stretches and build up gradually.'
      });
    }

    if (analytics.nextAppointment) {
      const daysUntil = Math.ceil((new Date(analytics.nextAppointment.date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 3) {
        insights.push({
          type: 'info',
          icon: <Calendar className="text-purple-400" />,
          message: `You have an appointment with ${analytics.nextAppointment.doctor} in ${daysUntil} days.`,
          action: 'Prepare any questions you want to discuss.'
        });
      }
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const wellnessInsights = getWellnessInsights();

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Enhanced Header with Dynamic Greeting */}
      <div className="page-header mb-8">
        <div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, #ffffff, #60a5fa, #a78bfa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            {getGreeting()}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
            Your personalized back pain management dashboard
          </p>
        </div>
        
        {/* Real-time Wellness Score */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: analytics.wellnessScore >= 80 ? '#10b981' : 
                     analytics.wellnessScore >= 60 ? '#f59e0b' : '#ef4444',
              lineHeight: 1
            }}>
              {analytics.wellnessScore}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '600' }}>
              Wellness Score
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            background: `conic-gradient(
              ${analytics.wellnessScore >= 80 ? '#10b981' : 
                analytics.wellnessScore >= 60 ? '#f59e0b' : '#ef4444'} 0deg,
              ${analytics.wellnessScore >= 80 ? '#10b981' : 
                analytics.wellnessScore >= 60 ? '#f59e0b' : '#ef4444'} ${analytics.wellnessScore * 3.6}deg,
              rgba(255, 255, 255, 0.2) ${analytics.wellnessScore * 3.6}deg,
              rgba(255, 255, 255, 0.2) 360deg
            )`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)'
            }} />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="section-title mb-6">Quick Actions</h2>
        <div className="grid-4">
          {[
            {
              icon: <Activity size={24} />,
              title: 'Track Pain',
              description: 'Log your current pain level',
              action: 'track-pain',
              color: '#ef4444',
              gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
            },
            {
              icon: <Dumbbell size={24} />,
              title: 'Start Exercise',
              description: 'Begin your workout routine',
              action: 'start-exercise',
              color: '#8b5cf6',
              gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            },
            {
              icon: <Pill size={24} />,
              title: 'Add Medication',
              description: 'Log medication intake',
              action: 'add-medication',
              color: '#10b981',
              gradient: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
              icon: <Calendar size={24} />,
              title: 'Book Appointment',
              description: 'Schedule with your doctor',
              action: 'book-appointment',
              color: '#6366f1',
              gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)'
            },
            {
              icon: <BarChart3 size={24} />,
              title: 'View Reports',
              description: 'Check your progress',
              action: 'view-reports',
              color: '#06b6d4',
              gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
            },
            {
              icon: <BookOpen size={24} />,
              title: 'Learn More',
              description: 'Educational resources',
              action: 'education',
              color: '#f97316',
              gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
            },
            {
              icon: <Settings size={24} />,
              title: 'Settings',
              description: 'Customize your experience',
              action: 'settings',
              color: '#64748b',
              gradient: 'linear-gradient(135deg, #64748b, #475569)'
            },
            {
              icon: <RefreshCw size={24} />,
              title: 'Sync Data',
              description: 'Refresh your dashboard',
              action: 'sync',
              color: '#8b5cf6',
              gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
            }
          ].map((action, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handleQuickAction(action.action)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${action.color}20`;
                e.currentTarget.style.borderColor = `${action.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: action.gradient
              }} />
              
              <div style={{
                width: '50px',
                height: '50px',
                background: action.gradient,
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'white'
              }}>
                {action.icon}
              </div>
              
              <h3 style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                margin: 0
              }}>
                {action.title}
              </h3>
              
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.85rem',
                margin: 0,
                lineHeight: 1.4
              }}>
                {action.description}
              </p>
              
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                opacity: 0.3,
                transition: 'opacity 0.3s ease'
              }}>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ultra-Modern Stats Grid */}
      <div className="stats-grid mb-8">
        {[
          {
            icon: <Activity size={28} />,
            label: 'Average Pain Level',
            value: analytics.avgPainLevel,
            suffix: '/10',
            trend: analytics.painTrend,
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
            improvement: analytics.painTrend < 0
          },
          {
            icon: <Dumbbell size={28} />,
            label: 'Exercises This Week',
            value: analytics.weeklyExercises,
            suffix: '',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            improvement: analytics.weeklyExercises >= 3
          },
          {
            icon: <Timer size={28} />,
            label: 'Total Workout Time',
            value: Math.floor(analytics.totalWorkoutTime / 60),
            suffix: 'min',
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            improvement: analytics.totalWorkoutTime > 0
          },
          {
            icon: <Flame size={28} />,
            label: 'Calories Burned',
            value: analytics.caloriesBurned,
            suffix: '',
            color: '#f97316',
            gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
            improvement: analytics.caloriesBurned > 0
          },
          {
            icon: <Pill size={28} />,
            label: 'Active Medications',
            value: analytics.activeMedications,
            suffix: '',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
            improvement: true
          },
          {
            icon: <Calendar size={28} />,
            label: 'Next Appointment',
            value: analytics.nextAppointment ? 
              Math.ceil((new Date(analytics.nextAppointment.date) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
            suffix: analytics.nextAppointment ? ' days' : '',
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            improvement: true
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: activeMetric === index ? 'scale(1.05)' : 'scale(1)',
              zIndex: activeMetric === index ? 10 : 1
            }}
            onClick={() => {
              const actions = ['track-pain', 'start-exercise', 'start-exercise', 'start-exercise', 'add-medication', 'book-appointment'];
              handleQuickAction(actions[index] || 'view-reports');
            }}
            onMouseEnter={() => setActiveMetric(index)}
            onMouseLeave={() => setActiveMetric(null)}
          >
            {/* Floating Icon */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              width: '50px',
              height: '50px',
              background: stat.gradient,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              animation: 'float 3s ease-in-out infinite',
              animationDelay: `${index * 0.2}s`
            }}>
              {stat.icon}
            </div>

            {/* Progress Bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0 0 1.5rem 1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: stat.gradient,
                width: `${Math.min(100, (stat.value / 10) * 100)}%`,
                transition: 'width 2s ease',
                animation: 'shimmer 2s ease-in-out infinite'
              }} />
            </div>

            <div style={{ paddingRight: '60px' }}>
              <div className="stat-value" style={{
                background: stat.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.25rem'
              }}>
                {stat.value}
                <span style={{ fontSize: '1rem', opacity: 0.7 }}>{stat.suffix}</span>
              </div>
              <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {stat.label}
                {stat.improvement && <CheckCircle2 size={14} style={{ color: '#10b981' }} />}
              </div>
            </div>

            {/* Trend Indicator */}
            {stat.trend !== undefined && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                background: stat.trend < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: stat.trend < 0 ? '#10b981' : '#ef4444'
              }}>
                {stat.trend < 0 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                {Math.abs(stat.trend).toFixed(1)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI-Powered Insights Section */}
      {wellnessInsights.length > 0 && (
        <div className="card mb-8" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #10b981, #f59e0b)'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'glow 2s ease-in-out infinite'
            }}>
              <Brain size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                AI Health Insights
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.875rem' }}>
                Personalized recommendations based on your data
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {wellnessInsights.map((insight, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {insight.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    {insight.message}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.875rem' }}>
                    {insight.action}
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: 'rgba(255, 255, 255, 0.5)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Dashboard */}
      <div className="grid-2 mb-8">
        {/* Quick Pain Entry */}
        <div className="card" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ef4444, #f97316)',
            borderRadius: '1.5rem 1.5rem 0 0'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={22} color="white" />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                Quick Pain Check
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.875rem' }}>
                How are you feeling right now?
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '2rem',
            gap: '0.5rem'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <button
                key={level}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.background = level <= 3 ? '#10b981' : level <= 6 ? '#f59e0b' : '#ef4444';
                  e.target.style.borderColor = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                {level}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} />
            Log Pain Level
          </button>
        </div>

        {/* Exercise Streak */}
        <div className="card" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
            borderRadius: '1.5rem 1.5rem 0 0'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={22} color="white" />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                Exercise Streak
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.875rem' }}>
                Keep your momentum going!
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              {analytics.weeklyExercises}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', fontWeight: '600' }}>
              exercises this week
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '4px',
                  background: index < analytics.weeklyExercises 
                    ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                    : 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: index < analytics.weeklyExercises ? 'glow 2s ease-in-out infinite' : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>

          <button 
            className="btn btn-success" 
            style={{ width: '100%' }}
            onClick={() => handleQuickAction('start-exercise')}
          >
            <Dumbbell size={16} />
            Start Exercise
          </button>
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid-2">
        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={22} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                Recent Activity
              </h3>
            </div>
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}>
              <Eye size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { type: 'exercise', text: 'Completed Cat-Cow Stretch', time: '2 hours ago', icon: <Dumbbell size={16} /> },
              { type: 'pain', text: 'Logged pain level: 4/10', time: '5 hours ago', icon: <Activity size={16} /> },
              { type: 'medication', text: 'Took Ibuprofen 400mg', time: '8 hours ago', icon: <Pill size={16} /> },
              { type: 'appointment', text: 'Appointment with Dr. Smith', time: '2 days ago', icon: <Calendar size={16} /> }
            ].slice(0, 4).map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.75rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '35px',
                  height: '35px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                    {activity.text}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={22} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                Upcoming Events
              </h3>
            </div>
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}>
              <Plus size={16} />
            </button>
          </div>

          {analytics.upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analytics.upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.75rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Calendar size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                      {appointment.doctor}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    {Math.ceil((new Date(appointment.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No upcoming appointments</p>
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                Schedule Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          animation: 'float 3s ease-in-out infinite'
        }}
        onClick={() => handleQuickAction('track-pain')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
        }}
        title="Quick Pain Tracking"
        role="button"
        aria-label="Track pain level"
      >
        <Plus size={24} />
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;