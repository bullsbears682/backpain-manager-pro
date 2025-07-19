import React from 'react';

const PainScale = ({ value, onChange, showLabels = true, size = 'normal' }) => {
  const painLevels = [
    { value: 0, label: 'No Pain', color: '#10b981', bgColor: '#dcfce7' },
    { value: 1, label: 'Very Mild', color: '#059669', bgColor: '#d1fae5' },
    { value: 2, label: 'Mild', color: '#16a34a', bgColor: '#bbf7d0' },
    { value: 3, label: 'Mild+', color: '#65a30d', bgColor: '#ecfccb' },
    { value: 4, label: 'Moderate', color: '#ca8a04', bgColor: '#fef3c7' },
    { value: 5, label: 'Moderate+', color: '#ea580c', bgColor: '#fed7aa' },
    { value: 6, label: 'Severe', color: '#dc2626', bgColor: '#fecaca' },
    { value: 7, label: 'Very Severe', color: '#b91c1c', bgColor: '#fca5a5' },
    { value: 8, label: 'Intense', color: '#991b1b', bgColor: '#f87171' },
    { value: 9, label: 'Excruciating', color: '#7f1d1d', bgColor: '#ef4444' },
    { value: 10, label: 'Unbearable', color: '#450a0a', bgColor: '#dc2626' }
  ];

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'grid-cols-5 gap-2',
          item: 'p-2',
          number: 'text-lg',
          label: 'text-xs'
        };
      case 'large':
        return {
          container: 'grid-cols-11 gap-3',
          item: 'p-4',
          number: 'text-2xl',
          label: 'text-sm'
        };
      default:
        return {
          container: 'grid-cols-11 gap-3',
          item: 'p-3',
          number: 'text-xl',
          label: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div 
      className="pain-scale"
      role="radiogroup"
      aria-label="Pain level scale from 0 to 10"
    >
      {painLevels.map((level, index) => {
        const isSelected = value === level.value;
        const isLowPain = level.value <= 3;
        const isModeratePain = level.value >= 4 && level.value <= 6;
        const isHighPain = level.value >= 7;
        
        return (
          <div
            key={level.value}
            className={`pain-scale-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onChange(level.value)}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Pain level ${level.value}: ${level.label}`}
            tabIndex={value === level.value ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(level.value);
              } else if (e.key === 'ArrowLeft' && index > 0) {
                onChange(painLevels[index - 1].value);
              } else if (e.key === 'ArrowRight' && index < painLevels.length - 1) {
                onChange(painLevels[index + 1].value);
              }
            }}
            style={{
              background: isSelected 
                ? `linear-gradient(135deg, ${level.color}, ${level.color}dd)` 
                : 'var(--bg-primary)',
              borderColor: isSelected ? level.color : 'var(--border-primary)',
              borderWidth: isSelected ? '2px' : '1px',
              boxShadow: isSelected 
                ? `0 8px 25px ${level.color}40, 0 0 0 3px ${level.color}20` 
                : 'var(--shadow-sm)',
              transform: isSelected ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Background gradient indicator */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${level.bgColor}80, ${level.color}20)`,
                borderRadius: 'inherit',
                opacity: isSelected ? 0.2 : 0.1,
                transition: 'opacity 0.3s ease'
              }}
            />
            
            {/* Number */}
            <div 
              className="pain-scale-number"
              style={{ 
                color: isSelected ? 'white' : level.color,
                fontWeight: isSelected ? '900' : '800',
                textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                position: 'relative',
                zIndex: 1
              }}
            >
              {level.value}
            </div>
            
            {/* Visual intensity indicator */}
            <div
              style={{
                width: '100%',
                height: '3px',
                background: `linear-gradient(90deg, ${level.bgColor}, ${level.color})`,
                borderRadius: '2px',
                marginBottom: '0.25rem',
                opacity: isSelected ? 1 : 0.6,
                position: 'relative',
                zIndex: 1
              }}
            />
            
            {/* Label */}
            {showLabels && (
              <div 
                className="pain-scale-label"
                style={{ 
                  color: isSelected ? 'white' : 'var(--text-secondary)',
                  fontWeight: isSelected ? '700' : '600',
                  textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {level.label}
              </div>
            )}
            
            {/* Pulse animation for selected high pain levels */}
            {isSelected && isHighPain && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120%',
                  height: '120%',
                  border: `2px solid ${level.color}`,
                  borderRadius: 'inherit',
                  animation: 'pulse 2s infinite',
                  opacity: 0.6,
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        );
      })}
      
      {/* Pain level descriptions */}
      <div 
        style={{
          gridColumn: '1 / -1',
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-primary)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {value !== null ? `Current Level: ${value} - ${painLevels[value]?.label}` : 'Select your pain level'}
          </span>
          {value !== null && (
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: painLevels[value]?.color,
                boxShadow: `0 0 8px ${painLevels[value]?.color}50`
              }}
            />
          )}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Use the scale above to indicate your current pain level. 0 means no pain, while 10 represents unbearable pain.
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default PainScale;