import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  HelpCircle,
  BarChart2,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import useExperimentStore from '../hooks/useExperimentStore';
import sceneRegistry from '../experiments';
import QuizModal from '../components/QuizModal';
import AtomLoader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import experimentConcepts from '../data/experimentConcepts';
import './ExperimentViewer.css';

const MissingScene = ({ sceneKey }) => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#ff4d6d" />
  </mesh>
);

const ExperimentViewer = () => {
  const { sceneKey } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [sceneKey_reset, setResetKey] = useState(0);
  const { user } = useAuth();
  
  const stepsContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const el = stepsContainerRef.current;
    if (!el) return;
    // Add small tolerance pixel amount for being at bottom
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    setIsAtBottom(atBottom);
  };
  
  const {
    experiment,
    currentStep,
    isPlaying,
    controlValues,
    loading,
    fetchExperiment,
    setStep,
    nextStep,
    prevStep,
    togglePlay,
    setIsPlaying
  } = useExperimentStore();

  useEffect(() => {
    fetchExperiment(sceneKey);
  }, [sceneKey, fetchExperiment]);

  // Auto-scroll to active step when currentStep changes:
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const activeStep = container.querySelector('.step-item.active');
    if (activeStep) {
      activeStep.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }, [currentStep]);

  // Auto-save logic
  useEffect(() => {
    if (!user || !experiment) return;
    
    const saveProgress = async () => {
      try {
        await api.post('/api/progress/update', {
          experimentId: experiment._id,
          currentStep,
          totalSteps: experiment.steps?.length || 5,
          completionPercent: Math.round((currentStep / 
            ((experiment.steps?.length || 5) - 1)) * 100)
        });
      } catch (err) {
        console.error('Progress save error:', err);
      }
    };
    
    const debounce = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounce);
  }, [currentStep, experiment, user]);

  // Keyboard shortcuts
  useEffect(() => {
    const totalSteps = experiment?.steps?.length || 5;
    const handleKeydown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setStep(Math.min(currentStep + 1, totalSteps - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setStep(Math.max(currentStep - 1, 0));
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [currentStep, experiment, togglePlay, setStep]);

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
    setResetKey(prev => prev + 1);
    toast.success('Scene reset', { duration: 1000 });
  };

  const concepts = experimentConcepts[sceneKey] || {
    formula: "—",
    formulaLabel: "Formula",
    concepts: [
      { title: "Concept 1", description: "Load the experiment to see key concepts." }
    ]
  };

  if (loading || !experiment) {
    return <AtomLoader />;
  }

  let SceneComponent = null;
  if (experiment?.sceneKey) {
    const normalizedKey = experiment.sceneKey.toLowerCase().trim();
    SceneComponent = sceneRegistry[normalizedKey];

    if (!SceneComponent) {
      const partialMatch = Object.keys(sceneRegistry).find(k => 
        k.includes(normalizedKey) || normalizedKey.includes(k)
      );
      if (partialMatch) {
        SceneComponent = sceneRegistry[partialMatch];
      }
    }
  }

  if (!SceneComponent) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', color: '#ff4d6d', fontFamily: 'monospace' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <div>No scene registered for: <b>{experiment?.sceneKey}</b></div>
        <div style={{ color: '#4a5a7a', marginTop: '0.5rem', fontSize: '12px' }}>Check src/experiments/index.js</div>
      </div>
    );
  }

  return (
    <div className="viewer-layout">
      {/* ← Back to Explore */}
      <button
        onClick={() => navigate('/explore')}
        className="viewer-back-btn"
      >
        ← Back to Explore
      </button>
      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal 
          experimentId={experiment?._id}
          quizData={experiment?.quiz || []}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Left Panel: Guide & Controls */}
      <aside className={`viewer-sidebar glass ${showMobileSheet ? 'mobile-open' : ''}`}>
        <div className="mobile-handle" onClick={() => setShowMobileSheet(!showMobileSheet)} />
        
        <div className="sidebar-top">
          <div className="experiment-meta">
            <span className={`badge ${experiment?.subject || 'unknown'}`}>{experiment?.subject || 'Unknown'}</span>
            <h1 className="syne-bold">{experiment?.title || 'Experiment'}</h1>
          </div>

          <div className="guide-panel">
            <div className="guide-header">
              <span>📖</span>
              <span style={{ fontWeight: 700, letterSpacing: '2px', color: '#4a5a7a' }}>GUIDE</span>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div 
                className="guide-steps-container"
                ref={stepsContainerRef}
                onScroll={handleScroll}
              >
                {(experiment?.steps || []).map((step, index) => (
                  <div
                    key={index}
                    className={`step-item ${currentStep === index ? 'active' : ''}`}
                    onClick={() => setStep(index)}
                  >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-title">{step.title}</div>
                      {currentStep === index && (
                        <div className="step-desc">{step.description}</div>
                      )}
                    </div>
                    {currentStep === index && (
                      <div className="step-indicator">▶</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bottom fade — only show when not scrolled to bottom */}
              {!isAtBottom && experiment?.steps?.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'linear-gradient(to bottom, transparent, #0d1117)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    animation: 'bounce 1.5s infinite'
                  }}>
                    <div style={{ 
                      width: '16px', height: '16px',
                      borderRight: '2px solid #4a5a7a',
                      borderBottom: '2px solid #4a5a7a',
                      transform: 'rotate(45deg)'
                    }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'center',
              padding: '12px 16px 8px',
              borderTop: '1px solid #1e2a3a'
            }}>
              {(experiment?.steps || []).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: i === currentStep ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === currentStep 
                      ? '#00e5ff' 
                      : i < currentStep 
                        ? '#1e4a5a' 
                        : '#1e2a3a',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
            
            {/* Step navigation */}
            <div className="step-nav" style={{ borderTop: 'none', marginTop: 0 }}>
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="step-btn"
              >
                ← Prev
              </button>
              <span className="step-counter">
                {currentStep + 1} / {experiment?.steps?.length || 5}
              </span>
              <button 
                onClick={nextStep}
                disabled={currentStep === (experiment?.steps?.length || 1) - 1}
                className="step-btn primary"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button 
            className="quiz-trigger glass" 
            disabled={currentStep < (experiment?.steps?.length || 1) - 1}
            onClick={() => setShowQuiz(true)}
          >
            <HelpCircle size={18} /> Take Final Quiz
          </button>
        </div>
      </aside>

      {/* Center: 3D Canvas */}
      <main className="canvas-container">
        <div className="canvas-overlay top">
          <div className="breadcrumb">
            Experiments / {experiment?.subject || 'Subject'} / {experiment?.chapter || 'Chapter'}
          </div>
          <div className="scene-legend glass">
            <div className="legend-title">Legend</div>
            <div className="legend-item">
              <span className="color-dot" style={{ background: 'var(--physics-color)' }} />
              <span>Field Lines</span>
            </div>
          </div>
        </div>

        <Canvas shadows>
          <ErrorBoundary fallback={<MissingScene sceneKey={experiment.sceneKey} />}>
            <Suspense fallback={null}>
              <SceneComponent 
                key={sceneKey_reset}
                controlValues={controlValues} 
                currentStep={currentStep} 
                isPlaying={isPlaying}
                onStepComplete={() => {
                  if (currentStep < (experiment?.steps?.length || 5) - 1) {
                    setTimeout(() => setStep(currentStep + 1), 500);
                  }
                }}
                resetKey={sceneKey_reset}
              />
            </Suspense>
          </ErrorBoundary>
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.05}
          />
        </Canvas>

        <div className="canvas-overlay bottom">
          <div className="controls-hint">
            Drag to rotate · Scroll to zoom · ← → steps · Space play · R reset
          </div>
          <div className="playback-controls glass">
            <button 
              onClick={handleReset}
              title="Reset Scene"
              style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                border: '1px solid #1e2a3a',
                background: '#0d1117',
                color: '#8899bb',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.target.style.borderColor = '#00e5ff'}
              onMouseLeave={e => e.target.style.borderColor = '#1e2a3a'}
            >
              ↺
            </button>
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                border: '1px solid #1e2a3a',
                background: isPlaying ? '#00e5ff' : '#0d1117',
                color: isPlaying ? '#000' : '#8899bb',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      </main>

      {/* Right Panel: Concepts & Formulas */}
      <aside className="concepts-panel glass">
        <div className="concepts-header">KEY CONCEPTS</div>
        
        {/* Formula box */}
        <div className="formula-box">
          <div className="formula-label">{concepts.formulaLabel}</div>
          <div className="formula-display">{concepts.formula}</div>
        </div>
        
        {/* Concept cards */}
        {concepts.concepts.map((concept, i) => (
          <div key={i} className="concept-card">
            <div className="concept-title">{concept.title}</div>
            <div className="concept-desc">{concept.description}</div>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default ExperimentViewer;
