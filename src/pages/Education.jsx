import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Video, FileText, Star, Clock, User, ExternalLink, ChevronRight, Play, Award, TrendingUp } from 'lucide-react';

const Education = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  const categories = ['All', 'Anatomy', 'Exercise', 'Lifestyle', 'Treatment', 'Prevention', 'Nutrition', 'Mental Health'];

  const educationalContent = [
    {
      id: '1',
      title: 'Understanding Your Spine: Anatomy and Function',
      type: 'article',
      category: 'Anatomy',
      duration: '8 min read',
      author: 'Dr. Sarah Johnson',
      rating: 4.8,
      difficulty: 'Beginner',
      thumbnail: '🏗️',
      excerpt: 'Learn about the complex structure of your spine, how it functions, and why back pain occurs.',
      content: `
# Understanding Your Spine: Anatomy and Function

## The Spine's Basic Structure

Your spine is a remarkable structure that provides support, enables movement, and protects your spinal cord. It consists of 33 vertebrae divided into five regions:

### 1. Cervical Spine (7 vertebrae)
- Located in your neck
- Most mobile section
- Supports the weight of your head

### 2. Thoracic Spine (12 vertebrae)
- Mid-back region
- Connected to your ribs
- More stable, less mobile

### 3. Lumbar Spine (5 vertebrae)
- Lower back
- Bears most of your body weight
- Most common area for back pain

### 4. Sacrum (5 fused vertebrae)
- Part of your pelvis
- Connects spine to hip bones

### 5. Coccyx (4 fused vertebrae)
- Your tailbone
- Attachment point for muscles

## Key Components

### Vertebrae
Each vertebra has several parts:
- **Body**: The large, round part that bears weight
- **Arch**: Forms the protective ring around the spinal cord
- **Processes**: Bony projections where muscles and ligaments attach

### Intervertebral Discs
- Act as shock absorbers between vertebrae
- Consist of tough outer layer (annulus) and gel-like center (nucleus)
- Allow for spine flexibility and movement

### Facet Joints
- Connect vertebrae to each other
- Enable controlled movement
- Can become arthritic with age

### Ligaments and Muscles
- Provide stability and enable movement
- Work together to maintain proper spine alignment

## Common Sources of Back Pain

Understanding these structures helps explain why back pain occurs:

1. **Disc Problems**: Herniation, degeneration, or bulging
2. **Muscle Strain**: Overuse or sudden movements
3. **Joint Issues**: Arthritis or facet joint dysfunction
4. **Nerve Compression**: Pressure on spinal nerves
5. **Alignment Issues**: Poor posture or structural abnormalities

## Key Takeaways

- Your spine is a complex system designed for both stability and mobility
- Most back pain involves soft tissues (muscles, ligaments)
- Understanding anatomy helps you make informed decisions about treatment
- Many back problems are preventable with proper care
      `,
      tags: ['spine', 'anatomy', 'basics', 'education'],
      relatedContent: ['2', '3', '5']
    },
    {
      id: '2',
      title: 'The Science of Exercise for Back Pain',
      type: 'video',
      category: 'Exercise',
      duration: '12 min',
      author: 'Physical Therapy Institute',
      rating: 4.9,
      difficulty: 'Intermediate',
      thumbnail: '🎥',
      excerpt: 'Discover evidence-based exercises that can help reduce back pain and prevent future episodes.',
      content: `
# The Science of Exercise for Back Pain

## Why Exercise Works

Research consistently shows that exercise is one of the most effective treatments for back pain. Here's why:

### 1. Strengthens Supporting Muscles
- Core muscles provide spinal stability
- Back extensors maintain proper posture
- Hip muscles affect lower back mechanics

### 2. Improves Flexibility
- Reduces muscle tension
- Maintains joint range of motion
- Prevents compensatory movements

### 3. Enhances Blood Flow
- Delivers nutrients to spinal structures
- Reduces inflammation
- Promotes healing

### 4. Releases Natural Pain Relievers
- Exercise triggers endorphin release
- Gate control theory: movement blocks pain signals
- Improves mood and pain tolerance

## Evidence-Based Exercise Types

### Aerobic Exercise
- **Benefits**: Improves overall fitness, reduces pain sensitivity
- **Examples**: Walking, swimming, cycling
- **Frequency**: 30 minutes, 3-5 times per week

### Strengthening Exercises
- **Core Strengthening**: Planks, dead bugs, bird dogs
- **Back Extensors**: Superman, reverse fly
- **Hip Strengtheners**: Bridges, clamshells

### Flexibility Training
- **Dynamic Stretching**: Before exercise
- **Static Stretching**: After exercise
- **Yoga**: Combines strength, flexibility, and mindfulness

### Motor Control Training
- **Purpose**: Improves movement patterns
- **Examples**: Segmental rolling, quadruped exercises
- **Focus**: Quality of movement over quantity

## Exercise Prescription Guidelines

### Acute Pain Phase (0-2 weeks)
- Gentle movement to prevent stiffness
- Avoid bed rest
- Walking and basic stretches

### Subacute Phase (2-12 weeks)
- Gradual increase in activity
- Introduction of strengthening exercises
- Progress based on tolerance

### Chronic Phase (>12 weeks)
- Comprehensive exercise program
- Focus on functional movements
- Long-term maintenance plan

## Common Mistakes to Avoid

1. **Too Much, Too Soon**: Progress gradually
2. **Ignoring Pain**: Some discomfort is normal, sharp pain is not
3. **Inconsistency**: Regular exercise is key
4. **Poor Form**: Quality over quantity
5. **Neglecting Recovery**: Rest days are important

## Creating Your Exercise Plan

### Assessment First
- Identify your specific limitations
- Consider your fitness level
- Account for any medical conditions

### Start Small
- Begin with 10-15 minutes daily
- Focus on basic movements
- Build confidence and habit

### Progress Systematically
- Increase duration before intensity
- Add new exercises gradually
- Monitor your response

### Stay Consistent
- Schedule exercise like appointments
- Find activities you enjoy
- Track your progress

## The Bottom Line

Exercise is medicine for back pain. The key is finding the right type, intensity, and progression for your specific situation. When done correctly, exercise can not only reduce your current pain but also prevent future episodes.
      `,
      tags: ['exercise', 'science', 'treatment', 'evidence-based'],
      relatedContent: ['1', '4', '6']
    },
    {
      id: '3',
      title: 'Ergonomics: Setting Up Your Workspace',
      type: 'guide',
      category: 'Prevention',
      duration: '6 min read',
      author: 'Occupational Health Expert',
      rating: 4.7,
      difficulty: 'Beginner',
      thumbnail: '💻',
      excerpt: 'Learn how to create an ergonomic workspace that supports your spine and prevents back pain.',
      content: `
# Ergonomics: Setting Up Your Workspace

## Why Ergonomics Matters

Poor workplace ergonomics is a leading cause of back pain. Many people spend 8+ hours daily in suboptimal positions, creating muscle imbalances and putting excessive stress on spinal structures.

## Monitor and Screen Setup

### Height and Distance
- **Top of screen at eye level**: Prevents neck extension
- **Arm's length away**: Typically 20-26 inches
- **Slight downward gaze**: 10-20 degrees below horizontal

### Multiple Monitors
- Primary monitor directly in front
- Secondary monitor at same height
- Avoid excessive neck rotation

## Chair Selection and Setup

### Key Features
- **Adjustable height**: Feet flat on floor
- **Lumbar support**: Maintains natural spine curve
- **Armrests**: Support elbows at 90 degrees
- **Seat depth**: 2-3 inches between seat edge and knees

### Proper Positioning
- **Back against backrest**: Use lumbar support
- **Thighs parallel to floor**: Hips slightly above knees
- **Feet flat**: Use footrest if needed

## Desk and Keyboard Setup

### Desk Height
- **Elbow angle**: 90-110 degrees when typing
- **Adjustable desk**: Ideal for different tasks
- **Keyboard tray**: If desk is too high

### Keyboard and Mouse
- **Wrists neutral**: Not bent up or down
- **Close to body**: Avoid reaching
- **Mouse at same level**: As keyboard

## Standing Desk Considerations

### Benefits
- Reduces prolonged sitting
- Engages core muscles
- Improves circulation

### Proper Use
- **Alternate sitting/standing**: Every 30-60 minutes
- **Anti-fatigue mat**: Reduces leg strain
- **Monitor height**: Adjust for standing position

## Movement and Breaks

### The 20-20-20 Rule
- Every 20 minutes
- Look at something 20 feet away
- For 20 seconds

### Microbreaks
- **Every 30 minutes**: Stand and stretch
- **Change positions**: Shift weight, adjust posture
- **Walk around**: Get blood flowing

### Stretches at Your Desk
1. **Neck rolls**: Gentle circles
2. **Shoulder shrugs**: Lift and release
3. **Spinal twist**: Rotate in chair
4. **Hip flexor stretch**: Stand and step back

## Laptop Ergonomics

### The Problem
- Screen too low
- Keyboard forces hunched posture
- Often used in non-ideal locations

### Solutions
- **External monitor**: Raise screen to eye level
- **External keyboard/mouse**: When using raised screen
- **Laptop stand**: Improves screen angle
- **Limit duration**: Take frequent breaks

## Common Ergonomic Mistakes

1. **Screen too low**: Causes neck flexion
2. **Chair too high/low**: Creates awkward angles
3. **Reaching for mouse**: Strains shoulder
4. **No lumbar support**: Leads to slouching
5. **Crossing legs**: Reduces circulation

## Creating an Ergonomic Checklist

### Daily Setup
- [ ] Monitor at eye level
- [ ] Feet flat on floor
- [ ] Back supported
- [ ] Keyboard/mouse close
- [ ] Documents at eye level

### Regular Maintenance
- [ ] Adjust chair settings
- [ ] Clean and organize workspace
- [ ] Check equipment function
- [ ] Evaluate comfort level

## Beyond the Office

### Home Workspaces
- Apply same principles
- Use books to raise laptop
- Create designated work area
- Maintain boundaries

### Mobile Work
- Limit duration
- Find supportive seating
- Take frequent breaks
- Consider portable accessories

## The Investment in Health

Good ergonomics isn't just about comfort—it's about preventing long-term health issues. The cost of ergonomic equipment is minimal compared to the potential medical expenses and lost productivity from back pain.

Remember: The best posture is the next posture. Keep moving and changing positions throughout your day.
      `,
      tags: ['ergonomics', 'workplace', 'prevention', 'posture'],
      relatedContent: ['1', '7', '8']
    },
    {
      id: '4',
      title: 'Nutrition for Spinal Health',
      type: 'article',
      category: 'Nutrition',
      duration: '10 min read',
      author: 'Dr. Maria Rodriguez, RD',
      rating: 4.6,
      difficulty: 'Intermediate',
      thumbnail: '🥗',
      excerpt: 'Discover how proper nutrition can support spinal health and reduce inflammation.',
      content: `
# Nutrition for Spinal Health

## The Connection Between Diet and Back Pain

What you eat affects your spinal health in several ways:
- Inflammation levels in your body
- Bone density and strength
- Muscle function and recovery
- Overall body weight and stress on spine

## Anti-Inflammatory Foods

### Omega-3 Fatty Acids
**Sources**: Fatty fish, walnuts, flax seeds, chia seeds
**Benefits**: Reduce inflammation, support nerve health
**Recommended**: 2-3 servings of fatty fish per week

### Colorful Fruits and Vegetables
**Key Players**: Berries, leafy greens, bell peppers, tomatoes
**Why**: Rich in antioxidants that fight inflammation
**Goal**: 5-9 servings daily, variety is key

### Spices and Herbs
**Top Choices**: Turmeric, ginger, garlic, oregano
**Active Compounds**: Curcumin, gingerol, allicin
**Usage**: Fresh or dried, in cooking or teas

## Bone-Building Nutrients

### Calcium
**Sources**: Dairy, leafy greens, almonds, sardines
**Daily Needs**: 1000-1200mg for adults
**Absorption**: Best with vitamin D and magnesium

### Vitamin D
**Sources**: Sunlight, fatty fish, fortified foods
**Function**: Calcium absorption, bone health
**Testing**: Check blood levels annually

### Magnesium
**Sources**: Nuts, seeds, whole grains, dark chocolate
**Role**: Bone formation, muscle function
**Deficiency**: Common in modern diets

### Vitamin K
**Sources**: Leafy greens, broccoli, Brussels sprouts
**Function**: Bone protein synthesis
**Forms**: K1 (plants) and K2 (fermented foods)

## Muscle-Supporting Nutrition

### Protein
**Sources**: Lean meats, fish, eggs, legumes, quinoa
**Needs**: 0.8-1.2g per kg body weight
**Timing**: Spread throughout the day

### B Vitamins
**Sources**: Whole grains, eggs, leafy greens
**Function**: Energy production, nerve health
**B12**: Especially important for vegetarians

### Vitamin C
**Sources**: Citrus fruits, berries, bell peppers
**Role**: Collagen synthesis, tissue repair
**Daily**: 75-90mg for adults

## Foods That May Increase Inflammation

### Processed Foods
- Packaged snacks
- Fast food
- Processed meats
**Why Avoid**: High in trans fats, additives

### Excess Sugar
- Sodas and sweet drinks
- Candy and desserts
- Hidden sugars in sauces
**Impact**: Promotes inflammation

### Refined Grains
- White bread
- White rice
- Most crackers
**Problem**: Lack nutrients, spike blood sugar

### Excess Omega-6 Oils
- Corn oil
- Soybean oil
- Many restaurant foods
**Issue**: Can promote inflammation when excessive

## Hydration for Spinal Health

### Why Water Matters
- Maintains disc hydration
- Supports nutrient transport
- Aids waste removal
- Prevents muscle cramps

### How Much
- General rule: Half your body weight in ounces
- More if active or in hot climate
- Monitor urine color (pale yellow ideal)

### Best Sources
- Plain water
- Herbal teas
- Water-rich foods (fruits, vegetables)

## Special Considerations

### Weight Management
**Connection**: Excess weight increases spinal stress
**Approach**: Gradual, sustainable changes
**Focus**: Nutrient density over restriction

### Food Sensitivities
**Common Triggers**: Gluten, dairy, nightshades
**Identification**: Elimination diet or testing
**Impact**: May increase inflammation in sensitive individuals

### Gut Health
**Connection**: Gut inflammation affects systemic inflammation
**Support**: Fiber, probiotics, fermented foods
**Avoid**: Excessive antibiotics, processed foods

## Sample Anti-Inflammatory Day

### Breakfast
- Oatmeal with berries and walnuts
- Green tea

### Lunch
- Salmon salad with mixed greens
- Olive oil and lemon dressing
- Whole grain roll

### Snack
- Apple slices with almond butter

### Dinner
- Grilled chicken with turmeric
- Roasted vegetables
- Quinoa

### Hydration
- Water throughout the day
- Herbal tea in evening

## Supplements to Consider

### Omega-3s
**When**: If not eating enough fish
**Dose**: 1-2g EPA/DHA daily
**Quality**: Third-party tested

### Vitamin D
**When**: Limited sun exposure or low blood levels
**Dose**: 1000-4000 IU daily (based on testing)
**Form**: D3 preferred

### Magnesium
**When**: Muscle cramps, poor sleep
**Dose**: 200-400mg daily
**Form**: Glycinate or citrate

### Turmeric/Curcumin
**When**: Chronic inflammation
**Dose**: 500-1000mg daily
**Enhancement**: With black pepper for absorption

## Practical Implementation

### Meal Planning
- Plan anti-inflammatory meals weekly
- Prep ingredients in advance
- Keep healthy snacks available

### Grocery Shopping
- Shop perimeter first (fresh foods)
- Read labels carefully
- Choose organic when possible for dirty dozen

### Cooking Methods
- Favor baking, steaming, sautéing
- Use herbs and spices liberally
- Minimize high-heat cooking

### Dining Out
- Choose grilled over fried
- Ask for dressings on side
- Focus on vegetables and lean proteins

## Monitoring Progress

### Keep a Food Diary
- Track what you eat
- Note pain levels
- Identify patterns

### Work with Professionals
- Registered dietitian
- Functional medicine doctor
- Regular blood work

Remember: Nutrition is one piece of the puzzle. Combine good eating habits with exercise, stress management, and proper sleep for optimal spinal health.
      `,
      tags: ['nutrition', 'inflammation', 'diet', 'health'],
      relatedContent: ['5', '8', '9']
    },
    {
      id: '5',
      title: 'Stress and Back Pain: The Mind-Body Connection',
      type: 'article',
      category: 'Mental Health',
      duration: '7 min read',
      author: 'Dr. James Chen, Psychologist',
      rating: 4.8,
      difficulty: 'Intermediate',
      thumbnail: '🧠',
      excerpt: 'Explore the relationship between stress, emotions, and back pain, plus strategies for management.',
      tags: ['stress', 'mental health', 'mind-body', 'coping'],
      relatedContent: ['6', '7', '10']
    },
    {
      id: '6',
      title: 'Sleep Position and Back Pain',
      type: 'guide',
      category: 'Lifestyle',
      duration: '5 min read',
      author: 'Sleep Medicine Specialist',
      rating: 4.5,
      difficulty: 'Beginner',
      thumbnail: '😴',
      excerpt: 'Learn optimal sleep positions and pillow arrangements to reduce back pain.',
      tags: ['sleep', 'posture', 'pillows', 'rest'],
      relatedContent: ['3', '5', '7']
    },
    {
      id: '7',
      title: 'Travel Tips for Back Pain Sufferers',
      type: 'guide',
      category: 'Lifestyle',
      duration: '8 min read',
      author: 'Travel Health Expert',
      rating: 4.4,
      difficulty: 'Beginner',
      thumbnail: '✈️',
      excerpt: 'Essential tips for maintaining spinal health while traveling.',
      tags: ['travel', 'airplane', 'car', 'tips'],
      relatedContent: ['3', '6', '8']
    },
    {
      id: '8',
      title: 'Advanced Core Strengthening Techniques',
      type: 'video',
      category: 'Exercise',
      duration: '15 min',
      author: 'Elite Physical Therapy',
      rating: 4.9,
      difficulty: 'Advanced',
      thumbnail: '💪',
      excerpt: 'Take your core training to the next level with advanced stabilization exercises.',
      tags: ['core', 'advanced', 'strengthening', 'stability'],
      relatedContent: ['2', '9', '10']
    }
  ];

  const filteredContent = useMemo(() => {
    return educationalContent.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const featuredContent = useMemo(() => {
    return educationalContent.filter(item => item.rating >= 4.7).slice(0, 3);
  }, []);

  const toggleCompleted = (id) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedItems(newCompleted);
  };

  const toggleBookmark = (id) => {
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
    } else {
      newBookmarked.add(id);
    }
    setBookmarkedItems(newBookmarked);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <Video size={16} />;
      case 'guide': return <BookOpen size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#48bb78';
      case 'Intermediate': return '#ed8936';
      case 'Advanced': return '#f56565';
      default: return '#667eea';
    }
  };

  const stats = useMemo(() => {
    return {
      totalContent: educationalContent.length,
      completed: completedItems.size,
      bookmarked: bookmarkedItems.size,
      averageRating: (educationalContent.reduce((sum, item) => sum + item.rating, 0) / educationalContent.length).toFixed(1)
    };
  }, [completedItems, bookmarkedItems]);

  return (
    <div>
      <div className="page-header">
        <h2>Education Center</h2>
        <p>Evidence-based resources to help you understand and manage your back pain</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {stats.totalContent}
          </div>
          <div className="stat-label">Educational Resources</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#48bb78' }}>
            {stats.completed}
          </div>
          <div className="stat-label">Items Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ed8936' }}>
            {stats.bookmarked}
          </div>
          <div className="stat-label">Bookmarked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f56565' }}>
            {stats.averageRating}
          </div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="modal-overlay" onClick={() => setSelectedContent(null)}>
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{selectedContent.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {getTypeIcon(selectedContent.type)}
                    {selectedContent.type}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    {selectedContent.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={14} />
                    {selectedContent.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} />
                    {selectedContent.rating}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedContent(null)}>×</button>
            </div>
            
            <div style={{ padding: '0 2rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {selectedContent.type === 'video' ? (
                <div style={{
                  backgroundColor: '#f7fafc',
                  border: '2px dashed #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '3rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <Play size={48} color="#667eea" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>Video Content</h4>
                  <p style={{ margin: 0, color: '#718096' }}>
                    In a real application, this would contain the actual video player.
                  </p>
                </div>
              ) : null}
              
              <div style={{ 
                whiteSpace: 'pre-line', 
                lineHeight: '1.6', 
                color: '#2d3748',
                fontSize: '1rem' 
              }}>
                {selectedContent.content || selectedContent.excerpt}
              </div>

              {selectedContent.tags && (
                <div style={{ marginTop: '2rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Tags:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedContent.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e2e8f0',
                        color: '#4a5568',
                        borderRadius: '1rem',
                        fontSize: '0.75rem'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn ${completedItems.has(selectedContent.id) ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => toggleCompleted(selectedContent.id)}
                >
                  {completedItems.has(selectedContent.id) ? (
                    <>
                      <Award size={16} />
                      Completed
                    </>
                  ) : (
                    'Mark Complete'
                  )}
                </button>
                <button 
                  className={`btn ${bookmarkedItems.has(selectedContent.id) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleBookmark(selectedContent.id)}
                >
                  <Star size={16} />
                  {bookmarkedItems.has(selectedContent.id) ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedContent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
              <Search size={16} color="#718096" />
              <input
                type="text"
                placeholder="Search articles, videos, and guides..."
                className="form-input"
                style={{ width: '100%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`btn btn-small ${activeCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      {activeCategory === 'All' && searchTerm === '' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} />
              Featured Content
            </h3>
          </div>
          <div className="card-content">
            <div className="grid grid-3">
              {featuredContent.map(item => (
                <FeaturedContentCard 
                  key={item.id}
                  item={item}
                  onSelect={setSelectedContent}
                  isCompleted={completedItems.has(item.id)}
                  isBookmarked={bookmarkedItems.has(item.id)}
                  getTypeIcon={getTypeIcon}
                  getDifficultyColor={getDifficultyColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-3">
        {filteredContent.map(item => (
          <ContentCard 
            key={item.id}
            item={item}
            onSelect={setSelectedContent}
            onToggleCompleted={toggleCompleted}
            onToggleBookmark={toggleBookmark}
            isCompleted={completedItems.has(item.id)}
            isBookmarked={bookmarkedItems.has(item.id)}
            getTypeIcon={getTypeIcon}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="card">
          <div className="card-content">
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
              No content found matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        </div>
      )}

      {/* Learning Path Recommendations */}
      {activeCategory === 'All' && searchTerm === '' && (
        <LearningPaths educationalContent={educationalContent} onSelectContent={setSelectedContent} />
      )}
    </div>
  );
};

// Featured Content Card Component
const FeaturedContentCard = ({ item, onSelect, isCompleted, isBookmarked, getTypeIcon, getDifficultyColor }) => (
  <div 
    className="card" 
    style={{ cursor: 'pointer', border: '2px solid #667eea' }}
    onClick={() => onSelect(item)}
  >
    <div className="card-content">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {item.thumbnail}
        </div>
        <span style={{
          padding: '0.25rem 0.75rem',
          backgroundColor: '#667eea',
          color: 'white',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          Featured
        </span>
      </div>
      
      <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1rem' }}>
        {item.title}
      </h4>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: '#718096' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {getTypeIcon(item.type)}
          {item.duration}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Star size={14} />
          {item.rating}
        </span>
      </div>
      
      <p style={{ margin: '0 0 1rem', color: '#4a5568', fontSize: '0.875rem', lineHeight: '1.4' }}>
        {item.excerpt}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: getDifficultyColor(item.difficulty),
          color: 'white',
          borderRadius: '0.25rem',
          fontSize: '0.75rem'
        }}>
          {item.difficulty}
        </span>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isCompleted && <Award size={16} color="#48bb78" />}
          {isBookmarked && <Star size={16} color="#ed8936" />}
        </div>
      </div>
    </div>
  </div>
);

// Content Card Component
const ContentCard = ({ item, onSelect, onToggleCompleted, onToggleBookmark, isCompleted, isBookmarked, getTypeIcon, getDifficultyColor }) => (
  <div className="card" style={{ cursor: 'pointer' }}>
    <div className="card-content" onClick={() => onSelect(item)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>
          {item.thumbnail}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isCompleted && <Award size={16} color="#48bb78" />}
          {isBookmarked && <Star size={16} color="#ed8936" />}
        </div>
      </div>
      
      <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1rem' }}>
        {item.title}
      </h4>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {getTypeIcon(item.type)}
          {item.duration}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Star size={14} />
          {item.rating}
        </span>
      </div>
      
      <p style={{ margin: '0 0 1rem', color: '#4a5568', fontSize: '0.875rem', lineHeight: '1.4' }}>
        {item.excerpt}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: getDifficultyColor(item.difficulty),
          color: 'white',
          borderRadius: '0.25rem',
          fontSize: '0.75rem'
        }}>
          {item.difficulty}
        </span>
        
        <span style={{ fontSize: '0.75rem', color: '#718096' }}>
          by {item.author}
        </span>
      </div>
    </div>

    <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
      <button 
        className={`btn btn-small ${isCompleted ? 'btn-success' : 'btn-secondary'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompleted(item.id);
        }}
        style={{ flex: 1 }}
      >
        {isCompleted ? 'Completed' : 'Mark Complete'}
      </button>
      <button 
        className={`btn btn-small ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(item.id);
        }}
      >
        <Star size={14} />
      </button>
    </div>
  </div>
);

// Learning Paths Component
const LearningPaths = ({ educationalContent, onSelectContent }) => {
  const learningPaths = [
    {
      id: 'beginner',
      title: 'Back Pain Basics',
      description: 'Start here if you\'re new to back pain management',
      icon: '🎯',
      contentIds: ['1', '3', '6'],
      difficulty: 'Beginner',
      estimatedTime: '25 min'
    },
    {
      id: 'exercise',
      title: 'Exercise & Movement',
      description: 'Learn evidence-based exercises for back pain relief',
      icon: '💪',
      contentIds: ['2', '8'],
      difficulty: 'All Levels',
      estimatedTime: '30 min'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Optimization',
      description: 'Comprehensive lifestyle changes for long-term health',
      icon: '🌟',
      contentIds: ['4', '5', '7'],
      difficulty: 'Intermediate',
      estimatedTime: '40 min'
    }
  ];

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h3>Recommended Learning Paths</h3>
        <p style={{ margin: '0.5rem 0 0', color: '#718096', fontSize: '0.875rem' }}>
          Structured learning sequences tailored to your needs
        </p>
      </div>
      <div className="card-content">
        <div className="grid grid-3">
          {learningPaths.map(path => {
            const pathContent = path.contentIds.map(id => 
              educationalContent.find(content => content.id === id)
            ).filter(Boolean);

            return (
              <div key={path.id} style={{
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                backgroundColor: '#f7fafc'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {path.icon}
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>
                    {path.title}
                  </h4>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                    {path.description}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
                    <span>{path.difficulty}</span>
                    <span>{path.estimatedTime}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pathContent.map((content, index) => (
                      <button
                        key={content.id}
                        onClick={() => onSelectContent(content)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ 
                          width: '1.5rem', 
                          height: '1.5rem', 
                          borderRadius: '50%', 
                          backgroundColor: '#667eea', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ flex: 1 }}>{content.title}</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Start Learning Path
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Education;