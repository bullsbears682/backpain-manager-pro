import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Advanced Sound & Music Manager
class HealthAudioManager {
  constructor() {
    this.audioContext = null;
    this.musicGainNode = null;
    this.effectsGainNode = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGainNode = this.audioContext.createGain();
      this.effectsGainNode = this.audioContext.createGain();
      
      this.musicGainNode.connect(this.audioContext.destination);
      this.effectsGainNode.connect(this.audioContext.destination);
      
      this.musicGainNode.gain.value = 0.3;
      this.effectsGainNode.gain.value = 0.5;
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  // Therapeutic tones for pain relief
  playTherapeuticTone(frequency, duration = 3000, type = 'sine') {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.musicGainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + duration / 1000 - 0.5);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // Binaural beats for relaxation
  playBinauralBeats(baseFreq = 200, beatFreq = 10, duration = 5000) {
    if (!this.audioContext) return;
    
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    const gain2 = this.audioContext.createGain();
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.musicGainNode);
    gain2.connect(this.musicGainNode);
    
    osc1.frequency.value = baseFreq;
    osc2.frequency.value = baseFreq + beatFreq;
    
    gain1.gain.value = 0.1;
    gain2.gain.value = 0.1;
    
    osc1.start();
    osc2.start();
    
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, duration);
  }

  // UI Sound Effects
  playSuccess() {
    this.playTone(523, 150); // C5
    setTimeout(() => this.playTone(659, 150), 100); // E5
    setTimeout(() => this.playTone(784, 200), 200); // G5
  }

  playError() {
    this.playTone(220, 300); // A3
    setTimeout(() => this.playTone(196, 300), 150); // G3
  }

  playClick() {
    this.playTone(800, 50, 'square');
  }

  playNotification() {
    this.playTone(1000, 100);
    setTimeout(() => this.playTone(1200, 100), 120);
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.effectsGainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // Ambient healing sounds
  playAmbientHealing(type = 'rain') {
    const frequencies = {
      rain: [200, 400, 600, 800],
      ocean: [100, 150, 200, 300],
      forest: [300, 500, 700, 900]
    };
    
    const freqs = frequencies[type] || frequencies.rain;
    freqs.forEach((freq, index) => {
      setTimeout(() => {
        this.playTherapeuticTone(freq + Math.random() * 50, 2000 + Math.random() * 1000);
      }, index * 500);
    });
  }

  setMusicVolume(volume) {
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = volume;
    }
  }

  setEffectsVolume(volume) {
    if (this.effectsGainNode) {
      this.effectsGainNode.gain.value = volume;
    }
  }
}

// Main Healthcare App
function App() {
  // Core State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'Patient',
    age: 35,
    painLevel: 3,
    recoveryGoal: 'Reduce chronic back pain',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Health Tracking
  const [healthMetrics, setHealthMetrics] = useState({
    painLevel: 3,
    mobilityScore: 65,
    sleepQuality: 7,
    energyLevel: 6,
    stressLevel: 4,
    overallWellness: 68,
    mood: 7,
    hydration: 6
  });

  // Exercise & Progress
  const [currentExercise, setCurrentExercise] = useState(null);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [streakDays, setStreakDays] = useState(5);

  // UI State
  const [notifications, setNotifications] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.5);
  const [selectedBodyPart, setSelectedBodyPart] = useState('back');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [exerciseGoal, setExerciseGoal] = useState(3);
  const [lastBackup, setLastBackup] = useState(null);

  // Refs
  const audioManager = useRef(new HealthAudioManager());
  const timerRef = useRef(null);

  // Comprehensive Exercise Database
  const exerciseDatabase = {
    back: [
      {
        id: 'b1',
        name: 'Gentle Cat-Cow Stretch',
        description: 'Improve spinal flexibility and reduce lower back tension',
        duration: 60,
        sets: 3,
        restTime: 30,
        difficulty: 'Beginner',
        painReduction: 8,
        instructions: ['Start on hands and knees', 'Arch back up like a cat', 'Lower belly, lift chest', 'Repeat slowly'],
        benefits: ['Spinal mobility', 'Pain relief', 'Posture improvement'],
        precautions: ['Move slowly', 'Stop if sharp pain occurs'],
        category: 'Flexibility'
      },
      {
        id: 'b2',
        name: 'Pelvic Tilts',
        description: 'Strengthen core and reduce lower back pain',
        duration: 45,
        sets: 2,
        restTime: 20,
        difficulty: 'Beginner',
        painReduction: 7,
        instructions: ['Lie on back, knees bent', 'Tighten abdominal muscles', 'Tilt pelvis upward', 'Hold for 5 seconds'],
        benefits: ['Core strength', 'Lower back support', 'Posture'],
        precautions: ['Keep movements controlled'],
        category: 'Strengthening'
      },
      {
        id: 'b3',
        name: 'Knee-to-Chest Stretch',
        description: 'Relieve lower back tension and improve flexibility',
        duration: 90,
        sets: 3,
        restTime: 15,
        difficulty: 'Beginner',
        painReduction: 9,
        instructions: ['Lie on back', 'Bring one knee to chest', 'Hold with both hands', 'Switch legs'],
        benefits: ['Hip flexibility', 'Lower back relief', 'Muscle relaxation'],
        precautions: ['Pull gently', 'Avoid bouncing'],
        category: 'Flexibility'
      },
      {
        id: 'b4',
        name: 'Bird Dog Exercise',
        description: 'Strengthen core and improve back stability',
        duration: 120,
        sets: 3,
        restTime: 45,
        difficulty: 'Intermediate',
        painReduction: 8,
        instructions: ['Start on hands and knees', 'Extend opposite arm and leg', 'Hold position', 'Switch sides'],
        benefits: ['Core stability', 'Balance', 'Back strength'],
        precautions: ['Keep hips level', 'Move slowly'],
        category: 'Strengthening'
      }
    ],
    neck: [
      {
        id: 'n1',
        name: 'Neck Rotations',
        description: 'Gentle circular movements to reduce neck stiffness',
        duration: 45,
        sets: 2,
        restTime: 20,
        difficulty: 'Beginner',
        painReduction: 7,
        instructions: ['Sit or stand straight', 'Slowly rotate head clockwise', 'Complete 5 rotations', 'Reverse direction'],
        benefits: ['Neck mobility', 'Tension relief', 'Blood circulation'],
        precautions: ['Move very slowly', 'Stop if dizzy'],
        category: 'Mobility'
      },
      {
        id: 'n2',
        name: 'Chin Tucks',
        description: 'Strengthen neck muscles and improve posture',
        duration: 60,
        sets: 3,
        restTime: 30,
        difficulty: 'Beginner',
        painReduction: 6,
        instructions: ['Sit with back straight', 'Pull chin back', 'Create double chin', 'Hold for 5 seconds'],
        benefits: ['Posture correction', 'Neck strength', 'Forward head posture'],
        precautions: ['Gentle movements only'],
        category: 'Strengthening'
      }
    ],
    shoulders: [
      {
        id: 's1',
        name: 'Shoulder Blade Squeezes',
        description: 'Strengthen upper back and reduce shoulder tension',
        duration: 60,
        sets: 3,
        restTime: 30,
        difficulty: 'Beginner',
        painReduction: 7,
        instructions: ['Sit or stand straight', 'Squeeze shoulder blades together', 'Hold for 5 seconds', 'Release slowly'],
        benefits: ['Upper back strength', 'Posture', 'Shoulder stability'],
        precautions: ['Avoid over-squeezing'],
        category: 'Strengthening'
      },
      {
        id: 's2',
        name: 'Arm Circles',
        description: 'Improve shoulder mobility and circulation',
        duration: 90,
        sets: 2,
        restTime: 20,
        difficulty: 'Beginner',
        painReduction: 6,
        instructions: ['Stand with arms extended', 'Make small circles forward', 'Gradually increase size', 'Reverse direction'],
        benefits: ['Shoulder mobility', 'Blood flow', 'Joint health'],
        precautions: ['Start small', 'Avoid pain'],
        category: 'Mobility'
      }
    ],
    hips: [
      {
        id: 'h1',
        name: 'Hip Flexor Stretch',
        description: 'Release tight hip flexors and improve mobility',
        duration: 120,
        sets: 2,
        restTime: 30,
        difficulty: 'Intermediate',
        painReduction: 8,
        instructions: ['Kneel on one knee', 'Step other foot forward', 'Push hips forward gently', 'Switch sides'],
        benefits: ['Hip flexibility', 'Lower back relief', 'Posture'],
        precautions: ['Use support if needed', 'Gentle stretch only'],
        category: 'Flexibility'
      }
    ],
    legs: [
      {
        id: 'l1',
        name: 'Calf Raises',
        description: 'Strengthen lower legs and improve circulation',
        duration: 90,
        sets: 3,
        restTime: 45,
        difficulty: 'Beginner',
        painReduction: 5,
        instructions: ['Stand straight', 'Rise onto toes', 'Hold briefly', 'Lower slowly'],
        benefits: ['Calf strength', 'Circulation', 'Balance'],
        precautions: ['Use wall for balance'],
        category: 'Strengthening'
      }
    ],
    fullBody: [
      {
        id: 'f1',
        name: 'Gentle Yoga Flow',
        description: 'Full body stretching and relaxation sequence',
        duration: 300,
        sets: 1,
        restTime: 60,
        difficulty: 'Intermediate',
        painReduction: 9,
        instructions: ['Child\'s pose', 'Cat-cow stretches', 'Downward dog', 'Gentle twists'],
        benefits: ['Full body flexibility', 'Stress relief', 'Mind-body connection'],
        precautions: ['Listen to your body', 'Modify as needed'],
        category: 'Flexibility'
      },
      {
        id: 'f2',
        name: 'Breathing Meditation',
        description: 'Deep breathing exercise for pain management',
        duration: 180,
        sets: 1,
        restTime: 0,
        difficulty: 'Beginner',
        painReduction: 8,
        instructions: ['Sit comfortably', 'Breathe in for 4 counts', 'Hold for 4 counts', 'Exhale for 6 counts'],
        benefits: ['Stress reduction', 'Pain management', 'Mental clarity'],
        precautions: ['Don\'t force breathing'],
        category: 'Mindfulness'
      }
    ]
  };

  // Timer Effects
  useEffect(() => {
    if (isExercising && exerciseTimer > 0) {
      timerRef.current = setInterval(() => {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            completeSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isResting && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            startNextSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isExercising, isResting, exerciseTimer, restTimer]);

  // Functions
  const startExercise = (exercise) => {
    audioManager.current.playClick();
    setCurrentExercise(exercise);
    setExerciseTimer(exercise.duration);
    setCurrentSet(1);
    setIsExercising(true);
    setIsResting(false);
    showNotification(`Starting ${exercise.name}`, 'info');
    
    // Play therapeutic tone for focus
    audioManager.current.playTherapeuticTone(528, 2000); // 528 Hz healing frequency
  };

  const completeSet = () => {
    audioManager.current.playSuccess();
    
    if (currentSet >= currentExercise.sets) {
      completeExercise();
    } else {
      setIsExercising(false);
      setRestTimer(currentExercise.restTime);
      setIsResting(true);
      showNotification(`Set ${currentSet} complete! Rest time.`, 'success');
      
      // Play rest tone
      audioManager.current.playBinauralBeats(200, 8, 3000);
    }
  };

  const startNextSet = () => {
    setCurrentSet(prev => prev + 1);
    setExerciseTimer(currentExercise.duration);
    setIsResting(false);
    setIsExercising(true);
    showNotification(`Starting set ${currentSet + 1}`, 'info');
    
    audioManager.current.playNotification();
  };

  const completeExercise = () => {
    audioManager.current.playSuccess();
    audioManager.current.playTherapeuticTone(741, 3000); // 741 Hz problem solving frequency
    
    const completedExercise = {
      ...currentExercise,
      completedAt: new Date(),
      setsCompleted: currentSet,
      totalDuration: currentExercise.duration * currentExercise.sets + (currentExercise.restTime * (currentExercise.sets - 1))
    };
    
    setCompletedExercises(prev => [completedExercise, ...prev]);
    setTotalSessions(prev => prev + 1);
    
    // Update health metrics
    setHealthMetrics(prev => ({
      ...prev,
      painLevel: Math.max(1, prev.painLevel - (currentExercise.painReduction / 10)),
      mobilityScore: Math.min(100, prev.mobilityScore + 2),
      energyLevel: Math.min(10, prev.energyLevel + 0.5),
      overallWellness: Math.min(100, prev.overallWellness + 1)
    }));
    
    setIsExercising(false);
    setCurrentExercise(null);
    setCurrentSet(1);
    
    showNotification(`Exercise completed! Pain reduced by ${currentExercise.painReduction}%`, 'success');
  };

  const stopExercise = () => {
    audioManager.current.playClick();
    setIsExercising(false);
    setIsResting(false);
    setCurrentExercise(null);
    setExerciseTimer(0);
    setRestTimer(0);
    setCurrentSet(1);
    showNotification('Exercise stopped', 'info');
  };

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    audioManager.current.playNotification();
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 4000);
  };

  const updatePainLevel = (level) => {
    setHealthMetrics(prev => ({ ...prev, painLevel: level }));
    audioManager.current.playClick();
    showNotification(`Pain level updated to ${level}/10`, 'info');
  };

  const exportProgress = () => {
    const progressData = {
      user,
      healthMetrics,
      completedExercises,
      totalSessions,
      streakDays,
      settings: {
        darkMode,
        reminderTime,
        exerciseGoal,
        musicVolume,
        effectsVolume
      },
      exportDate: new Date().toISOString(),
      weeklyProgress: generateWeeklyData(),
      appVersion: '2.0.0'
    };
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `painfree-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setLastBackup(new Date());
    audioManager.current.playSuccess();
    showNotification('Complete backup exported successfully! 📁', 'success');
  };

  const exportCSV = () => {
    const csvData = [
      ['Date', 'Exercise', 'Duration', 'Sets', 'Pain Before', 'Pain After', 'Category'],
      ...completedExercises.map(ex => [
        ex.completedAt.toLocaleDateString(),
        ex.name,
        `${ex.totalDuration}s`,
        ex.setsCompleted,
        ex.painReduction + healthMetrics.painLevel,
        healthMetrics.painLevel,
        ex.category
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `exercise-log-${new Date().toISOString().split('T')[0]}.csv`);
    linkElement.click();
    
    audioManager.current.playSuccess();
    showNotification('CSV exported successfully!', 'success');
  };

  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      exercises: Math.floor(Math.random() * 5) + 1,
      painReduction: Math.floor(Math.random() * 3) + 1,
      duration: Math.floor(Math.random() * 60) + 15
    }));
  };

  const switchTab = (tab) => {
    audioManager.current.playClick();
    setActiveTab(tab);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getPainColor = (level) => {
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#FF9800';
    return '#F44336';
  };

  // New Utility Functions
  const importProgress = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.healthMetrics) setHealthMetrics(importedData.healthMetrics);
        if (importedData.completedExercises) setCompletedExercises(importedData.completedExercises);
        if (importedData.totalSessions) setTotalSessions(importedData.totalSessions);
        if (importedData.streakDays) setStreakDays(importedData.streakDays);
        if (importedData.settings) {
          setDarkMode(importedData.settings.darkMode || false);
          setReminderTime(importedData.settings.reminderTime || '09:00');
          setExerciseGoal(importedData.settings.exerciseGoal || 3);
          setMusicVolume(importedData.settings.musicVolume || 0.3);
          setEffectsVolume(importedData.settings.effectsVolume || 0.5);
        }
        
        audioManager.current.playSuccess();
        showNotification('Data imported successfully! 📥', 'success');
      } catch (error) {
        audioManager.current.playError();
        showNotification('Import failed. Invalid file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (window.confirm('⚠️ This will delete ALL your progress data. Are you sure?')) {
      setHealthMetrics({
        painLevel: 5,
        mobilityScore: 50,
        sleepQuality: 5,
        energyLevel: 5,
        stressLevel: 5,
        overallWellness: 50,
        mood: 5,
        hydration: 5
      });
      setCompletedExercises([]);
      setTotalSessions(0);
      setStreakDays(0);
      setCurrentExercise(null);
      setIsExercising(false);
      setIsResting(false);
      
      audioManager.current.playError();
      showNotification('All data has been reset! 🔄', 'info');
    }
  };

  const quickPainAssessment = () => {
    const questions = [
      'Rate your current pain level (1-10)',
      'How is your mobility today? (1-10)',
      'How well did you sleep? (1-10)',
      'What is your energy level? (1-10)'
    ];
    
    let responses = [];
    questions.forEach((question, index) => {
      const response = prompt(question);
      if (response && !isNaN(response) && response >= 1 && response <= 10) {
        responses.push(parseInt(response));
      } else {
        responses.push(healthMetrics[['painLevel', 'mobilityScore', 'sleepQuality', 'energyLevel'][index]]);
      }
    });
    
    setHealthMetrics(prev => ({
      ...prev,
      painLevel: responses[0],
      mobilityScore: responses[1] * 10,
      sleepQuality: responses[2],
      energyLevel: responses[3],
      overallWellness: Math.round((responses[1] * 10 + responses[2] * 10 + responses[3] * 10 - responses[0] * 5) / 3)
    }));
    
    audioManager.current.playSuccess();
    showNotification('Health assessment updated! 📋', 'success');
  };

  const setReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const now = new Date();
          const reminderDate = new Date();
          const [hours, minutes] = reminderTime.split(':');
          reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (reminderDate <= now) {
            reminderDate.setDate(reminderDate.getDate() + 1);
          }
          
          const timeUntilReminder = reminderDate.getTime() - now.getTime();
          
          setTimeout(() => {
            new Notification('PainFree Pro Reminder 🏥', {
              body: 'Time for your daily exercise session!',
              icon: '🏥'
            });
            audioManager.current.playNotification();
          }, timeUntilReminder);
          
          showNotification(`Reminder set for ${reminderTime}! 🔔`, 'success');
        }
      });
    }
  };

  const generateHealthReport = () => {
    const report = `
PAINFREE PRO - HEALTH REPORT
Generated: ${new Date().toLocaleString()}
===================================

CURRENT HEALTH STATUS:
• Pain Level: ${healthMetrics.painLevel}/10 ${healthMetrics.painLevel <= 3 ? '✅' : healthMetrics.painLevel <= 6 ? '⚠️' : '🔴'}
• Mobility Score: ${healthMetrics.mobilityScore}% ${healthMetrics.mobilityScore >= 70 ? '✅' : '⚠️'}
• Sleep Quality: ${healthMetrics.sleepQuality}/10 ${healthMetrics.sleepQuality >= 7 ? '✅' : '⚠️'}
• Energy Level: ${healthMetrics.energyLevel}/10 ${healthMetrics.energyLevel >= 7 ? '✅' : '⚠️'}
• Stress Level: ${healthMetrics.stressLevel}/10 ${healthMetrics.stressLevel <= 4 ? '✅' : '⚠️'}
• Overall Wellness: ${healthMetrics.overallWellness}% ${healthMetrics.overallWellness >= 70 ? '✅' : '⚠️'}

EXERCISE STATISTICS:
• Total Sessions: ${totalSessions}
• Current Streak: ${streakDays} days
• Total Exercises: ${completedExercises.length}
• Average Pain Reduction: ${completedExercises.length > 0 ? (completedExercises.reduce((acc, ex) => acc + ex.painReduction, 0) / completedExercises.length).toFixed(1) : 0}%

RECOMMENDATIONS:
${healthMetrics.painLevel > 6 ? '• Consider consulting a healthcare professional for high pain levels\n' : ''}
${healthMetrics.mobilityScore < 50 ? '• Focus on mobility and flexibility exercises\n' : ''}
${healthMetrics.sleepQuality < 6 ? '• Improve sleep hygiene and consider relaxation techniques\n' : ''}
${healthMetrics.stressLevel > 6 ? '• Practice stress management and breathing exercises\n' : ''}
${totalSessions < exerciseGoal ? '• Increase exercise frequency to meet your goals\n' : ''}

Generated by PainFree Pro v2.0 🏥
    `.trim();
    
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(report);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `health-report-${new Date().toISOString().split('T')[0]}.txt`);
    linkElement.click();
    
    audioManager.current.playSuccess();
    showNotification('Health report generated! 📋', 'success');
  };

  return (
    <div className="healthcare-app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏥 PainFree Pro</div>
            <div className="tagline">Your Digital Physiotherapist</div>
          </div>
          <div className="header-stats">
            <div className="pain-indicator">
              <span className="pain-label">Pain Level</span>
              <span className="pain-value" style={{ color: getPainColor(healthMetrics.painLevel) }}>
                {healthMetrics.painLevel}/10
              </span>
            </div>
            <div className="streak-counter">
              <span className="streak-label">🔥 Streak</span>
              <span className="streak-value">{streakDays} days</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="welcome-section">
              <h2>Welcome back, {user.name}!</h2>
              <p>Let's continue your recovery journey</p>
            </div>

            <div className="health-metrics">
              <h3>Health Overview</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">😣</div>
                  <div className="metric-info">
                    <span className="metric-label">Pain Level</span>
                    <span className="metric-value" style={{ color: getPainColor(healthMetrics.painLevel) }}>
                      {healthMetrics.painLevel}/10
                    </span>
                  </div>
                  <div className="pain-slider">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={healthMetrics.painLevel}
                      onChange={(e) => updatePainLevel(parseInt(e.target.value))}
                      className="slider"
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🚶</div>
                  <div className="metric-info">
                    <span className="metric-label">Mobility</span>
                    <span className="metric-value">{healthMetrics.mobilityScore}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${healthMetrics.mobilityScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">😴</div>
                  <div className="metric-info">
                    <span className="metric-label">Sleep Quality</span>
                    <span className="metric-value">{healthMetrics.sleepQuality}/10</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">⚡</div>
                  <div className="metric-info">
                    <span className="metric-label">Energy Level</span>
                    <span className="metric-value">{healthMetrics.energyLevel}/10</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">😰</div>
                  <div className="metric-info">
                    <span className="metric-label">Stress Level</span>
                    <span className="metric-value">{healthMetrics.stressLevel}/10</span>
                  </div>
                </div>

                                 <div className="metric-card">
                   <div className="metric-icon">💚</div>
                   <div className="metric-info">
                     <span className="metric-label">Overall Wellness</span>
                     <span className="metric-value">{healthMetrics.overallWellness}%</span>
                   </div>
                   <div className="progress-bar">
                     <div 
                       className="progress-fill wellness"
                       style={{ width: `${healthMetrics.overallWellness}%` }}
                     ></div>
                   </div>
                 </div>

                 <div className="metric-card">
                   <div className="metric-icon">😊</div>
                   <div className="metric-info">
                     <span className="metric-label">Mood</span>
                     <span className="metric-value">{healthMetrics.mood}/10</span>
                   </div>
                   <div className="mood-slider">
                     <input
                       type="range"
                       min="1"
                       max="10"
                       value={healthMetrics.mood}
                       onChange={(e) => {
                         setHealthMetrics(prev => ({ ...prev, mood: parseInt(e.target.value) }));
                         audioManager.current.playClick();
                       }}
                       className="slider"
                     />
                   </div>
                 </div>

                 <div className="metric-card">
                   <div className="metric-icon">💧</div>
                   <div className="metric-info">
                     <span className="metric-label">Hydration</span>
                     <span className="metric-value">{healthMetrics.hydration}/10</span>
                   </div>
                   <div className="hydration-buttons">
                     <button 
                       className="hydration-btn"
                       onClick={() => {
                         setHealthMetrics(prev => ({ 
                           ...prev, 
                           hydration: Math.min(10, prev.hydration + 1) 
                         }));
                         audioManager.current.playClick();
                         showNotification('Hydration level increased! 💧', 'info');
                       }}
                     >
                       + Glass
                     </button>
                   </div>
                 </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              {completedExercises.length > 0 ? (
                <div className="activity-list">
                  {completedExercises.slice(0, 5).map((exercise, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">✅</div>
                      <div className="activity-info">
                        <span className="activity-name">{exercise.name}</span>
                        <span className="activity-time">
                          {exercise.completedAt.toLocaleString()}
                        </span>
                      </div>
                      <div className="activity-benefit">
                        -{exercise.painReduction}% pain
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-activity">
                  <p>No exercises completed yet. Start your first session!</p>
                </div>
              )}
            </div>

                         <div className="quick-actions">
               <button 
                 className="quick-action-btn primary"
                 onClick={() => switchTab('exercises')}
               >
                 <span className="action-icon">💪</span>
                 <span>Start Exercise</span>
                 <span className="action-badge">{exerciseGoal - totalSessions > 0 ? `${exerciseGoal - totalSessions} left` : 'Goal met!'}</span>
               </button>
               
               <button 
                 className="quick-action-btn"
                 onClick={quickPainAssessment}
               >
                 <span className="action-icon">📋</span>
                 <span>Quick Assessment</span>
                 <span className="action-desc">Update all metrics</span>
               </button>
               
               <button 
                 className="quick-action-btn"
                 onClick={() => audioManager.current.playBinauralBeats(200, 10, 10000)}
               >
                 <span className="action-icon">🧘</span>
                 <span>Relaxation Sounds</span>
                 <span className="action-desc">10 min session</span>
               </button>
               
               <button 
                 className="quick-action-btn"
                 onClick={generateHealthReport}
               >
                 <span className="action-icon">📄</span>
                 <span>Health Report</span>
                 <span className="action-desc">Generate summary</span>
               </button>
               
               <button 
                 className="quick-action-btn"
                 onClick={setReminder}
               >
                 <span className="action-icon">🔔</span>
                 <span>Set Reminder</span>
                 <span className="action-desc">{reminderTime}</span>
               </button>
               
               <button 
                 className="quick-action-btn"
                 onClick={() => setShowSettings(true)}
               >
                 <span className="action-icon">⚙️</span>
                 <span>Settings</span>
                 <span className="action-desc">Backup & preferences</span>
               </button>
             </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="exercises">
            <div className="exercises-header">
              <h2>Therapeutic Exercises</h2>
              <div className="body-part-selector">
                {Object.keys(exerciseDatabase).map(part => (
                  <button
                    key={part}
                    className={`body-part-btn ${selectedBodyPart === part ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedBodyPart(part);
                      audioManager.current.playClick();
                    }}
                  >
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {isExercising && currentExercise && (
              <div className="active-exercise">
                <div className="exercise-header">
                  <h3>{currentExercise.name}</h3>
                  <button className="stop-btn" onClick={stopExercise}>Stop</button>
                </div>
                
                <div className="exercise-timer">
                  <div className="timer-display">{formatTime(exerciseTimer)}</div>
                  <div className="timer-info">
                    <span>Set {currentSet} of {currentExercise.sets}</span>
                  </div>
                </div>

                <div className="exercise-progress">
                  <div 
                    className="progress-bar-fill"
                    style={{
                      width: `${((currentExercise.duration - exerciseTimer) / currentExercise.duration) * 100}%`
                    }}
                  ></div>
                </div>

                <div className="exercise-instructions">
                  <h4>Instructions:</h4>
                  <ul>
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {isResting && (
              <div className="rest-period">
                <h3>Rest Time</h3>
                <div className="rest-timer">{formatTime(restTimer)}</div>
                <p>Prepare for set {currentSet + 1}</p>
              </div>
            )}

            <div className="exercise-list">
              {exerciseDatabase[selectedBodyPart]?.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-header">
                    <h4>{exercise.name}</h4>
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  <p className="exercise-description">{exercise.description}</p>
                  
                  <div className="exercise-stats">
                    <div className="stat">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{exercise.duration}s</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Sets</span>
                      <span className="stat-value">{exercise.sets}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Pain Relief</span>
                      <span className="stat-value">{exercise.painReduction}%</span>
                    </div>
                  </div>

                  <div className="exercise-benefits">
                    <strong>Benefits:</strong>
                    <div className="benefit-tags">
                      {exercise.benefits.map((benefit, index) => (
                        <span key={index} className="benefit-tag">{benefit}</span>
                      ))}
                    </div>
                  </div>

                  <button 
                    className="start-exercise-btn"
                    onClick={() => startExercise(exercise)}
                    disabled={isExercising || isResting}
                  >
                    {isExercising ? 'Exercise in Progress' : 'Start Exercise'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress">
            <div className="progress-header">
              <h2>Your Recovery Progress</h2>
              <div className="export-buttons">
                <button className="export-btn" onClick={exportProgress}>
                  <span>📊</span> Export JSON
                </button>
                <button className="export-btn" onClick={exportCSV}>
                  <span>📈</span> Export CSV
                </button>
              </div>
            </div>

            <div className="progress-stats">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <span className="stat-number">{totalSessions}</span>
                  <span className="stat-label">Total Sessions</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <span className="stat-number">{streakDays}</span>
                  <span className="stat-label">Day Streak</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <span className="stat-number">
                    {Math.floor(completedExercises.reduce((acc, ex) => acc + (ex.totalDuration || 0), 0) / 60)}
                  </span>
                  <span className="stat-label">Minutes Exercised</span>
                </div>
              </div>
            </div>

            <div className="weekly-chart">
              <h3>This Week's Activity</h3>
              <div className="chart-container">
                {generateWeeklyData().map((day, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar"
                      style={{ height: `${(day.exercises / 5) * 100}%` }}
                    ></div>
                    <span className="bar-label">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="exercise-history">
              <h3>Exercise History</h3>
              {completedExercises.length > 0 ? (
                <div className="history-list">
                  {completedExercises.map((exercise, index) => (
                    <div key={index} className="history-item">
                      <div className="history-icon">
                        {exercise.category === 'Flexibility' ? '🤸' : 
                         exercise.category === 'Strengthening' ? '💪' : 
                         exercise.category === 'Mobility' ? '🚶' : '🧘'}
                      </div>
                      <div className="history-content">
                        <div className="history-name">{exercise.name}</div>
                        <div className="history-details">
                          {exercise.setsCompleted} sets • {Math.floor(exercise.totalDuration / 60)}min • 
                          -{exercise.painReduction}% pain
                        </div>
                        <div className="history-date">
                          {exercise.completedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="history-category">
                        <span className="category-tag">{exercise.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <p>No exercise history yet. Complete your first exercise to see progress!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div className="sounds">
            <h2>Therapeutic Audio</h2>
            
            <div className="volume-controls">
              <div className="volume-control">
                <label>🎵 Music Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setMusicVolume(vol);
                    audioManager.current.setMusicVolume(vol);
                  }}
                />
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              
              <div className="volume-control">
                <label>🔊 Effects Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effectsVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setEffectsVolume(vol);
                    audioManager.current.setEffectsVolume(vol);
                  }}
                />
                <span>{Math.round(effectsVolume * 100)}%</span>
              </div>
            </div>

            <div className="sound-categories">
              <div className="sound-category">
                <h3>Healing Frequencies</h3>
                <div className="sound-buttons">
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playTherapeuticTone(528, 5000)}
                  >
                    <span className="sound-icon">🎵</span>
                    <span>528 Hz - DNA Repair</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playTherapeuticTone(741, 5000)}
                  >
                    <span className="sound-icon">🧠</span>
                    <span>741 Hz - Problem Solving</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playTherapeuticTone(852, 5000)}
                  >
                    <span className="sound-icon">👁️</span>
                    <span>852 Hz - Intuition</span>
                  </button>
                </div>
              </div>

              <div className="sound-category">
                <h3>Binaural Beats</h3>
                <div className="sound-buttons">
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playBinauralBeats(200, 8, 10000)}
                  >
                    <span className="sound-icon">😴</span>
                    <span>Alpha Waves - Relaxation</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playBinauralBeats(150, 4, 10000)}
                  >
                    <span className="sound-icon">🧘</span>
                    <span>Theta Waves - Meditation</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playBinauralBeats(100, 2, 10000)}
                  >
                    <span className="sound-icon">💤</span>
                    <span>Delta Waves - Deep Sleep</span>
                  </button>
                </div>
              </div>

              <div className="sound-category">
                <h3>Ambient Healing</h3>
                <div className="sound-buttons">
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playAmbientHealing('rain')}
                  >
                    <span className="sound-icon">🌧️</span>
                    <span>Rain Sounds</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playAmbientHealing('ocean')}
                  >
                    <span className="sound-icon">🌊</span>
                    <span>Ocean Waves</span>
                  </button>
                  <button 
                    className="sound-btn"
                    onClick={() => audioManager.current.playAmbientHealing('forest')}
                  >
                    <span className="sound-icon">🌲</span>
                    <span>Forest Sounds</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => switchTab('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => switchTab('exercises')}
        >
          <span className="nav-icon">💪</span>
          <span className="nav-label">Exercises</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => switchTab('progress')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Progress</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'sounds' ? 'active' : ''}`}
          onClick={() => switchTab('sounds')}
        >
          <span className="nav-icon">🎵</span>
          <span className="nav-label">Sounds</span>
        </button>
      </nav>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              <div className="notification-content">
                <span className="notification-message">{notification.message}</span>
                <span className="notification-time">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;