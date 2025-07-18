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
import { TrendingDown, TrendingUp, Calendar, Activity, AlertCircle } from 'lucide-react';

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
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [painEntries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pain Levels - Last 7 Days',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Pain Level (0-10)',
        },
      },
    },
  };

  const recentActivities = useMemo(() => {
    const activities = [];
    
    // Add recent pain entries
    painEntries.slice(-5).forEach(entry => {
      activities.push({
        id: entry.id,
        type: 'pain',
        description: `Pain level recorded: ${entry.painLevel}/10`,
        timestamp: entry.timestamp,
        icon: AlertCircle,
        color: entry.painLevel > 6 ? '#f56565' : entry.painLevel > 3 ? '#ed8936' : '#48bb78'
      });
    });

    // Add recent appointments
    appointments.slice(-3).forEach(apt => {
      activities.push({
        id: apt.id,
        type: 'appointment',
        description: `Appointment: ${apt.title}`,
        timestamp: apt.datetime,
        icon: Calendar,
        color: '#667eea'
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
  }, [painEntries, appointments]);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to your back pain management dashboard</p>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.averagePain > 6 ? '#f56565' : stats.averagePain > 3 ? '#ed8936' : '#48bb78' }}>
            {stats.averagePain}
          </div>
          <div className="stat-label">Average Pain (7 days)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
            {stats.painTrend < 0 ? (
              <TrendingDown size={16} style={{ color: '#48bb78', marginRight: '0.25rem' }} />
            ) : stats.painTrend > 0 ? (
              <TrendingUp size={16} style={{ color: '#f56565', marginRight: '0.25rem' }} />
            ) : null}
            <span style={{ fontSize: '0.75rem', color: '#718096' }}>
              {stats.painTrend === 0 ? 'Stable' : `${Math.abs(stats.painTrend).toFixed(1)} ${stats.painTrend < 0 ? 'decrease' : 'increase'}`}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {stats.exercisesThisWeek}
          </div>
          <div className="stat-label">Exercises This Week</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#48bb78' }}>
            {stats.upcomingAppointments}
          </div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ed8936' }}>
            {stats.totalPainEntries}
          </div>
          <div className="stat-label">Total Pain Records</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Pain Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Pain Trend</h3>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activities</h3>
          </div>
          <div className="card-content">
            {recentActivities.length === 0 ? (
              <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                No recent activities. Start by recording your pain level or scheduling an appointment.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: activity.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComponent size={16} color="white" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '500', color: '#2d3748' }}>
                          {activity.description}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>
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

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">
              <Activity size={16} />
              Record Pain Level
            </button>
            <button className="btn btn-secondary">
              <Calendar size={16} />
              Schedule Appointment
            </button>
            <button className="btn btn-secondary">
              <TrendingUp size={16} />
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;