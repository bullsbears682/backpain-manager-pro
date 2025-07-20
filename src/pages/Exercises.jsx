import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useExercises } from '../hooks/useData';
import SafeRenderer from '../components/SafeRenderer';
import UltraSafeRenderer from '../components/UltraSafeRenderer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Award, 
  Filter, 
  Search, 
  Star,
  Heart,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  X,
  Info,
  Settings,
  Calendar,
  BarChart3,
  Timer,
  Users,
  Bookmark,
  BookmarkCheck,
  Activity,
  Dumbbell,
  Flame,
  Shield,
  RefreshCw,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  DollarSign,
  LineChart,
  PieChart,
  Wallet,
  CreditCard,
  Eye,
  EyeOff,
  Smartphone,
  Headphones,
  Trophy,
  Gift,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';

// Enhanced Sound Manager for Exercise Audio Feedback
class ExerciseSoundManager {
  constructor() {
    this.audioContext = null;
    this.isEnabled = localStorage.getItem('exerciseSoundsEnabled') !== 'false';
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

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
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime);
    
    switch (envelope) {
      case 'workout':
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + duration);
        break;
      case 'rest':
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
      default:
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    }
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Exercise-specific sounds
  playWorkoutStart() {
    // Energetic ascending tones
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.3, 'triangle', 'workout'), i * 100);
    });
  }

  playWorkoutComplete() {
    // Victory fanfare
    this.createTone(523.25, 0.3); // C5
    setTimeout(() => this.createTone(659.25, 0.3), 150); // E5
    setTimeout(() => this.createTone(783.99, 0.4), 300); // G5
    setTimeout(() => this.createTone(1046.50, 0.6), 450); // C6
  }

  playSetComplete() {
    // Quick success chime
    this.createTone(800, 0.15, 'triangle');
    setTimeout(() => this.createTone(1000, 0.15, 'triangle'), 100);
  }

  playRestPeriod() {
    // Gentle descending tones for rest
    this.createTone(400, 0.5, 'sine', 'rest');
    setTimeout(() => this.createTone(350, 0.5, 'sine', 'rest'), 250);
  }

  playCountdown(count) {
    // Different tones for countdown
    if (count <= 3) {
      this.createTone(800 + (count * 200), 0.2, 'square');
    } else {
      this.createTone(600, 0.15, 'triangle');
    }
  }

  playExerciseSwitch() {
    // Transition sound
    this.createTone(500, 0.1, 'triangle');
    setTimeout(() => this.createTone(700, 0.1, 'triangle'), 80);
  }

  playHeartbeat() {
    // Double beat like heartbeat
    this.createTone(60, 0.05, 'square');
    setTimeout(() => this.createTone(60, 0.05, 'square'), 100);
  }

  playProgressUp() {
    // Portfolio gain sound
    const notes = [220, 277.18, 329.63, 415.30];
    notes.forEach((note, i) => {
      setTimeout(() => this.createTone(note, 0.2, 'triangle'), i * 80);
    });
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('exerciseSoundsEnabled', this.isEnabled);
    if (this.isEnabled) {
      setTimeout(() => this.playSetComplete(), 100);
    }
  }
}

const ExercisesCore = () => {
  // Enhanced state management
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 47,
    totalTime: 1420, // minutes
    caloriesBurned: 3850,
    currentStreak: 12,
    personalBests: {},
    weeklyGoal: 5,
    weeklyCompleted: 3
  });
  
  // Robinhood-style portfolio state
  const [exercisePortfolio, setExercisePortfolio] = useState({
    totalValue: 2847.50,
    dailyChange: 67.25,
    changePercent: 2.42,
    investments: [
      { name: 'Strength Training', value: 1250.30, change: 34.50, percent: 2.84, color: '#00C805' },
      { name: 'Cardio Fitness', value: 890.75, change: 18.75, percent: 2.15, color: '#00C805' },
      { name: 'Flexibility', value: 456.25, change: 12.50, percent: 2.82, color: '#00C805' },
      { name: 'Recovery', value: 250.20, change: 1.50, percent: 0.60, color: '#00C805' }
    ]
  });

  // Sound manager
  const soundManager = useRef(new ExerciseSoundManager());
  
  // Workout programs with investment-style naming
  const workoutPrograms = [
    {
      id: 'strength_growth',
      name: 'Strength Growth Portfolio',
      subtitle: 'High-yield muscle investments',
      duration: 45,
      exercises: 3,
      difficulty: 'Intermediate',
      expectedReturn: '+12% strength gains',
      risk: 'Moderate',
      exercises: [
        {
          name: 'Push-up Compound',
          description: 'Classic upper body investment',
          sets: 3,
          reps: '12-15',
          restTime: 60,
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          instructions: [
            'Start in plank position with hands shoulder-width apart',
            'Lower chest to floor while keeping core tight',
            'Push back up to starting position',
            'Maintain straight line from head to heels'
          ],
          tips: 'Focus on controlled movement for maximum returns',
          calories: 8,
          difficulty: 'Beginner'
        },
        {
          name: 'Squat Equity Builder',
          description: 'Lower body strength accumulation',
          sets: 3,
          reps: '15-20',
          restTime: 90,
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
          instructions: [
            'Stand with feet shoulder-width apart',
            'Lower hips back and down as if sitting in chair',
            'Keep chest up and knees tracking over toes',
            'Drive through heels to return to standing'
          ],
          tips: 'Depth and form yield better dividends than speed',
          calories: 12,
          difficulty: 'Beginner'
        },
        {
          name: 'Plank Holdings',
          description: 'Core stability investment',
          sets: 3,
          reps: '30-60 seconds',
          restTime: 45,
          muscleGroups: ['Core', 'Shoulders'],
          instructions: [
            'Start in forearm plank position',
            'Keep body in straight line from head to heels',
            'Engage core and breathe steadily',
            'Hold for prescribed time'
          ],
          tips: 'Quality holds build long-term core value',
          calories: 6,
          difficulty: 'Intermediate'
        }
      ],
      color: '#00C805'
    },
    {
      id: 'cardio_momentum',
      name: 'Cardio Momentum Fund',
      subtitle: 'High-frequency heart investments',
      duration: 30,
      exercises: 2,
      difficulty: 'High',
      expectedReturn: '+15% cardiovascular gains',
      risk: 'High',
      exercises: [
        {
          name: 'Jumping Jack Futures',
          description: 'Full-body cardio investment',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          muscleGroups: ['Full Body'],
          instructions: [
            'Start standing with feet together, arms at sides',
            'Jump feet apart while raising arms overhead',
            'Jump back to starting position',
            'Maintain steady rhythm'
          ],
          tips: 'Consistent pace maximizes cardio returns',
          calories: 15,
          difficulty: 'Beginner'
        },
        {
          name: 'High-Knee Stock',
          description: 'Rapid-fire leg circulation',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          muscleGroups: ['Legs', 'Core'],
          instructions: [
            'Stand in place, engage core',
            'Lift knees to hip height alternately',
            'Pump arms naturally',
            'Maintain quick tempo'
          ],
          tips: 'Higher knees = higher returns',
          calories: 12,
          difficulty: 'Intermediate'
        }
      ],
      color: '#FF6B35'
    },
    {
      id: 'flexibility_bonds',
      name: 'Flexibility Bonds',
      subtitle: 'Safe, steady mobility returns',
      duration: 20,
      exercises: 1,
      difficulty: 'Low',
      expectedReturn: '+8% flexibility gains',
      risk: 'Low',
      exercises: [
        {
          name: 'Cat-Cow Securities',
          description: 'Spine mobility investment',
          sets: 2,
          reps: '10-15',
          restTime: 30,
          muscleGroups: ['Spine', 'Core'],
          instructions: [
            'Start on hands and knees',
            'Arch back and look up (Cow)',
            'Round spine and tuck chin (Cat)',
            'Move slowly and smoothly'
          ],
          tips: 'Slow, controlled movements yield best flexibility dividends',
          calories: 4,
          difficulty: 'Beginner'
        }
      ],
      color: '#6366F1'
    }
  ];

  // Timer management
  useEffect(() => {
    let interval = null;
    
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        if (restTimer > 0) {
          setRestTimer(prev => {
            if (prev <= 1) {
              soundManager.current.playCountdown(0);
              return 0;
            } else if (prev <= 4) {
              soundManager.current.playCountdown(prev - 1);
            }
            return prev - 1;
          });
        } else {
          setTimer(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive, isPaused, restTimer]);

  // Workout functions
  const startWorkout = (program) => {
    setActiveWorkout(program);
    setCurrentExercise(0);
    setCurrentSet(1);
    setTimer(0);
    setRestTimer(0);
    setIsWorkoutActive(true);
    setIsPaused(false);
    soundManager.current.playWorkoutStart();
  };

  const completeSet = () => {
    soundManager.current.playSetComplete();
    const currentExerciseData = activeWorkout.exercises[currentExercise];
    
    if (currentSet < currentExerciseData.sets) {
      setCurrentSet(prev => prev + 1);
      setRestTimer(currentExerciseData.restTime || 60);
      soundManager.current.playRestPeriod();
    } else {
      nextExercise();
    }
    
    // Update portfolio value
    const valueIncrease = Math.random() * 50 + 25;
    updateExercisePortfolio(valueIncrease);
  };

  const nextExercise = () => {
    if (currentExercise < activeWorkout.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setCurrentSet(1);
      setRestTimer(0);
      soundManager.current.playExerciseSwitch();
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    soundManager.current.playWorkoutComplete();
    setIsWorkoutActive(false);
    setActiveWorkout(null);
    
    // Update stats
    setWorkoutStats(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      totalTime: prev.totalTime + Math.floor(timer / 60),
      caloriesBurned: prev.caloriesBurned + 200,
      weeklyCompleted: Math.min(prev.weeklyCompleted + 1, prev.weeklyGoal)
    }));
    
    // Major portfolio boost
    updateExercisePortfolio(150 + Math.random() * 100);
  };

  const updateExercisePortfolio = (increase) => {
    setExercisePortfolio(prev => ({
      ...prev,
      totalValue: prev.totalValue + increase,
      dailyChange: prev.dailyChange + increase,
      changePercent: ((prev.dailyChange + increase) / prev.totalValue) * 100
    }));
    soundManager.current.playProgressUp();
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
    soundManager.current.playSetComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Return the Robinhood-style Exercise interface
  return (
    <div className="robinhood-exercises">
      {/* Exercise Portfolio Header */}
      <div className="exercise-portfolio-header">
        <div className="portfolio-summary">
          <div className="portfolio-title">
            <Dumbbell className="portfolio-icon" />
            <div>
              <h1>Fitness Portfolio</h1>
              <p>Your health investment dashboard</p>
            </div>
          </div>
          
          <div className="portfolio-value">
            <div className="total-value">${exercisePortfolio.totalValue.toLocaleString()}</div>
            <div className={`daily-change ${exercisePortfolio.dailyChange >= 0 ? 'positive' : 'negative'}`}>
              {exercisePortfolio.dailyChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              ${Math.abs(exercisePortfolio.dailyChange).toFixed(2)} ({exercisePortfolio.changePercent.toFixed(2)}%)
            </div>
          </div>

          <button 
            className="sound-toggle"
            onClick={() => soundManager.current.toggle()}
            title="Toggle exercise sounds"
          >
            {soundManager.current.isEnabled ? <Headphones /> : <VolumeX />}
          </button>
        </div>

        {/* Portfolio Chart */}
        <div className="portfolio-chart-mini">
          <svg width="100%" height="60" viewBox="0 0 200 60">
            <defs>
              <linearGradient id="exerciseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#00C805', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#00C805', stopOpacity: 0}} />
              </linearGradient>
            </defs>
            <path
              d="M0,40 Q50,30 100,25 T200,20"
              stroke="#00C805"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,40 Q50,30 100,25 T200,20 L200,60 L0,60 Z"
              fill="url(#exerciseGradient)"
            />
          </svg>
        </div>
      </div>

      {/* Workout Stats Cards */}
      <div className="workout-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Trophy color="#00C805" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{workoutStats.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock color="#FF6B35" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Math.floor(workoutStats.totalTime / 60)}h</div>
            <div className="stat-label">Time Invested</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Flame color="#FF4444" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{workoutStats.caloriesBurned.toLocaleString()}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target color="#6366F1" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{workoutStats.weeklyCompleted}/{workoutStats.weeklyGoal}</div>
            <div className="stat-label">Weekly Goal</div>
          </div>
        </div>
      </div>

      {/* Active Workout Interface */}
      {isWorkoutActive && activeWorkout && (
        <div className="active-workout-container">
          <div className="workout-header">
            <div className="workout-title">
              <h2>{activeWorkout.name}</h2>
              <p>Exercise {currentExercise + 1} of {activeWorkout.exercises.length}</p>
            </div>
            <div className="workout-timer">
              <div className="timer-display">{formatTime(timer)}</div>
              {restTimer > 0 && (
                <div className="rest-timer">
                  Rest: {restTimer}s
                </div>
              )}
            </div>
          </div>

          <div className="current-exercise">
            <div className="exercise-info">
              <h3>{activeWorkout.exercises[currentExercise]?.name}</h3>
              <p>{activeWorkout.exercises[currentExercise]?.description}</p>
              <div className="set-info">
                Set {currentSet} of {activeWorkout.exercises[currentExercise]?.sets} • {activeWorkout.exercises[currentExercise]?.reps} reps
              </div>
            </div>

            <div className="workout-controls">
              <button 
                className="control-btn secondary"
                onClick={pauseWorkout}
              >
                {isPaused ? <PlayCircle /> : <PauseCircle />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button 
                className="control-btn primary"
                onClick={completeSet}
                disabled={restTimer > 0}
              >
                <CheckCircle />
                Complete Set
              </button>

              <button 
                className="control-btn secondary"
                onClick={nextExercise}
              >
                <SkipForward />
                Skip Exercise
              </button>
            </div>
          </div>

          {restTimer > 0 && (
            <div className="rest-period">
              <div className="rest-circle">
                <div className="rest-countdown">{restTimer}</div>
                <div className="rest-label">Rest Time</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workout Programs */}
      {!isWorkoutActive && (
        <div className="workout-programs">
          <div className="programs-header">
            <h2>Investment Programs</h2>
            <p>Choose your fitness investment strategy</p>
          </div>

          <div className="programs-grid">
            {workoutPrograms.map(program => (
              <div key={program.id} className="program-card">
                <div className="program-header">
                  <div className="program-title">
                    <h3>{program.name}</h3>
                    <p>{program.subtitle}</p>
                  </div>
                  <div className="program-badge" style={{backgroundColor: program.color}}>
                    {program.difficulty}
                  </div>
                </div>

                <div className="program-stats">
                  <div className="stat">
                    <Clock size={16} />
                    <span>{program.duration} min</span>
                  </div>
                  <div className="stat">
                    <Activity size={16} />
                    <span>{program.exercises.length} exercises</span>
                  </div>
                  <div className="stat">
                    <TrendingUp size={16} />
                    <span>{program.expectedReturn}</span>
                  </div>
                </div>

                <div className="program-risk">
                  <span className="risk-label">Risk Level:</span>
                  <span className={`risk-value ${program.risk.toLowerCase()}`}>{program.risk}</span>
                </div>

                <button 
                  className="start-workout-btn"
                  onClick={() => startWorkout(program)}
                >
                  <PlayCircle />
                  Start Investment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Holdings */}
      <div className="exercise-holdings">
        <div className="holdings-header">
          <h2>Your Fitness Holdings</h2>
          <button className="view-all-btn">
            View All
          </button>
        </div>

        <div className="holdings-list">
          {exercisePortfolio.investments.map((investment, index) => (
            <div key={investment.name} className="holding-item">
              <div className="holding-info">
                <div className="holding-name">{investment.name}</div>
                <div className="holding-subtitle">Fitness Investment</div>
              </div>
              
              <div className="holding-chart">
                <LineChart size={24} color={investment.color} />
              </div>
              
              <div className="holding-values">
                <div className="holding-value">${investment.value.toLocaleString()}</div>
                <div className={`holding-change ${investment.change >= 0 ? 'positive' : 'negative'}`}>
                  +${investment.change.toFixed(2)} ({investment.percent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="exercise-quick-actions">
        <button 
          className="quick-action-btn"
          onClick={() => soundManager.current.playWorkoutStart()}
        >
          <PlayCircle />
          <span>Quick Start</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => soundManager.current.playProgressUp()}
        >
          <BarChart3 />
          <span>Progress</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => soundManager.current.playSetComplete()}
        >
          <Trophy />
          <span>Achievements</span>
        </button>
        
        <button 
          className="quick-action-btn"
          onClick={() => soundManager.current.playHeartbeat()}
        >
          <Heart />
          <span>Heart Rate</span>
        </button>
      </div>
    </div>
  );
};

// Export the component with error boundary
const Exercises = () => (
  <UltraSafeRenderer>
    <ExercisesCore />
  </UltraSafeRenderer>
);

export default Exercises;