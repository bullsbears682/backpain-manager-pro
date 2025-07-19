import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { usePainEntries, useExercises, useAppointments } from '../hooks/useData';
import { formatDate, getLastNDays } from '../utils/dateUtils';
import { 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Activity, 
  AlertCircle, 
  Heart,
  Zap,
  Target,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { painEntries } = usePainEntries();
  const { exercises } = useExercises();
  const { appointments } = useAppointments();

  const stats = useMemo(() => {
    const last7Days = getLastNDays(7);
    const recentPainEntries = painEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return last7Days.some(day => 
        day.toDateString() === entryDate.toDateString()
      );
    });

    const averagePain = recentPainEntries.length > 0
      ? (recentPainEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / recentPainEntries.length).toFixed(1)
      : 0;

    const exercisesThisWeek = painEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return last7Days.some(day => 
        day.toDateString() === entryDate.toDateString()
      ) && entry.exerciseCompleted;
    }).length;

    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.datetime);
      return aptDate > new Date();
    }).length;

    const painTrend = recentPainEntries.length >= 2
      ? recentPainEntries[recentPainEntries.length - 1].painLevel - recentPainEntries[0].painLevel
      : 0;

    return {
      averagePain,
      exercisesThisWeek,
      upcomingAppointments,
      totalPainEntries: painEntries.length,
      painTrend
    };
  }, [painEntries, appointments]);

  const chartData = useMemo(() => {
    const last7Days = getLastNDays(7);
    const data = last7Days.map(day => {
      const dayEntries = painEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return day.toDateString() === entryDate.toDateString();
      });
      
      if (dayEntries.length === 0) return null;
      
      const avgPain = dayEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / dayEntries.length;
      return avgPain;
    });

    return {
      labels: last7Days.map(day => day.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Pain Level',
          data: data,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [painEntries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const recentActivities = useMemo(() => {
    const activities = [];
    
    painEntries.slice(0, 3).forEach(entry => {
      activities.push({
        id: `pain-${entry.id}`,
        type: 'pain',
        description: `Recorded pain level: ${entry.painLevel}/10`,
        timestamp: entry.timestamp,
        icon: Activity,
        color: entry.painLevel > 6 ? '#ef4444' : entry.painLevel > 3 ? '#f59e0b' : '#10b981'
      });
    });

    appointments.slice(0, 2).forEach(apt => {
      activities.push({
        id: `appointment-${apt.id}`,
        type: 'appointment',
        description: `${apt.type} appointment`,
        timestamp: apt.datetime,
        icon: Calendar,
        color: '#6366f1'
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6);
  }, [painEntries, appointments]);

  const statCards = [
    {
      title: 'Average Pain',
      value: stats.averagePain,
      subtitle: '7 days',
      icon: Activity,
      color: stats.averagePain > 6 ? '#ef4444' : stats.averagePain > 3 ? '#f59e0b' : '#10b981',
      trend: {
        value: stats.painTrend,
        icon: stats.painTrend < 0 ? TrendingDown : stats.painTrend > 0 ? TrendingUp : null,
        text: stats.painTrend === 0 ? 'Stable' : `${Math.abs(stats.painTrend).toFixed(1)} ${stats.painTrend < 0 ? 'decrease' : 'increase'}`
      }
    },
    {
      title: 'Exercises',
      value: stats.exercisesThisWeek,
      subtitle: 'this week',
      icon: Zap,
      color: '#6366f1',
      trend: null
    },
    {
      title: 'Appointments',
      value: stats.upcomingAppointments,
      subtitle: 'upcoming',
      icon: Calendar,
      color: '#10b981',
      trend: null
    },
    {
      title: 'Pain Records',
      value: stats.totalPainEntries,
      subtitle: 'total entries',
      icon: Target,
      color: '#f59e0b',
      trend: null
    }
  ];

  const quickActions = [
    {
      label: 'Record Pain',
      icon: Activity,
      variant: 'primary',
      description: 'Log your current pain level'
    },
    {
      label: 'New Appointment',
      icon: Calendar,
      variant: 'secondary',
      description: 'Schedule with your doctor'
    },
    {
      label: 'Start Exercise',
      icon: Zap,
      variant: 'secondary',
      description: 'Begin a recommended routine'
    },
    {
      label: 'View Reports',
      icon: Target,
      variant: 'secondary',
      description: 'Analyze your progress'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to your back pain management dashboard</p>
      </div>

      {/* Enhanced Statistics Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: `${stat.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={20} style={{ color: stat.color }} />
                </div>
                {stat.trend?.icon && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: stat.trend.value < 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '6px'
                  }}>
                    <stat.trend.icon size={14} style={{ 
                      color: stat.trend.value < 0 ? '#10b981' : '#ef4444' 
                    }} />
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: stat.trend.value < 0 ? '#10b981' : '#ef4444'
                    }}>
                      {stat.trend.text}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              
              <div className="stat-label">
                {stat.title} <span style={{ opacity: 0.7 }}>({stat.subtitle})</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        {/* Enhanced Pain Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Pain Trend Analysis</h3>
              <p className="card-subtitle">Last 7 days overview</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--primary-600)'
            }}>
              <TrendingUp size={16} />
              Analytics
            </div>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Enhanced Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Activity</h3>
              <p className="card-subtitle">Your latest health actions</p>
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: 'none',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all var(--transition-normal)'
            }}>
              View All
              <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ padding: '0 0.5rem' }}>
            {recentActivities.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                color: 'var(--text-secondary)'
              }}>
                <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>No recent activities</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Start by recording your pain level or scheduling an appointment
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--border-radius-md)',
                      border: '1px solid var(--border-primary)',
                      transition: 'all var(--transition-normal)',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: activity.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${activity.color}25`
                      }}>
                        <IconComponent size={16} color="white" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: 'var(--text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {activity.description}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Clock size={12} />
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-subtitle">Common tasks at your fingertips</p>
          </div>
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button 
                key={index}
                className={`btn ${action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem',
                  height: 'auto',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: action.variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-500)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent 
                    size={20} 
                    color={action.variant === 'primary' ? 'white' : 'white'} 
                  />
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '700', 
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem'
                  }}>
                    {action.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.8,
                    fontWeight: '500'
                  }}>
                    {action.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;