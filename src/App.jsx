import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Sound Manager Class
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  playTone(frequency, duration = 200, type = 'sine') {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  playSuccess() {
    this.playTone(800, 150);
    setTimeout(() => this.playTone(1000, 150), 100);
  }

  playClick() {
    this.playTone(600, 100);
  }

  playSwipe() {
    this.playTone(400, 80);
  }

  playGain() {
    this.playTone(880, 200);
    setTimeout(() => this.playTone(1100, 300), 150);
  }

  playLoss() {
    this.playTone(300, 400);
  }
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [healthValue, setHealthValue] = useState(2500.00);
  const [dailyChange, setDailyChange] = useState(+125.50);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const soundManager = useRef(new SoundManager());
  const timerRef = useRef(null);

  // Portfolio Data
  const portfolioData = [
    { name: 'Strength Training', value: 850.25, change: +45.30, percentage: 5.6 },
    { name: 'Cardio Health', value: 675.80, change: +32.15, percentage: 5.0 },
    { name: 'Flexibility', value: 420.90, change: +18.75, percentage: 4.7 },
    { name: 'Mental Wellness', value: 553.05, change: +29.30, percentage: 5.6 },
  ];

  // Exercise Programs
  const exercisePrograms = [
    {
      id: 1,
      name: 'Strength Growth Portfolio',
      description: 'High-yield muscle investments',
      duration: 20,
      exercises: ['Push-ups', 'Squats', 'Planks', 'Lunges'],
      risk: 'Moderate',
      expectedReturn: '+8.5%'
    },
    {
      id: 2,
      name: 'Cardio Momentum Fund',
      description: 'Heart rate investment strategy',
      duration: 15,
      exercises: ['Jumping Jacks', 'High Knees', 'Burpees', 'Mountain Climbers'],
      risk: 'High',
      expectedReturn: '+12.3%'
    },
    {
      id: 3,
      name: 'Flexibility Bonds',
      description: 'Safe, steady mobility returns',
      duration: 10,
      exercises: ['Neck Rolls', 'Shoulder Stretches', 'Hip Circles', 'Calf Raises'],
      risk: 'Low',
      expectedReturn: '+4.2%'
    }
  ];

  // Timer Effect
  useEffect(() => {
    if (isWorkingOut && workoutTimer > 0) {
      timerRef.current = setInterval(() => {
        setWorkoutTimer(prev => {
          if (prev <= 1) {
            completeWorkout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isWorkingOut, workoutTimer]);

  // Functions
  const startWorkout = (program) => {
    soundManager.current.playClick();
    setCurrentExercise(program);
    setWorkoutTimer(program.duration * 60);
    setIsWorkingOut(true);
    showNotification(`Started ${program.name}! 💪`, 'success');
  };

  const completeWorkout = () => {
    soundManager.current.playSuccess();
    soundManager.current.playGain();
    
    const bonus = Math.random() * 50 + 25;
    setHealthValue(prev => prev + bonus);
    setDailyChange(prev => prev + bonus);
    setExerciseMinutes(prev => prev + currentExercise.duration);
    
    setIsWorkingOut(false);
    setCurrentExercise(null);
    setWorkoutTimer(0);
    
    showNotification(`Workout Complete! +$${bonus.toFixed(2)} portfolio value! 🚀`, 'success');
    
    // Add achievement
    const newAchievement = {
      id: Date.now(),
      title: 'Investment Complete',
      description: `Completed ${currentExercise?.name}`,
      value: `+$${bonus.toFixed(2)}`
    };
    setAchievements(prev => [newAchievement, ...prev.slice(0, 4)]);
  };

  const stopWorkout = () => {
    soundManager.current.playClick();
    setIsWorkingOut(false);
    setCurrentExercise(null);
    setWorkoutTimer(0);
    showNotification('Workout paused. Resume anytime! ⏸️', 'info');
  };

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [notification, ...prev.slice(0, 2)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const switchTab = (tab) => {
    soundManager.current.playSwipe();
    setActiveTab(tab);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#00C805';
      case 'Moderate': return '#FF9500';
      case 'High': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">HealthFolio</h1>
          <div className="header-stats">
            <span className="portfolio-value">${healthValue.toFixed(2)}</span>
            <span className={`daily-change ${dailyChange >= 0 ? 'positive' : 'negative'}`}>
              {dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)} ({((dailyChange / healthValue) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'portfolio' && (
          <div className="portfolio-view">
            <div className="portfolio-summary">
              <h2>Your Health Portfolio</h2>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">${healthValue.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Today's Return</span>
                  <span className={`stat-value ${dailyChange >= 0 ? 'positive' : 'negative'}`}>
                    {dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Exercise Minutes</span>
                  <span className="stat-value">{exerciseMinutes}m</span>
                </div>
              </div>
            </div>

            <div className="holdings">
              <h3>Holdings</h3>
              {portfolioData.map((item, index) => (
                <div key={index} className="holding-item">
                  <div className="holding-info">
                    <span className="holding-name">{item.name}</span>
                    <span className="holding-value">${item.value.toFixed(2)}</span>
                  </div>
                  <div className="holding-change">
                    <span className={`change-amount ${item.change >= 0 ? 'positive' : 'negative'}`}>
                      {item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}
                    </span>
                    <span className={`change-percent ${item.change >= 0 ? 'positive' : 'negative'}`}>
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {achievements.length > 0 && (
              <div className="achievements">
                <h3>Recent Achievements</h3>
                {achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-info">
                      <span className="achievement-title">{achievement.title}</span>
                      <span className="achievement-desc">{achievement.description}</span>
                    </div>
                    <span className="achievement-value">{achievement.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="exercises-view">
            <h2>Investment Programs</h2>
            
            {isWorkingOut && currentExercise && (
              <div className="active-workout">
                <div className="workout-header">
                  <h3>Active Investment: {currentExercise.name}</h3>
                  <button className="stop-btn" onClick={stopWorkout}>Stop</button>
                </div>
                <div className="workout-timer">
                  <span className="timer-display">{formatTime(workoutTimer)}</span>
                  <span className="timer-label">Time Remaining</span>
                </div>
                <div className="workout-progress">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${((currentExercise.duration * 60 - workoutTimer) / (currentExercise.duration * 60)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="current-exercises">
                  <h4>Exercise Portfolio:</h4>
                  {currentExercise.exercises.map((exercise, index) => (
                    <span key={index} className="exercise-tag">{exercise}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="exercise-programs">
              {exercisePrograms.map(program => (
                <div key={program.id} className="program-card">
                  <div className="program-header">
                    <h3>{program.name}</h3>
                    <span 
                      className="risk-badge"
                      style={{ backgroundColor: getRiskColor(program.risk) }}
                    >
                      {program.risk}
                    </span>
                  </div>
                  <p className="program-description">{program.description}</p>
                  <div className="program-stats">
                    <div className="stat">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{program.duration}m</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Expected Return</span>
                      <span className="stat-value positive">{program.expectedReturn}</span>
                    </div>
                  </div>
                  <div className="program-exercises">
                    {program.exercises.map((exercise, index) => (
                      <span key={index} className="exercise-tag">{exercise}</span>
                    ))}
                  </div>
                  <button 
                    className="invest-btn"
                    onClick={() => startWorkout(program)}
                    disabled={isWorkingOut}
                  >
                    {isWorkingOut ? 'Investment Active' : 'Start Investment'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => switchTab('portfolio')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Portfolio</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => switchTab('exercises')}
        >
          <span className="nav-icon">💪</span>
          <span className="nav-label">Invest</span>
        </button>
      </nav>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;