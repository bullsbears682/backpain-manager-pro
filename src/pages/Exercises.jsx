import React, { useState, useEffect, useMemo } from 'react';
import { useExercises } from '../hooks/useData';
import SafeRenderer from '../components/SafeRenderer';
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
  AlertTriangle
} from 'lucide-react';

const Exercises = () => {
  // ULTRA-SAFE EXERCISE DATA LOADING
  let exerciseData = null;
  let safeExercises = [];
  
  try {
    const hookResult = useExercises();
    exerciseData = hookResult || {};
    const rawExercises = exerciseData.exercises;
    safeExercises = (rawExercises && Array.isArray(rawExercises)) ? rawExercises : [];
  } catch (error) {
    console.error('Error loading exercises:', error);
    safeExercises = [];
  }

  // SAFE STATE INITIALIZATION
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRestMode, setIsRestMode] = useState(false);
  const [restTime, setRestTime] = useState(30);
  
  // Filtering and search - SAFE DEFAULTS
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterPainLevel, setFilterPainLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  
  // Exercise tracking - SAFE DEFAULTS
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [favoriteExercises, setFavoriteExercises] = useState(new Set());
  const [exerciseHistory, setExerciseHistory] = useState([]);
  
  // UI states - SAFE DEFAULTS
  const [showFilters, setShowFilters] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SAFE CONSTANTS - GUARANTEED TO BE ARRAYS
  const categories = ['All', 'Flexibility', 'Strengthening', 'Mobility', 'Aerobic', 'Balance', 'Relaxation', 'Mind-Body', 'Functional', 'Workplace', 'Recovery', 'Dynamic', 'Posture'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const painLevels = ['All', 'High', 'Medium', 'Low'];
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'duration', label: 'Duration' },
    { value: 'calories', label: 'Calories' },
    { value: 'painRelief', label: 'Pain Relief' }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('completedExercises');
      const savedFavorites = localStorage.getItem('favoriteExercises');
      const savedHistory = localStorage.getItem('exerciseHistory');
      
      if (savedCompleted) setCompletedExercises(new Set(JSON.parse(savedCompleted)));
      if (savedFavorites) setFavoriteExercises(new Set(JSON.parse(savedFavorites)));
      if (savedHistory) setExerciseHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    
    // Set loading to false after a brief delay to ensure exercises are loaded
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('completedExercises', JSON.stringify([...completedExercises]));
    } catch (error) {
      console.error('Error saving completed exercises:', error);
    }
  }, [completedExercises]);

  useEffect(() => {
    try {
      localStorage.setItem('favoriteExercises', JSON.stringify([...favoriteExercises]));
    } catch (error) {
      console.error('Error saving favorite exercises:', error);
    }
  }, [favoriteExercises]);

  useEffect(() => {
    try {
      localStorage.setItem('exerciseHistory', JSON.stringify(exerciseHistory));
    } catch (error) {
      console.error('Error saving exercise history:', error);
    }
  }, [exerciseHistory]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const handleTimerComplete = () => {
    if (isRestMode) {
      setIsRestMode(false);
      setCurrentSet(prev => prev + 1);
      if (selectedExercise) {
        setTimeRemaining(selectedExercise.duration);
      }
    } else {
      // Exercise set completed
      if (selectedExercise && currentSet < selectedExercise.sets) {
        setIsRestMode(true);
        setTimeRemaining(restTime);
        setIsTimerRunning(true);
      } else {
        // All sets completed
        completeExercise();
      }
    }
  };

  // ULTRA-SAFE Filtered and sorted exercises
  const filteredExercises = useMemo(() => {
    try {
      if (!safeExercises || !Array.isArray(safeExercises) || safeExercises.length === 0) {
        return [];
      }
      
      let filtered = safeExercises.filter(exercise => {
        // Safety checks for exercise properties
        if (!exercise || typeof exercise !== 'object') return false;
        
        const matchesCategory = filterCategory === 'All' || exercise.category === filterCategory;
        const matchesDifficulty = filterDifficulty === 'All' || exercise.difficulty === filterDifficulty;
        const matchesPainLevel = filterPainLevel === 'All' || exercise.painReliefLevel === filterPainLevel;
        
        const exerciseName = exercise.name || '';
        const exerciseDescription = exercise.description || '';
        const exerciseTargetAreas = Array.isArray(exercise.targetAreas) ? exercise.targetAreas : [];
        
        const matchesSearch = exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             exerciseDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             exerciseTargetAreas.some(area => 
                               typeof area === 'string' && area.toLowerCase().includes(searchTerm.toLowerCase())
                             );
        
        return matchesCategory && matchesDifficulty && matchesPainLevel && matchesSearch;
      });

      // Sort exercises
      filtered.sort((a, b) => {
        try {
          switch (sortBy) {
            case 'name':
              return (a.name || '').localeCompare(b.name || '');
            case 'difficulty':
              const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
              return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
            case 'duration':
              return (a.duration || 0) - (b.duration || 0);
            case 'calories':
              return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
            case 'painRelief':
              const painOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
              return (painOrder[b.painReliefLevel] || 0) - (painOrder[a.painReliefLevel] || 0);
            default:
              return 0;
          }
        } catch (error) {
          console.error('Error sorting exercises:', error);
          return 0;
        }
      });

      return filtered;
    } catch (error) {
      console.error('Error filtering exercises:', error);
      return [];
    }
  }, [safeExercises, filterCategory, filterDifficulty, filterPainLevel, searchTerm, sortBy]);

  // Function to sanitize exercise data
  const sanitizeExercise = (exercise) => {
    if (!exercise) return null;
    
    return {
      ...exercise,
      instructions: Array.isArray(exercise.instructions) ? exercise.instructions : [],
      benefits: Array.isArray(exercise.benefits) ? exercise.benefits : [],
      precautions: Array.isArray(exercise.precautions) ? exercise.precautions : [],
      modifications: Array.isArray(exercise.modifications) ? exercise.modifications : [],
      targetAreas: Array.isArray(exercise.targetAreas) ? exercise.targetAreas : []
    };
  };

  const startExercise = (exercise) => {
    try {
      const sanitizedExercise = sanitizeExercise(exercise);
      setSelectedExercise(sanitizedExercise);
      setTimeRemaining(exercise.duration || 0);
      setCurrentSet(1);
      setIsRestMode(false);
      setIsTimerRunning(false);
      setShowExerciseModal(true);
    } catch (error) {
      console.error('Error starting exercise:', error);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    try {
      if (selectedExercise) {
        setTimeRemaining(selectedExercise.duration || 0);
        setCurrentSet(1);
        setIsRestMode(false);
        setIsTimerRunning(false);
      }
    } catch (error) {
      console.error('Error resetting timer:', error);
    }
  };

  const completeExercise = () => {
    try {
      if (selectedExercise) {
        setCompletedExercises(prev => new Set([...prev, selectedExercise.id]));
        
        // Add to history
        const historyEntry = {
          exerciseId: selectedExercise.id,
          exerciseName: selectedExercise.name,
          completedAt: new Date().toISOString(),
          duration: selectedExercise.duration,
          sets: selectedExercise.sets,
          caloriesBurned: selectedExercise.caloriesBurned || 0
        };
        
        setExerciseHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
        setShowExerciseModal(false);
        setSelectedExercise(null);
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const toggleFavorite = (exerciseId) => {
    try {
      setFavoriteExercises(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(exerciseId)) {
          newFavorites.delete(exerciseId);
        } else {
          newFavorites.add(exerciseId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatTime = (seconds) => {
    try {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '0:00';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPainReliefColor = (level) => {
    switch (level) {
      case 'High': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Exercise Library</h2>
          <p>Comprehensive back pain relief exercises and wellness routines</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#059669'
          }}>
            {filteredExercises.length} Exercises Available
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      {showFilters && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Search Exercises</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, description, or target area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories && Array.isArray(categories) ? categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                )) : null}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                {difficulties && Array.isArray(difficulties) ? difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                )) : null}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pain Relief</label>
              <select
                className="form-select"
                value={filterPainLevel}
                onChange={(e) => setFilterPainLevel(e.target.value)}
              >
                {painLevels && Array.isArray(painLevels) ? painLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                )) : null}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions && Array.isArray(sortOptions) ? sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                )) : null}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">View Mode</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  style={{ flex: 1 }}
                >
                  Grid
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('list')}
                  style={{ flex: 1 }}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#6366f1' }}>
            {completedExercises.size}
          </div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {favoriteExercises.size}
          </div>
          <div className="stat-label">Favorite Exercises</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {exerciseHistory.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0)}
          </div>
          <div className="stat-label">Calories Burned (Total)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {Math.floor(exerciseHistory.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60)}
          </div>
          <div className="stat-label">Minutes Exercised</div>
        </div>
      </div>

      {/* Exercise Grid/List */}
      <SafeRenderer fallback={
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertTriangle size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: '#ef4444' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Exercise Loading Error</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Unable to load exercises. Please refresh the page.
          </p>
        </div>
      }>
        <div className={viewMode === 'grid' ? 'grid-3' : ''}>
          {isLoading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw size={48} style={{ opacity: 0.3, marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Loading exercises...</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Please wait while we load your exercise library.
            </p>
          </div>
        ) : filteredExercises && Array.isArray(filteredExercises) && filteredExercises.length > 0 ? filteredExercises.map(exercise => {
          // Additional safety check for each exercise
          if (!exercise || typeof exercise !== 'object' || !exercise.id) {
            return null;
          }
          
          return (
          <div key={exercise.id} className="exercise-card" style={{ position: 'relative' }}>
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(exercise.id)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'all var(--transition-normal)'
              }}
            >
              {favoriteExercises.has(exercise.id) ? (
                <BookmarkCheck size={18} style={{ color: '#f59e0b' }} />
              ) : (
                <Bookmark size={18} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>

            {/* Completion badge */}
            {completedExercises.has(exercise.id) && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: '#10b981',
                color: 'white',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}>
                <CheckCircle size={16} />
              </div>
            )}

            <div className="exercise-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{exercise.imageUrl}</span>
                  <div>
                    <h3 className="exercise-title">{exercise.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {exercise.subcategory}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="exercise-category">{exercise.category}</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: `${getDifficultyColor(exercise.difficulty)}20`,
                    color: getDifficultyColor(exercise.difficulty)
                  }}>
                    {exercise.difficulty}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: `${getPainReliefColor(exercise.painReliefLevel)}20`,
                    color: getPainReliefColor(exercise.painReliefLevel)
                  }}>
                    {exercise.painReliefLevel} Relief
                  </span>
                </div>
              </div>
            </div>

            <div className="exercise-meta" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                <span>{Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Target size={14} />
                <span>{exercise.sets} sets × {exercise.reps}</span>
              </div>
              {exercise.caloriesBurned && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Zap size={14} />
                  <span>{exercise.caloriesBurned} cal</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Heart size={14} />
                <span>{exercise.equipment || 'No equipment'}</span>
              </div>
            </div>

            <div className="exercise-description">
              {exercise.description}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Target Areas:
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {exercise.targetAreas && Array.isArray(exercise.targetAreas) ? exercise.targetAreas.map(area => (
                  <span key={area} style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {area}
                  </span>
                )) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    No target areas specified
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => startExercise(exercise)}
                style={{ flex: 1 }}
              >
                <Play size={16} />
                Start Exercise
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const sanitizedExercise = sanitizeExercise(exercise);
                  setSelectedExercise(sanitizedExercise);
                  setShowExerciseModal(true);
                }}
                style={{ padding: '0.75rem' }}
              >
                <Info size={16} />
              </button>
            </div>
          </div>
          );
        }) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Activity size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No exercises available</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              No exercises found with current filters.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Exercise Modal */}
      {showExerciseModal && selectedExercise && (
        <div className="modal-overlay" onClick={() => setShowExerciseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{selectedExercise.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedExercise.category} • {selectedExercise.difficulty}
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowExerciseModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
              {/* Exercise Details */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Description</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {selectedExercise.description}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Instructions</h4>
                  <ol className="exercise-instructions">
                    {(() => {
                      try {
                        const instructions = selectedExercise?.instructions;
                        if (instructions && Array.isArray(instructions) && instructions.length > 0) {
                          return instructions.map((instruction, index) => (
                            <li key={`instruction-${index}`}>{instruction || `Step ${index + 1}`}</li>
                          ));
                        }
                        return <li>No instructions available</li>;
                      } catch (error) {
                        console.error('Error rendering instructions:', error);
                        return <li>Error loading instructions</li>;
                      }
                    })()}
                  </ol>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Benefits</h4>
                  <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                    {(() => {
                      try {
                        const benefits = selectedExercise?.benefits;
                        if (benefits && Array.isArray(benefits) && benefits.length > 0) {
                          return benefits.map((benefit, index) => (
                            <li key={`benefit-${index}`}>{benefit || `Benefit ${index + 1}`}</li>
                          ));
                        }
                        return <li>No benefits listed</li>;
                      } catch (error) {
                        console.error('Error rendering benefits:', error);
                        return <li>Error loading benefits</li>;
                      }
                    })()}
                  </ul>
                </div>

                {(() => {
                  try {
                    const precautions = selectedExercise?.precautions;
                    if (precautions && Array.isArray(precautions) && precautions.length > 0) {
                      return (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Precautions</h4>
                          <ul style={{ paddingLeft: '1.5rem', color: 'var(--warning-600)' }}>
                            {precautions.map((precaution, index) => (
                              <li key={`precaution-${index}`}>{precaution || `Precaution ${index + 1}`}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  } catch (error) {
                    console.error('Error rendering precautions:', error);
                    return null;
                  }
                })()}

                {(() => {
                  try {
                    const modifications = selectedExercise?.modifications;
                    if (modifications && Array.isArray(modifications) && modifications.length > 0) {
                      return (
                        <div>
                          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Modifications</h4>
                          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                            {modifications.map((modification, index) => (
                              <li key={`modification-${index}`}>{modification || `Modification ${index + 1}`}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  } catch (error) {
                    console.error('Error rendering modifications:', error);
                    return null;
                  }
                })()}
              </div>

              {/* Timer and Controls */}
              <div>
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-lg)',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-600)', marginBottom: '0.5rem' }}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {isRestMode ? `Rest Time (Set ${currentSet}/${selectedExercise.sets})` : `Set ${currentSet}/${selectedExercise.sets}`}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      className={`btn ${isTimerRunning ? 'btn-danger' : 'btn-primary'}`}
                      onClick={toggleTimer}
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

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Exercise Stats</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div>Duration: {formatTime(selectedExercise.duration)}</div>
                    <div>Sets: {selectedExercise.sets}</div>
                    <div>Reps: {selectedExercise.reps}</div>
                    <div>Calories: {selectedExercise.caloriesBurned || 0}</div>
                  </div>
                </div>

                <button
                  className="btn btn-success"
                  onClick={completeExercise}
                  style={{ width: '100%' }}
                >
                  <CheckCircle size={16} />
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && filteredExercises.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No exercises found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
        </div>
      </SafeRenderer>
    </div>
  );
};

export default Exercises;