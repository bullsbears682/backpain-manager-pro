import React, { useState, useEffect } from 'react';
import { useExercises } from '../hooks/useData';
import { Play, Pause, RotateCcw, Clock, Award, Filter, Search } from 'lucide-react';

const Exercises = () => {
  const { exercises } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Flexibility', 'Strengthening', 'Mobility', 'Stretching'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = filterCategory === 'All' || exercise.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'All' || exercise.difficulty === filterDifficulty;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setIsTimerRunning(false);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(selectedExercise?.duration || 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#48bb78';
      case 'Intermediate': return '#ed8936';
      case 'Advanced': return '#f56565';
      default: return '#667eea';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Flexibility': return '#667eea';
      case 'Strengthening': return '#f56565';
      case 'Mobility': return '#48bb78';
      case 'Stretching': return '#ed8936';
      default: return '#718096';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Exercise Library</h2>
        <p>Guided exercises designed specifically for back pain relief and prevention</p>
      </div>

      {/* Exercise Player Modal */}
      {selectedExercise && (
        <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedExercise.name}</h3>
              <button className="modal-close" onClick={() => setSelectedExercise(null)}>
                ×
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '1rem'
              }}>
                {formatTime(timeRemaining)}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary"
                  onClick={toggleTimer}
                  disabled={timeRemaining === 0}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-secondary" onClick={resetTimer}>
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>Instructions:</h4>
              <ol className="exercise-instructions">
                {selectedExercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>Benefits:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedExercise.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#48bb78',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {timeRemaining === 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f0fff4',
                border: '2px solid #48bb78',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <Award size={24} color="#48bb78" style={{ marginBottom: '0.5rem' }} />
                <div style={{ color: '#2d3748', fontWeight: '600' }}>
                  Exercise completed! Great job!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} color="#718096" />
              <input
                type="text"
                placeholder="Search exercises..."
                className="form-input"
                style={{ width: '200px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="#718096" />
              <select
                className="form-select"
                style={{ width: '150px' }}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <select
              className="form-select"
              style={{ width: '150px' }}
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-3">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-header">
              <h3 className="exercise-title">{exercise.name}</h3>
              <span 
                className="exercise-category"
                style={{ backgroundColor: getCategoryColor(exercise.category) }}
              >
                {exercise.category}
              </span>
            </div>
            
            <div className="exercise-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ 
                color: getDifficultyColor(exercise.difficulty),
                fontWeight: '600'
              }}>
                {exercise.difficulty}
              </div>
            </div>
            
            <p className="exercise-description">{exercise.description}</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2d3748' }}>
                Benefits:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {exercise.benefits.slice(0, 2).map((benefit, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.125rem 0.5rem',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    {benefit}
                  </span>
                ))}
                {exercise.benefits.length > 2 && (
                  <span style={{ fontSize: '0.75rem', color: '#718096' }}>
                    +{exercise.benefits.length - 2} more
                  </span>
                )}
              </div>
            </div>
            
            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => startExercise(exercise)}
            >
              <Play size={16} />
              Start Exercise
            </button>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="card">
          <div className="card-content">
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
              No exercises found matching your criteria. Try adjusting your filters or search term.
            </p>
          </div>
        </div>
      )}

      {/* Exercise Stats */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Exercise Statistics</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-4">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                {exercises.length}
              </div>
              <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                Total Exercises
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#48bb78' }}>
                {exercises.filter(ex => ex.difficulty === 'Beginner').length}
              </div>
              <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                Beginner Level
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ed8936' }}>
                {exercises.filter(ex => ex.difficulty === 'Intermediate').length}
              </div>
              <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                Intermediate Level
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f56565' }}>
                {exercises.filter(ex => ex.difficulty === 'Advanced').length}
              </div>
              <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                Advanced Level
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercises;