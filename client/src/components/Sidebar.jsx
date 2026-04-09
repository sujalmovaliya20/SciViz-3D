import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle,
  Filter 
} from 'lucide-react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ 
  subjectsData, // Can still use for static data if needed
  onFilterChange, 
  onExperimentSelect,
  activeSubject,
  searchQuery = '',
  completedIds = []
}) => {
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({ physics: true, chemistry: true, biology: true });
  const [activeExperiment, setActiveExperiment] = useState(null);
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    completion: 'all'
  });

  const subjectRefs = useRef({});

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await axios.get('/api/experiments');
        const experiments = res.data?.data || res.data?.experiments || res.data || [];
        
        // Group: subject → class → chapter → experiments[]
        const grouped = {};
        experiments.forEach(exp => {
          const subj = exp.subject?.toLowerCase() || 'physics';
          const cls = exp.class || exp.grade || '10';
          const chapter = exp.chapter || 'General';
          
          if (!grouped[subj]) grouped[subj] = {};
          if (!grouped[subj][cls]) grouped[subj][cls] = {};
          if (!grouped[subj][cls][chapter]) grouped[subj][cls][chapter] = [];
          
          grouped[subj][cls][chapter].push(exp);
        });
        setCurriculum(grouped);
      } catch (err) {
        console.error('Sidebar fetch error:', err);
      }
    };
    fetchCurriculum();
  }, []);

  // Auto-expand/scroll to active subject from navbar
  useEffect(() => {
    if (activeSubject && activeSubject !== 'all' && subjectRefs.current[activeSubject]) {
      setExpandedSubjects(prev => ({ ...prev, [activeSubject]: true }));
      subjectRefs.current[activeSubject].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSubject]);

  const toggleExpand = (key) => {
    setExpandedChapters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubject = (subj) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subj]: !prev[subj]
    }));
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperimentClick = (exp) => {
    setActiveExperiment(exp._id);
    if (onExperimentSelect) {
      onExperimentSelect(exp);
    } else {
      navigate(`/experiment/${exp.sceneKey}`);
    }
  };

  // Helper colors
  const subjectColors = {
    physics: '#00e5ff',
    chemistry: '#bc00ff',
    biology: '#32d74b'
  };

  const difficultyColors = {
    easy: '#32d74b',
    medium: '#ff9f0a',
    hard: '#ff4d6d'
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} style={{ backgroundColor: 'rgba(0,229,255,0.3)', color: '#fff' }}>{part}</span>
        : part
    );
  };

  // Subject Rendering Logic
  const getFilteredExperiments = (experimentList) => {
    return experimentList.filter(exp => {
      // Search filter
      if (searchQuery && !exp.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filters.completion === 'completed') {
        if (!completedIds.includes(exp._id)) return false;
      } else if (filters.completion === 'pending') {
        if (completedIds.includes(exp._id)) return false;
      }
      // activeSubject filter from navbar
      if (activeSubject !== 'all' && activeSubject !== exp.subject?.toLowerCase()) {
        return false;
      }
      return true;
    });
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <Filter size={18} className="sidebar-icon" />
        <h3>Filters</h3>
      </div>

      <div className="filter-section">
        <label>Status</label>
        <div className="filter-pills">
          {['all', 'completed', 'pending'].map(s => (
            <button
              key={s}
              className={`filter-pill ${filters.completion === s ? 'active' : ''}`}
              onClick={() => handleFilterChange('completion', s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      {['physics', 'chemistry', 'biology'].map(subject => {
        const classesObj = curriculum[subject] || {};
        const classesKeys = Object.keys(classesObj).sort(); // -> ['10', '12']
        
        // Count total matched experiments for badge
        let subjectTotal = 0;
        let visibleExperimentsCount = 0;

        // Verify if we even render this subject:
        if (activeSubject !== 'all' && activeSubject !== subject) return null;

        // Build class/chapter structure
        const subjectJSX = classesKeys.map(cls => {
          const chaptersObj = classesObj[cls];
          const chaptersKeys = Object.keys(chaptersObj).sort();

          const chapterJSX = chaptersKeys.map(chapter => {
            const chapterExps = chaptersObj[chapter] || [];
            const filteredExps = getFilteredExperiments(chapterExps);
            
            subjectTotal += chapterExps.length;
            visibleExperimentsCount += filteredExps.length;

            if (filteredExps.length === 0) return null;

            // Compute chapter progress
            const chapterCompletedCount = filteredExps.filter(exp => completedIds.includes(exp._id)).length;
            const chapterProgressStr = chapterCompletedCount > 0 ? `(${chapterCompletedCount}/${filteredExps.length})` : '';

            const key = `${subject}-${cls}-${chapter}`;
            const isExpanded = expandedChapters[key] || searchQuery.length > 0; // Auto-expand on search

            return (
              <div key={chapter}>
                <div 
                  className="chapter-row" 
                  onClick={() => toggleExpand(key)}
                >
                  <ChevronRight size={14} className={`chapter-arrow ${isExpanded ? 'open' : ''}`} />
                  <span className="chapter-name">
                    {chapter} <span style={{fontSize: '10px', opacity: 0.6}}>{chapterProgressStr}</span>
                  </span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      style={{ overflow: 'hidden' }}
                    >
                      {filteredExps.map(exp => {
                        const isCompleted = completedIds.includes(exp._id);
                        const isActive = activeExperiment === exp._id;
                        return (
                          <div 
                            key={exp._id}
                            className={`experiment-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleExperimentClick(exp)}
                          >
                            <div 
                              className="exp-difficulty-dot" 
                              style={{ background: difficultyColors[exp.difficulty] || difficultyColors.medium }}
                              title={`Difficulty: ${exp.difficulty}`}
                            />
                            <div className="exp-name" title={exp.title}>
                              {highlightText(exp.title, searchQuery)}
                            </div>
                            {isCompleted && <CheckCircle className="exp-check" />}
                            {!isCompleted && <div className="exp-duration">{exp.duration}m</div>}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          });

          // Check if class has any visible chapters
          if (chapterJSX.every(c => c === null)) return null;

          return (
            <div key={cls} className="class-section">
              <div className="class-label">Class {cls}</div>
              {chapterJSX}
            </div>
          );
        });

        // Hide subject if it has no visible items and we are searching
        if (visibleExperimentsCount === 0 && (searchQuery || filters.completion !== 'all')) return null;
        if (!curriculum[subject]) return null; // No data yet

        const isSubjectExpanded = expandedSubjects[subject];

        return (
          <div key={subject} className="subject-group" ref={el => subjectRefs.current[subject] = el}>
            <div 
              className="subject-header" 
              onClick={() => toggleSubject(subject)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="subject-dot" style={{ background: subjectColors[subject] }} />
                <span className="subject-name">{subject}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="subject-count">{visibleExperimentsCount > 0 ? visibleExperimentsCount : subjectTotal}</span>
                <ChevronRight size={14} className={`chapter-arrow ${isSubjectExpanded ? 'open' : ''}`} />
              </div>
            </div>
            
            <AnimatePresence>
              {isSubjectExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  {subjectJSX}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {Object.keys(curriculum).length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#4a5a7a', fontSize: '12px', fontFamily: 'monospace' }}>
          Loading curriculum...
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
