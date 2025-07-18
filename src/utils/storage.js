// Local storage utilities for data persistence
export const STORAGE_KEYS = {
  PATIENTS: 'backpain_patients',
  PAIN_ENTRIES: 'backpain_pain_entries',
  EXERCISES: 'backpain_exercises',
  APPOINTMENTS: 'backpain_appointments',
  MEDICATIONS: 'backpain_medications',
  SETTINGS: 'backpain_settings'
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Initialize default data if not exists
export const initializeDefaultData = () => {
  if (!storage.get(STORAGE_KEYS.PATIENTS)) {
    storage.set(STORAGE_KEYS.PATIENTS, []);
  }
  
  if (!storage.get(STORAGE_KEYS.PAIN_ENTRIES)) {
    storage.set(STORAGE_KEYS.PAIN_ENTRIES, []);
  }
  
  if (!storage.get(STORAGE_KEYS.EXERCISES)) {
    storage.set(STORAGE_KEYS.EXERCISES, getDefaultExercises());
  }
  
  if (!storage.get(STORAGE_KEYS.APPOINTMENTS)) {
    storage.set(STORAGE_KEYS.APPOINTMENTS, []);
  }
  
  if (!storage.get(STORAGE_KEYS.MEDICATIONS)) {
    storage.set(STORAGE_KEYS.MEDICATIONS, []);
  }
  
  if (!storage.get(STORAGE_KEYS.SETTINGS)) {
    storage.set(STORAGE_KEYS.SETTINGS, {
      theme: 'light',
      notifications: true,
      language: 'en'
    });
  }
};

const getDefaultExercises = () => [
  {
    id: '1',
    name: 'Cat-Cow Stretch',
    category: 'Flexibility',
    duration: 60,
    difficulty: 'Beginner',
    description: 'A gentle spinal mobility exercise that helps relieve tension in the back.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Arch your back and lift your head (Cow pose)',
      'Round your spine and tuck your chin (Cat pose)',
      'Repeat slowly 10-15 times'
    ],
    benefits: ['Improves spinal flexibility', 'Relieves back tension', 'Strengthens core']
  },
  {
    id: '2',
    name: 'Pelvic Tilts',
    category: 'Strengthening',
    duration: 90,
    difficulty: 'Beginner',
    description: 'Strengthens abdominal muscles and improves lower back stability.',
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Tighten abdominal muscles',
      'Tilt pelvis slightly upward',
      'Hold for 5 seconds, repeat 10-15 times'
    ],
    benefits: ['Strengthens core', 'Improves posture', 'Reduces lower back pain']
  },
  {
    id: '3',
    name: 'Knee-to-Chest Stretch',
    category: 'Flexibility',
    duration: 120,
    difficulty: 'Beginner',
    description: 'Gentle stretch that helps relieve lower back tension.',
    instructions: [
      'Lie on back with knees bent',
      'Bring one knee to chest',
      'Hold for 20-30 seconds',
      'Repeat with other leg'
    ],
    benefits: ['Stretches lower back', 'Improves flexibility', 'Reduces muscle tension']
  },
  {
    id: '4',
    name: 'Bridge Exercise',
    category: 'Strengthening',
    duration: 180,
    difficulty: 'Intermediate',
    description: 'Strengthens glutes and core muscles to support the lower back.',
    instructions: [
      'Lie on back with knees bent',
      'Lift hips off ground',
      'Form straight line from knees to shoulders',
      'Hold for 10 seconds, repeat 10-15 times'
    ],
    benefits: ['Strengthens glutes', 'Improves core stability', 'Supports lower back']
  },
  {
    id: '5',
    name: 'Standing Back Extension',
    category: 'Mobility',
    duration: 60,
    difficulty: 'Beginner',
    description: 'Counteracts forward posture and relieves back stiffness.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Place hands on lower back',
      'Gently arch backward',
      'Hold for 5-10 seconds, repeat 5-10 times'
    ],
    benefits: ['Improves posture', 'Reduces stiffness', 'Strengthens back extensors']
  }
];