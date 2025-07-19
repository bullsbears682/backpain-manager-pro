import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Skip, Volume2, VolumeX, Settings } from 'lucide-react';

const ExerciseTimer = ({ 
  exercise, 
  onComplete, 
  onClose,
  autoStart = false 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(exercise?.duration || 0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRestMode, setIsRestMode] = useState(false);
  const [restDuration, setRestDuration] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (exercise) {
      setTimeRemaining(exercise.duration);
      setCurrentSet(1);
      setIsRestMode(false);
    }
  }, [exercise]);

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (soundEnabled) {
      // Play completion sound
      const audio = new Audio('data:audio/wav;base64,UklGRhwBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQgBAAC6MjHAVTEywFUxMsBVMTLAVTEywFUxMsBVMTLAVTEywFUxMr==');
      audio.play().catch(() => {}); // Ignore audio errors
    }

    if (isRestMode) {
      // Rest period completed, start next set
      setIsRestMode(false);
      setCurrentSet(prev => prev + 1);
      setTimeRemaining(exercise.duration);
      setIsRunning(true);
    } else {
      // Exercise set completed
      if (currentSet < exercise.sets) {
        // Start rest period
        setIsRestMode(true);
        setTimeRemaining(restDuration);
        setIsRunning(true);
      } else {
        // All sets completed
        onComplete();
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSet(1);
    setIsRestMode(false);
    setTimeRemaining(exercise.duration);
  };

  const skipCurrentPhase = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isRestMode) return '#10b981'; // Green for rest
    if (timeRemaining <= 10) return '#ef4444'; // Red for last 10 seconds
    return '#6366f1'; // Blue for exercise
  };

  const getProgressPercentage = () => {
    const totalTime = isRestMode ? restDuration : exercise.duration;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  if (!exercise) return null;

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--border-radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      maxWidth: '400px',
      width: '100%',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.25rem', 
          fontWeight: '700',
          color: 'var(--text-primary)'
        }}>
          {exercise.name}
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            color: 'var(--text-secondary)'
          }}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1rem',
          zIndex: 10,
          minWidth: '200px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Rest Duration (seconds)
            </label>
            <input
              type="number"
              value={restDuration}
              onChange={(e) => setRestDuration(Number(e.target.value))}
              min="10"
              max="300"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid var(--border-primary)',
                borderRadius: '0.375rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: soundEnabled ? 'var(--primary-600)' : 'var(--text-secondary)'
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span style={{ fontSize: '0.875rem' }}>Sound alerts</span>
          </div>
        </div>
      )}

      {/* Progress Ring */}
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        margin: '0 auto 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg
          width="200"
          height="200"
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={getTimerColor()}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: getTimerColor(),
            lineHeight: 1,
            marginBottom: '0.5rem'
          }}>
            {formatTime(timeRemaining)}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {isRestMode ? 'REST TIME' : 'EXERCISE TIME'}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: '0.25rem'
          }}>
            Set {currentSet} of {exercise.sets}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={toggleTimer}
          className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`}
          style={{
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={resetTimer}
          className="btn btn-secondary"
          style={{
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={skipCurrentPhase}
          className="btn btn-secondary"
          style={{
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Skip size={20} />
        </button>
      </div>

      {/* Exercise Information */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
            <br />
            <span style={{ fontWeight: '600' }}>{formatTime(exercise.duration)}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Reps:</span>
            <br />
            <span style={{ fontWeight: '600' }}>{exercise.reps}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Calories:</span>
            <br />
            <span style={{ fontWeight: '600' }}>{exercise.caloriesBurned || 0}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Equipment:</span>
            <br />
            <span style={{ fontWeight: '600' }}>{exercise.equipment || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Quick Instructions */}
      <div style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.5
      }}>
        {isRestMode ? (
          <div>
            <strong>Rest Time:</strong> Relax and prepare for the next set
          </div>
        ) : (
          <div>
            <strong>Current Exercise:</strong> {exercise.description}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={onClose}
          className="btn btn-secondary"
          style={{ flex: 1 }}
        >
          Close
        </button>
        <button
          onClick={onComplete}
          className="btn btn-success"
          style={{ flex: 1 }}
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default ExerciseTimer;