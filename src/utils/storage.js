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
  // BEGINNER FLEXIBILITY EXERCISES
  {
    id: '1',
    name: 'Cat-Cow Stretch',
    category: 'Flexibility',
    subcategory: 'Spinal Mobility',
    duration: 60,
    sets: 1,
    reps: '10-15',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Lower Back', 'Upper Back', 'Core'],
    description: 'A gentle spinal mobility exercise that helps relieve tension in the back and improves flexibility.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Ensure wrists are under shoulders and knees under hips',
      'Inhale, arch your back and lift your head (Cow pose)',
      'Exhale, round your spine and tuck your chin (Cat pose)',
      'Move slowly and smoothly between positions',
      'Repeat for 10-15 cycles, focusing on breathing'
    ],
    benefits: ['Improves spinal flexibility', 'Relieves back tension', 'Strengthens core', 'Enhances posture'],
    precautions: ['Avoid if you have severe neck pain', 'Move slowly and gently'],
    modifications: ['Can be done sitting in a chair', 'Use pillow under knees for comfort'],
    videoUrl: null,
    imageUrl: '🐱',
    painReliefLevel: 'High',
    caloriesBurned: 15
  },
  {
    id: '2',
    name: 'Child\'s Pose',
    category: 'Flexibility',
    subcategory: 'Relaxation',
    duration: 90,
    sets: 1,
    reps: 'Hold',
    difficulty: 'Beginner',
    equipment: 'Yoga mat (optional)',
    targetAreas: ['Lower Back', 'Hips', 'Shoulders'],
    description: 'A restorative yoga pose that gently stretches the back and promotes relaxation.',
    instructions: [
      'Kneel on the floor with big toes touching',
      'Spread knees hip-width apart',
      'Sit back on your heels',
      'Fold forward, extending arms in front',
      'Rest forehead on the ground',
      'Breathe deeply and relax for 60-90 seconds'
    ],
    benefits: ['Stretches lower back', 'Relieves stress', 'Calms the mind', 'Improves circulation'],
    precautions: ['Avoid if pregnant', 'Stop if you feel dizzy'],
    modifications: ['Place pillow between calves and thighs', 'Use blanket for warmth'],
    videoUrl: null,
    imageUrl: '🧘‍♀️',
    painReliefLevel: 'High',
    caloriesBurned: 10
  },
  {
    id: '3',
    name: 'Knee-to-Chest Stretch',
    category: 'Flexibility',
    subcategory: 'Lower Back',
    duration: 120,
    sets: 2,
    reps: '30 seconds each leg',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Lower Back', 'Hip Flexors', 'Glutes'],
    description: 'Gentle stretch that helps relieve lower back tension and improves hip flexibility.',
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Bring one knee toward chest',
      'Clasp hands behind thigh or over shin',
      'Gently pull knee closer to chest',
      'Hold for 20-30 seconds',
      'Repeat with other leg',
      'For double knee-to-chest, bring both knees up together'
    ],
    benefits: ['Stretches lower back', 'Improves hip flexibility', 'Reduces muscle tension', 'Promotes relaxation'],
    precautions: ['Don\'t pull too hard', 'Stop if pain increases'],
    modifications: ['Use towel around thigh if can\'t reach', 'Keep head down if neck is sensitive'],
    videoUrl: null,
    imageUrl: '🤗',
    painReliefLevel: 'Medium',
    caloriesBurned: 8
  },

  // BEGINNER STRENGTHENING EXERCISES
  {
    id: '4',
    name: 'Pelvic Tilts',
    category: 'Strengthening',
    subcategory: 'Core Stability',
    duration: 90,
    sets: 2,
    reps: '10-15',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Core', 'Lower Back', 'Pelvic Floor'],
    description: 'Strengthens abdominal muscles and improves lower back stability through gentle core activation.',
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Place one hand on chest, one on lower back',
      'Tighten abdominal muscles',
      'Tilt pelvis slightly upward, flattening lower back',
      'Hold for 5 seconds while breathing normally',
      'Release slowly and repeat 10-15 times'
    ],
    benefits: ['Strengthens core', 'Improves posture', 'Reduces lower back pain', 'Enhances pelvic stability'],
    precautions: ['Don\'t hold breath', 'Avoid excessive arching'],
    modifications: ['Start with 3-second holds', 'Place pillow under knees for comfort'],
    videoUrl: null,
    imageUrl: '💪',
    painReliefLevel: 'Medium',
    caloriesBurned: 20
  },
  {
    id: '5',
    name: 'Bridge Exercise',
    category: 'Strengthening',
    subcategory: 'Glute Strength',
    duration: 180,
    sets: 2,
    reps: '10-15',
    difficulty: 'Intermediate',
    equipment: 'None',
    targetAreas: ['Glutes', 'Hamstrings', 'Core', 'Lower Back'],
    description: 'Strengthens glutes and core muscles to support the lower back and improve posture.',
    instructions: [
      'Lie on back with knees bent, feet hip-width apart',
      'Arms at sides, palms down',
      'Squeeze glutes and lift hips off ground',
      'Form straight line from knees to shoulders',
      'Hold for 5-10 seconds',
      'Lower slowly and repeat 10-15 times'
    ],
    benefits: ['Strengthens glutes', 'Improves core stability', 'Supports lower back', 'Enhances posture'],
    precautions: ['Don\'t arch back excessively', 'Keep knees aligned'],
    modifications: ['Single-leg bridge for advanced', 'Place block between knees'],
    videoUrl: null,
    imageUrl: '🌉',
    painReliefLevel: 'Medium',
    caloriesBurned: 35
  },

  // INTERMEDIATE EXERCISES
  {
    id: '6',
    name: 'Bird Dog',
    category: 'Strengthening',
    subcategory: 'Core Stability',
    duration: 120,
    sets: 2,
    reps: '10 each side',
    difficulty: 'Intermediate',
    equipment: 'Yoga mat',
    targetAreas: ['Core', 'Lower Back', 'Shoulders', 'Glutes'],
    description: 'A dynamic stability exercise that strengthens the core while improving balance and coordination.',
    instructions: [
      'Start in tabletop position on hands and knees',
      'Keep spine neutral and core engaged',
      'Extend right arm forward and left leg back',
      'Hold for 5-10 seconds',
      'Return to start position',
      'Repeat with left arm and right leg',
      'Complete 10 repetitions each side'
    ],
    benefits: ['Improves core stability', 'Enhances balance', 'Strengthens back muscles', 'Better coordination'],
    precautions: ['Keep hips level', 'Don\'t rush the movement'],
    modifications: ['Start with arm only or leg only', 'Use wall for balance'],
    videoUrl: null,
    imageUrl: '🐦',
    painReliefLevel: 'Medium',
    caloriesBurned: 40
  },
  {
    id: '7',
    name: 'Wall Slides',
    category: 'Mobility',
    subcategory: 'Posture',
    duration: 90,
    sets: 2,
    reps: '10-15',
    difficulty: 'Intermediate',
    equipment: 'Wall',
    targetAreas: ['Shoulders', 'Upper Back', 'Neck'],
    description: 'Improves shoulder mobility and posture by strengthening upper back muscles.',
    instructions: [
      'Stand with back against wall',
      'Place arms against wall in "goal post" position',
      'Keep contact with wall throughout movement',
      'Slide arms up the wall as high as comfortable',
      'Slowly return to start position',
      'Focus on squeezing shoulder blades together'
    ],
    benefits: ['Improves posture', 'Strengthens upper back', 'Increases shoulder mobility', 'Reduces neck tension'],
    precautions: ['Don\'t force range of motion', 'Stop if shoulders hurt'],
    modifications: ['Start with smaller range of motion', 'Use resistance band'],
    videoUrl: null,
    imageUrl: '🏔️',
    painReliefLevel: 'Medium',
    caloriesBurned: 25
  },

  // ADVANCED EXERCISES
  {
    id: '8',
    name: 'Dead Bug',
    category: 'Strengthening',
    subcategory: 'Core Control',
    duration: 150,
    sets: 3,
    reps: '8-12 each side',
    difficulty: 'Advanced',
    equipment: 'None',
    targetAreas: ['Deep Core', 'Hip Flexors', 'Shoulders'],
    description: 'Advanced core exercise that teaches proper core stability and limb dissociation.',
    instructions: [
      'Lie on back with arms extended toward ceiling',
      'Bring knees to 90-degree angle (tabletop)',
      'Keep lower back pressed into floor',
      'Slowly extend right arm overhead and left leg down',
      'Return to start without touching floor',
      'Repeat with opposite arm and leg',
      'Maintain core tension throughout'
    ],
    benefits: ['Deep core strengthening', 'Improves coordination', 'Enhances stability', 'Better movement control'],
    precautions: ['Keep lower back flat', 'Move slowly and controlled'],
    modifications: ['Start with arms only', 'Use smaller range of motion'],
    videoUrl: null,
    imageUrl: '🪲',
    painReliefLevel: 'High',
    caloriesBurned: 45
  },
  {
    id: '9',
    name: 'Plank',
    category: 'Strengthening',
    subcategory: 'Core Endurance',
    duration: 180,
    sets: 3,
    reps: '30-60 seconds',
    difficulty: 'Advanced',
    equipment: 'None',
    targetAreas: ['Core', 'Shoulders', 'Glutes'],
    description: 'Isometric exercise that builds core strength and endurance while improving posture.',
    instructions: [
      'Start in push-up position',
      'Lower to forearms, elbows under shoulders',
      'Keep body in straight line from head to heels',
      'Engage core and squeeze glutes',
      'Hold for 30-60 seconds',
      'Breathe normally throughout hold'
    ],
    benefits: ['Builds core endurance', 'Improves posture', 'Strengthens shoulders', 'Enhances stability'],
    precautions: ['Don\'t let hips sag', 'Stop if lower back hurts'],
    modifications: ['Knee plank', 'Wall plank for beginners'],
    videoUrl: null,
    imageUrl: '📏',
    painReliefLevel: 'High',
    caloriesBurned: 50
  },

  // MOBILITY & STRETCHING
  {
    id: '10',
    name: 'Thoracic Spine Rotation',
    category: 'Mobility',
    subcategory: 'Spinal Rotation',
    duration: 90,
    sets: 2,
    reps: '10 each direction',
    difficulty: 'Intermediate',
    equipment: 'None',
    targetAreas: ['Upper Back', 'Shoulders', 'Core'],
    description: 'Improves rotational mobility in the upper spine, crucial for daily activities.',
    instructions: [
      'Lie on side with knees bent at 90 degrees',
      'Extend arms in front, palms together',
      'Keep knees together throughout',
      'Rotate top arm up and over to opposite side',
      'Follow hand with eyes',
      'Return slowly to start position',
      'Complete 10 rotations each direction'
    ],
    benefits: ['Improves spinal rotation', 'Reduces stiffness', 'Enhances shoulder mobility', 'Better posture'],
    precautions: ['Move slowly', 'Don\'t force rotation'],
    modifications: ['Smaller range of motion', 'Place pillow between knees'],
    videoUrl: null,
    imageUrl: '🌪️',
    painReliefLevel: 'Medium',
    caloriesBurned: 20
  },
  {
    id: '11',
    name: 'Hip Flexor Stretch',
    category: 'Flexibility',
    subcategory: 'Hip Mobility',
    duration: 120,
    sets: 2,
    reps: '30 seconds each leg',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Hip Flexors', 'Quadriceps', 'Lower Back'],
    description: 'Stretches tight hip flexors that often contribute to lower back pain.',
    instructions: [
      'Kneel on floor with right knee down',
      'Step left foot forward into lunge position',
      'Keep torso upright',
      'Gently push hips forward',
      'Feel stretch in front of right hip',
      'Hold for 30 seconds, switch sides'
    ],
    benefits: ['Stretches hip flexors', 'Improves posture', 'Reduces lower back tension', 'Better hip mobility'],
    precautions: ['Don\'t overstretch', 'Use padding under knee'],
    modifications: ['Use wall for balance', 'Standing hip flexor stretch'],
    videoUrl: null,
    imageUrl: '🦵',
    painReliefLevel: 'High',
    caloriesBurned: 15
  },

  // FUNCTIONAL EXERCISES
  {
    id: '12',
    name: 'Sit-to-Stand',
    category: 'Functional',
    subcategory: 'Daily Living',
    duration: 90,
    sets: 3,
    reps: '10-15',
    difficulty: 'Beginner',
    equipment: 'Chair',
    targetAreas: ['Quadriceps', 'Glutes', 'Core'],
    description: 'Functional exercise that mimics daily activities while strengthening legs and core.',
    instructions: [
      'Sit in chair with feet flat on floor',
      'Cross arms over chest',
      'Lean slightly forward',
      'Stand up using leg muscles',
      'Sit back down slowly and controlled',
      'Repeat 10-15 times without using hands'
    ],
    benefits: ['Improves functional strength', 'Builds leg power', 'Enhances balance', 'Daily activity practice'],
    precautions: ['Use arms if needed for safety', 'Start with higher chair'],
    modifications: ['Use arms for assistance', 'Add weight for challenge'],
    videoUrl: null,
    imageUrl: '🪑',
    painReliefLevel: 'Low',
    caloriesBurned: 30
  },

  // AQUATIC/WATER EXERCISES
  {
    id: '13',
    name: 'Water Walking',
    category: 'Aerobic',
    subcategory: 'Low Impact',
    duration: 300,
    sets: 1,
    reps: '5-15 minutes',
    difficulty: 'Beginner',
    equipment: 'Pool',
    targetAreas: ['Full Body', 'Cardiovascular'],
    description: 'Low-impact aerobic exercise that provides resistance while being gentle on joints.',
    instructions: [
      'Enter pool at chest-deep water',
      'Walk forward with normal gait',
      'Swing arms naturally',
      'Walk backward for variation',
      'Side-step for lateral movement',
      'Maintain good posture throughout'
    ],
    benefits: ['Low-impact cardio', 'Builds endurance', 'Reduces joint stress', 'Improves circulation'],
    precautions: ['Ensure pool safety', 'Start slowly'],
    modifications: ['Use pool noodle for support', 'Vary water depth'],
    videoUrl: null,
    imageUrl: '🏊‍♀️',
    painReliefLevel: 'High',
    caloriesBurned: 80
  },

  // BREATHING & RELAXATION
  {
    id: '14',
    name: 'Diaphragmatic Breathing',
    category: 'Relaxation',
    subcategory: 'Stress Relief',
    duration: 300,
    sets: 1,
    reps: '5-10 breaths',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Diaphragm', 'Core', 'Nervous System'],
    description: 'Breathing technique that promotes relaxation and can help reduce pain perception.',
    instructions: [
      'Lie comfortably with knees bent',
      'Place one hand on chest, one on belly',
      'Breathe in slowly through nose',
      'Feel belly rise more than chest',
      'Exhale slowly through pursed lips',
      'Focus on relaxing with each breath'
    ],
    benefits: ['Reduces stress', 'Promotes relaxation', 'Improves oxygen flow', 'Pain management'],
    precautions: ['Don\'t hyperventilate', 'Stop if dizzy'],
    modifications: ['Can be done sitting', 'Use guided meditation'],
    videoUrl: null,
    imageUrl: '🫁',
    painReliefLevel: 'Medium',
    caloriesBurned: 5
  },

  // POSTURE-SPECIFIC EXERCISES
  {
    id: '15',
    name: 'Chin Tucks',
    category: 'Posture',
    subcategory: 'Neck Alignment',
    duration: 60,
    sets: 3,
    reps: '10',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Neck', 'Upper Back'],
    description: 'Corrects forward head posture and strengthens deep neck flexors.',
    instructions: [
      'Sit or stand with spine straight',
      'Look straight ahead',
      'Gently draw chin back (double chin)',
      'Keep eyes level, don\'t tilt head',
      'Hold for 5 seconds',
      'Repeat 10 times'
    ],
    benefits: ['Improves neck posture', 'Reduces neck pain', 'Strengthens deep neck muscles', 'Better alignment'],
    precautions: ['Don\'t force movement', 'Stop if pain increases'],
    modifications: ['Use wall for feedback', 'Start with 3-second holds'],
    videoUrl: null,
    imageUrl: '👤',
    painReliefLevel: 'Medium',
    caloriesBurned: 10
  },

  // BALANCE & COORDINATION
  {
    id: '16',
    name: 'Single Leg Stand',
    category: 'Balance',
    subcategory: 'Stability',
    duration: 120,
    sets: 3,
    reps: '30 seconds each leg',
    difficulty: 'Intermediate',
    equipment: 'None',
    targetAreas: ['Ankles', 'Core', 'Proprioception'],
    description: 'Improves balance and core stability while enhancing proprioception.',
    instructions: [
      'Stand tall with feet together',
      'Lift one foot slightly off ground',
      'Balance on standing leg for 30 seconds',
      'Keep core engaged',
      'Switch legs and repeat',
      'Use arms for balance if needed'
    ],
    benefits: ['Improves balance', 'Strengthens stabilizing muscles', 'Enhances coordination', 'Fall prevention'],
    precautions: ['Use wall or chair for safety', 'Start with shorter holds'],
    modifications: ['Eyes closed for challenge', 'Stand on unstable surface'],
    videoUrl: null,
    imageUrl: '🦩',
    painReliefLevel: 'Low',
    caloriesBurned: 15
  },

  // CREATIVE MOVEMENT EXERCISES
  {
    id: '17',
    name: 'Tai Chi Opening',
    category: 'Mind-Body',
    subcategory: 'Gentle Movement',
    duration: 180,
    sets: 1,
    reps: '5-10 repetitions',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Full Body', 'Mind-Body Connection'],
    description: 'Gentle, flowing movement that promotes relaxation and body awareness.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Slowly raise arms to shoulder height',
      'Turn palms down and lower arms',
      'Move slowly and mindfully',
      'Coordinate with deep breathing',
      'Focus on smooth, continuous movement'
    ],
    benefits: ['Promotes relaxation', 'Improves balance', 'Reduces stress', 'Enhances mindfulness'],
    precautions: ['Move at comfortable pace', 'Don\'t strain'],
    modifications: ['Can be done seated', 'Use chair for support'],
    videoUrl: null,
    imageUrl: '☯️',
    painReliefLevel: 'Medium',
    caloriesBurned: 20
  },

  // WORKPLACE EXERCISES
  {
    id: '18',
    name: 'Desk Shoulder Rolls',
    category: 'Workplace',
    subcategory: 'Office Wellness',
    duration: 30,
    sets: 3,
    reps: '10 each direction',
    difficulty: 'Beginner',
    equipment: 'None',
    targetAreas: ['Shoulders', 'Upper Back', 'Neck'],
    description: 'Quick exercise to relieve tension from prolonged sitting and computer work.',
    instructions: [
      'Sit or stand with good posture',
      'Lift shoulders up toward ears',
      'Roll shoulders back and down',
      'Make slow, controlled circles',
      'Reverse direction after 10 rolls',
      'Focus on releasing tension'
    ],
    benefits: ['Relieves shoulder tension', 'Improves circulation', 'Reduces workplace stiffness', 'Quick stress relief'],
    precautions: ['Don\'t force movement', 'Keep movements gentle'],
    modifications: ['One shoulder at a time', 'Add neck stretches'],
    videoUrl: null,
    imageUrl: '💻',
    painReliefLevel: 'Medium',
    caloriesBurned: 5
  },

  // RECOVERY & REGENERATION
  {
    id: '19',
    name: 'Progressive Muscle Relaxation',
    category: 'Recovery',
    subcategory: 'Tension Release',
    duration: 600,
    sets: 1,
    reps: 'Full body scan',
    difficulty: 'Beginner',
    equipment: 'Comfortable surface',
    targetAreas: ['Full Body', 'Nervous System'],
    description: 'Systematic relaxation technique that helps reduce overall muscle tension and stress.',
    instructions: [
      'Lie down comfortably',
      'Start with toes, tense for 5 seconds',
      'Release and notice the relaxation',
      'Move up through each muscle group',
      'Include calves, thighs, glutes, back, arms',
      'Finish with face and neck muscles'
    ],
    benefits: ['Reduces overall tension', 'Promotes deep relaxation', 'Improves sleep quality', 'Stress management'],
    precautions: ['Don\'t over-tense muscles', 'Skip areas of pain'],
    modifications: ['Focus on problem areas only', 'Use guided audio'],
    videoUrl: null,
    imageUrl: '😌',
    painReliefLevel: 'High',
    caloriesBurned: 10
  },

  // DYNAMIC MOVEMENT
  {
    id: '20',
    name: 'Spinal Wave',
    category: 'Dynamic',
    subcategory: 'Flow Movement',
    duration: 90,
    sets: 2,
    reps: '8-10 waves',
    difficulty: 'Intermediate',
    equipment: 'None',
    targetAreas: ['Entire Spine', 'Core'],
    description: 'Flowing movement that mobilizes the entire spine through wave-like motion.',
    instructions: [
      'Stand with feet hip-width apart',
      'Begin by dropping chin to chest',
      'Slowly roll down vertebra by vertebra',
      'Let arms hang heavy',
      'Reverse the movement rolling up',
      'Finish with gentle back extension'
    ],
    benefits: ['Mobilizes entire spine', 'Improves flexibility', 'Promotes fluid movement', 'Reduces stiffness'],
    precautions: ['Move slowly', 'Stop if dizzy'],
    modifications: ['Use wall for support', 'Seated version available'],
    videoUrl: null,
    imageUrl: '🌊',
    painReliefLevel: 'High',
    caloriesBurned: 25
  }
];