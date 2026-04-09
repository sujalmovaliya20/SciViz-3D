import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ExperimentCard.css';

const ExperimentCard = ({ experiment }) => {
  const navigate = useNavigate();
  const {
    title,
    subject,
    class: cls,
    chapter,
    difficulty,
    duration,
    sceneKey,
    isCompleted
  } = experiment;

  const difficultyDots = () => {
    const total = 3;
    const active = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
    return (
      <div className="diff-dots">
        {[...Array(total)].map((_, i) => (
          <span 
            key={i} 
            className={`dot ${i < active ? 'active' : ''}`} 
            style={{ backgroundColor: i < active ? `var(--${difficulty}-color)` : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <div className="experiment-card" onClick={() => navigate(`/experiment/${sceneKey}`)}>
        <div className="card-top">
          <div className="badges">
            <span className={`badge subject ${subject}`}>{subject}</span>
            <span className="badge class">CL-{cls}</span>
          </div>
          {isCompleted && <CheckCircle size={18} className="completed-icon" />}
        </div>

        <div className="preview-mesh" style={{ 
          background: `radial-gradient(circle at center, var(--${subject}-color) 0%, transparent 70%)`,
          opacity: 0.15
        }}>
          {/* 3D placeholder animation here */}
        </div>

        <div className="card-body">
          <span className="chapter-label mono">{chapter}</span>
          <h3 className="experiment-title syne-bold">{title}</h3>
          
          <div className="card-footer">
            <div className="footer-meta">
              {difficultyDots()}
              <div className="duration-badge">
                <Clock size={12} />
                <span>{duration}m</span>
              </div>
            </div>
            
            <div className="cta-link">
              <span>Open</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperimentCard;
