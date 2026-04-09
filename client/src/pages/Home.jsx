import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  Search, 
  ArrowRight,
  LayoutGrid,
  Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ExperimentCard from '../components/ExperimentCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useAppStore from '../store/useAppStore';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const { activeSubject, setActiveSubject, activeClass, setActiveClass, searchQuery, setSearchQuery } = useAppStore();
  const [allExperiments, setAllExperiments] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  // Fetch ALL experiments once
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/experiments');
        setAllExperiments(res.data?.data || res.data?.experiments || res.data || []);
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      const res = await axios.get(`/api/progress/user/${user._id}`);
      const data = res.data?.data || [];
      const completed = data
        .filter(p => p.completionPercent === 100 && p.experimentId)
        .map(p => p.experimentId._id || p.experimentId);
      setCompletedIds(completed);
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
    }
  };

  const filteredExperiments = useMemo(() => {
    const filtered = allExperiments.filter(exp => {
      const subjectMatch = activeSubject === 'all' || exp.subject?.toLowerCase() === activeSubject;
      const classMatch = activeClass === 'all' || String(exp.class) === String(activeClass);
      const searchMatch = !searchQuery || 
        exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return subjectMatch && classMatch && searchMatch;
    });

    let results = [...filtered];
    if (sortBy === 'az') results.sort((a,b) => a.title.localeCompare(b.title));
    if (sortBy === 'difficulty') {
      const order = { easy: 0, medium: 1, hard: 2 };
      results.sort((a,b) => (order[a.difficulty]||0) - (order[b.difficulty]||0));
    }
    if (sortBy === 'duration') results.sort((a,b) => (a.duration||0) - (b.duration||0));
    if (sortBy === 'class') results.sort((a,b) => (a.class||0) - (b.class||0));
    return results;
  }, [allExperiments, activeSubject, activeClass, searchQuery, sortBy]);

  const subjectsData = [
    { subject: 'physics', totalCount: 28, classes: [{ class: 10, chapters: ['Light', 'Electricity'] }, { class: 12, chapters: ['Optics', 'Magnetism'] }] },
    { subject: 'chemistry', totalCount: 17, classes: [{ class: 10, chapters: ['Acids'] }, { class: 12, chapters: ['Electrochemistry'] }] },
    { subject: 'biology', totalCount: 15, classes: [{ class: 10, chapters: ['Life Processes'] }, { class: 12, chapters: ['Reproduction'] }] }
  ];

  const handleExperimentSelect = (exp) => {
    // Scroll to the card
    const card = document.getElementById(`exp-card-${exp._id}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight class
      card.classList.add('highlight-pulse');
      setTimeout(() => card.classList.remove('highlight-pulse'), 2000);
    }
  };

  return (
    <div className="home-page">
      <Sidebar 
        subjectsData={subjectsData} 
        onFilterChange={() => {}} // Filters are centrally managed now
        onExperimentSelect={handleExperimentSelect}
        activeSubject={activeSubject}
        searchQuery={searchQuery}
        completedIds={completedIds}
      />

      <div className="library-container">
        {/* Hero Section */}
        <section className="hero-section">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>SciViz 3D Library</span>
            </div>
            <h1 className="hero-title">Explore Science <br/><span className="gradient-text">In 3D Perspective</span></h1>
            <p className="hero-subtitle">
              Interactive 3D simulations for Physics, Chemistry, and Biology. 
              Designed for Classes 10 & 12.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">60+</span>
                <span className="stat-label">Experiments</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">3</span>
                <span className="stat-label">Subjects</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">10 & 12</span>
                <span className="stat-label">Classes</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Results Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid #1e2a3a',
          marginBottom: '20px'
        }}>
          <div style={{ 
            fontFamily: 'Space Mono, monospace', 
            fontSize: '12px', 
            color: '#4a5a7a' 
          }}>
            Showing <span style={{ color: '#00e5ff' }}>{filteredExperiments.length}</span> 
            {' '}of {allExperiments.length} experiments
            {activeSubject !== 'all' && (
              <span style={{ 
                marginLeft: '8px', 
                padding: '2px 8px', 
                background: 'rgba(0,229,255,0.1)', 
                borderRadius: '10px',
                color: '#00e5ff',
                fontSize: '11px'
              }}>
                {activeSubject.charAt(0).toUpperCase() + activeSubject.slice(1)}
                <span 
                  onClick={() => setActiveSubject('all')} 
                  style={{ marginLeft: '4px', cursor: 'pointer' }}
                >×</span>
              </span>
            )}
            {activeClass !== 'all' && (
              <span style={{ 
                marginLeft: '6px',
                padding: '2px 8px', 
                background: 'rgba(168,85,247,0.1)', 
                borderRadius: '10px',
                color: '#a855f7',
                fontSize: '11px'
              }}>
                Class {activeClass}
                <span 
                  onClick={() => setActiveClass('all')} 
                  style={{ marginLeft: '4px', cursor: 'pointer' }}
                >×</span>
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <select 
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
              style={{
                background: '#0d1117',
                border: '1px solid #1e2a3a',
                color: '#8899bb',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'Space Mono, monospace',
                cursor: 'pointer'
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="az">A → Z</option>
              <option value="difficulty">By Difficulty</option>
              <option value="duration">By Duration</option>
              <option value="class">By Class</option>
            </select>
          </div>
        </div>

        {/* Experiment Grid */}
        <div className="experiment-grid">
          {loading ? (
            // Skeleton Loading
            [...Array(6)].map((_, i) => (
              <div key={`skeleton-${i}`} className="skeleton-card glass" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredExperiments.map((exp, i) => (
                <motion.div
                  key={exp._id || exp.sceneKey}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  id={`exp-card-${exp._id}`} 
                  className="exp-card-wrapper"
                >
                  <ExperimentCard experiment={exp} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && filteredExperiments.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#4a5a7a',
            fontFamily: 'Space Mono, monospace'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <div style={{ fontSize: '16px', marginBottom: '0.5rem', color: '#8899bb' }}>
              No experiments found
            </div>
            <div style={{ fontSize: '13px' }}>
              Try selecting a different subject or class
            </div>
            <button 
              onClick={() => { setActiveSubject('all'); setActiveClass('all'); setSearchQuery(''); }}
              style={{
                marginTop: '1.5rem',
                padding: '8px 20px',
                background: '#00e5ff',
                color: '#000',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
