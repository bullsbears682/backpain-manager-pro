import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, AlertTriangle, Activity, Zap, Heart } from 'lucide-react';

const PainScale = ({ onPainSelect, selectedLevel = null, showLabels = true, size = 'normal' }) => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseLevel, setPulseLevel] = useState(null);

  const painLevels = [
    { 
      level: 0, 
      label: 'No Pain', 
      description: 'Feeling great!',
      color: '#10b981', 
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      icon: <Heart size={16} />,
      emoji: '😊',
      intensity: 'none'
    },
    { 
      level: 1, 
      label: 'Minimal', 
      description: 'Very mild discomfort',
      color: '#22c55e', 
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      icon: <Smile size={16} />,
      emoji: '🙂',
      intensity: 'minimal'
    },
    { 
      level: 2, 
      label: 'Mild', 
      description: 'Slightly noticeable',
      color: '#84cc16', 
      gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
      icon: <Smile size={16} />,
      emoji: '😐',
      intensity: 'mild'
    },
    { 
      level: 3, 
      label: 'Mild+', 
      description: 'Noticeable but manageable',
      color: '#eab308', 
      gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
      icon: <Meh size={16} />,
      emoji: '😕',
      intensity: 'mild-plus'
    },
    { 
      level: 4, 
      label: 'Moderate', 
      description: 'Interferes with some activities',
      color: '#f59e0b', 
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      icon: <Meh size={16} />,
      emoji: '😞',
      intensity: 'moderate'
    },
    { 
      level: 5, 
      label: 'Moderate+', 
      description: 'Significantly interferes',
      color: '#f97316', 
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      icon: <Frown size={16} />,
      emoji: '😣',
      intensity: 'moderate-plus'
    },
    { 
      level: 6, 
      label: 'Severe', 
      description: 'Interferes with concentration',
      color: '#ef4444', 
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      icon: <Frown size={16} />,
      emoji: '😖',
      intensity: 'severe'
    },
    { 
      level: 7, 
      label: 'Severe+', 
      description: 'Dominates your senses',
      color: '#dc2626', 
      gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      icon: <AlertTriangle size={16} />,
      emoji: '😫',
      intensity: 'severe-plus'
    },
    { 
      level: 8, 
      label: 'Intense', 
      description: 'Physical activity severely limited',
      color: '#b91c1c', 
      gradient: 'linear-gradient(135deg, #b91c1c, #991b1b)',
      icon: <AlertTriangle size={16} />,
      emoji: '😩',
      intensity: 'intense'
    },
    { 
      level: 9, 
      label: 'Excruciating', 
      description: 'Unable to converse',
      color: '#991b1b', 
      gradient: 'linear-gradient(135deg, #991b1b, #7f1d1d)',
      icon: <Zap size={16} />,
      emoji: '😰',
      intensity: 'excruciating'
    },
    { 
      level: 10, 
      label: 'Unbearable', 
      description: 'Unconsciousness',
      color: '#7f1d1d', 
      gradient: 'linear-gradient(135deg, #7f1d1d, #450a0a)',
      icon: <Activity size={16} />,
      emoji: '😵',
      intensity: 'unbearable'
    }
  ];

  const sizes = {
    small: { width: 40, height: 40, fontSize: '0.875rem', gap: '0.5rem' },
    normal: { width: 60, height: 60, fontSize: '1rem', gap: '0.75rem' },
    large: { width: 80, height: 80, fontSize: '1.25rem', gap: '1rem' }
  };

  const currentSize = sizes[size];

  useEffect(() => {
    if (selectedLevel !== null) {
      setIsAnimating(true);
      setPulseLevel(selectedLevel);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPulseLevel(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedLevel]);

  const handleLevelClick = (level) => {
    setIsAnimating(true);
    setPulseLevel(level);
    onPainSelect?.(level);

    // Create ripple effect
    const rippleTimer = setTimeout(() => {
      setIsAnimating(false);
      setPulseLevel(null);
    }, 800);

    return () => clearTimeout(rippleTimer);
  };

  const handleLevelHover = (level) => {
    setHoveredLevel(level);
  };

  const handleLevelLeave = () => {
    setHoveredLevel(null);
  };

  // Get the active level for display (selected, hovered, or null)
  const activeLevel = selectedLevel !== null ? selectedLevel : hoveredLevel;
  const activePainData = activeLevel !== null ? painLevels[activeLevel] : null;

  return (
    <div style={{
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: activePainData ? 
          `radial-gradient(circle at center, ${activePainData.color}10 0%, transparent 70%)` :
          'none',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          background: activePainData ? 
            `linear-gradient(135deg, white, ${activePainData.color})` :
            'linear-gradient(135deg, #ffffff, #e0f2fe)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.5s ease'
        }}>
          How is your pain today?
        </h3>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          Select the number that best describes your current pain level
        </p>

        {/* Active Level Display */}
        {activePainData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 2rem',
            background: `${activePainData.color}20`,
            borderRadius: '2rem',
            border: `2px solid ${activePainData.color}40`,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: selectedLevel === activePainData.level ? 'scale(1.05)' : 'scale(1)'
          }}>
            <div style={{
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
            }}>
              {activePainData.emoji}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.25rem'
              }}>
                {activePainData.level}/10 - {activePainData.label}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem'
              }}>
                {activePainData.description}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pain Scale Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(11, 1fr)',
        gap: currentSize.gap,
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        {painLevels.map((painData) => {
          const isSelected = selectedLevel === painData.level;
          const isHovered = hoveredLevel === painData.level;
          const isPulsing = pulseLevel === painData.level;
          const isActive = isSelected || isHovered;

          return (
            <div
              key={painData.level}
              role="button"
              tabIndex={0}
              aria-label={`Pain level ${painData.level}: ${painData.label} - ${painData.description}`}
              style={{
                width: currentSize.width,
                height: currentSize.height,
                borderRadius: '50%',
                background: isActive ? painData.gradient : 'rgba(255, 255, 255, 0.1)',
                border: isSelected ? 
                  `3px solid white` : 
                  isHovered ? 
                    `2px solid ${painData.color}` : 
                    '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 
                  'scale(1.3) translateY(-8px)' : 
                  isHovered ? 
                    'scale(1.2) translateY(-4px)' : 
                    'scale(1)',
                boxShadow: isSelected ? 
                  `0 12px 40px ${painData.color}60, 0 0 30px ${painData.color}40` :
                  isHovered ? 
                    `0 8px 25px ${painData.color}40` :
                    'none',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontSize: currentSize.fontSize,
                fontWeight: '900',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                animation: isPulsing ? 'painPulse 0.8s ease-out' : 'none'
              }}
              onMouseEnter={() => handleLevelHover(painData.level)}
              onMouseLeave={handleLevelLeave}
              onClick={() => handleLevelClick(painData.level)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLevelClick(painData.level);
                }
              }}
            >
              {/* Ripple Effect */}
              {isPulsing && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `${painData.color}40`,
                  transform: 'translate(-50%, -50%)',
                  animation: 'ripple 0.8s ease-out',
                  pointerEvents: 'none'
                }} />
              )}

              {/* Level Number */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                textShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                {painData.level}
              </div>

              {/* Hover Icon */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-5px',
                  background: painData.gradient,
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  animation: 'bounceIn 0.3s ease-out'
                }}>
                  {painData.icon}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Scale Bar */}
      <div style={{
        height: '8px',
        background: 'linear-gradient(90deg, #10b981, #22c55e, #84cc16, #eab308, #f59e0b, #f97316, #ef4444, #dc2626, #b91c1c, #991b1b, #7f1d1d)',
        borderRadius: '4px',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Active Position Indicator */}
        {activeLevel !== null && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: `${(activeLevel / 10) * 100}%`,
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            animation: selectedLevel === activeLevel ? 'bounce 0.5s ease' : 'none'
          }} />
        )}
      </div>

      {/* Labels (if enabled) */}
      {showLabels && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: '600'
        }}>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            0-3: Mild Pain
          </div>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(245, 158, 11, 0.2)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            4-6: Moderate Pain
          </div>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            7-10: Severe Pain
          </div>
        </div>
      )}

      {/* Accessibility Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center'
      }}>
        Click or use keyboard to select • Tab to navigate • Enter to confirm
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes painPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); box-shadow: 0 0 50px currentColor; }
          100% { transform: scale(1.3) translateY(-8px); }
        }
        
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate(-50%, 0);
          }
          40%, 43% {
            transform: translate(-50%, -8px);
          }
          70% {
            transform: translate(-50%, -4px);
          }
          90% {
            transform: translate(-50%, -2px);
          }
        }
      `}</style>
    </div>
  );
};

export default PainScale;