import React from 'react';

const ProgressBar = ({ progress, color = 'var(--accent)' }) => {
  return (
    <div style={{ width: '100%', margin: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--muted)' }}>Completion</span>
        <span style={{ fontWeight: 'bold', color: color }}>{progress}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--surface)', borderRadius: '10px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: color, 
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 10px ${color}`
          }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
