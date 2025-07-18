import React from 'react';

const PainScale = ({ value, onChange, showLabels = true }) => {
  const painLevels = [
    { value: 0, label: 'No Pain', color: '#48bb78' },
    { value: 1, label: 'Very Mild', color: '#68d391' },
    { value: 2, label: 'Mild', color: '#9ae6b4' },
    { value: 3, label: 'Mild+', color: '#c6f6d5' },
    { value: 4, label: 'Moderate', color: '#fbb6ce' },
    { value: 5, label: 'Moderate+', color: '#f687b3' },
    { value: 6, label: 'Severe', color: '#ed64a6' },
    { value: 7, label: 'Very Severe', color: '#d53f8c' },
    { value: 8, label: 'Intense', color: '#b83280' },
    { value: 9, label: 'Excruciating', color: '#97266d' },
    { value: 10, label: 'Unbearable', color: '#702459' }
  ];

  return (
    <div className="pain-scale">
      {painLevels.map(level => (
        <div
          key={level.value}
          className={`pain-scale-item ${value === level.value ? 'selected' : ''}`}
          onClick={() => onChange(level.value)}
          style={{
            backgroundColor: value === level.value ? level.color : 'transparent',
            borderColor: level.color
          }}
        >
          <div 
            className="pain-scale-number"
            style={{ color: value === level.value ? 'white' : level.color }}
          >
            {level.value}
          </div>
          {showLabels && (
            <div 
              className="pain-scale-label"
              style={{ color: value === level.value ? 'white' : '#718096' }}
            >
              {level.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PainScale;