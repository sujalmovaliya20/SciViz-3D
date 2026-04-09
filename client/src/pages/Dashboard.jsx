import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, BarChart2, Flame, CheckCircle, Play,
  ArrowUpRight, TrendingUp, Award, Calendar, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

/* ────── helpers ────── */
function relativeTime(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ────── SVG circular ring ────── */
function ProgressRing({ pct, size = 56, stroke = 5, color = '#00e5ff' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ────── main ────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevAchievements, setPrevAchievements] = useState([]);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/progress/stats');
      const data = res.data?.data || res.data || {};
      setStats(data);

      // Achievement unlock toast
      const earned = (data.achievements || []).filter(a => a.earned);
      const prevIds = prevAchievements.map(a => a.id);
      earned.forEach(a => {
        if (!prevIds.includes(a.id)) {
          toast(`${a.emoji} Achievement Unlocked: ${a.name}!`, {
            icon: '🏆',
            style: { background: '#0c1020', color: '#e0eaff', border: '1px solid #00e5ff' },
            duration: 4000
          });
        }
      });
      setPrevAchievements(earned);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setStats({
        completedCount: 0, totalExperiments: 60, averageScore: 0,
        totalMinutes: 0, streakDays: 0,
        subjectProgress: {
          physics: { completed: 0, total: 20, percent: 0 },
          chemistry: { completed: 0, total: 20, percent: 0 },
          biology: { completed: 0, total: 20, percent: 0 }
        },
        recentActivity: [], quizHistory: [], achievements: [],
        recommendedExperiments: [], studyCalendar: []
      });
      setError(err);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="dashboard-loading">
      <div className="dash-loader">
        <div className="dash-loader-ring" />
        <span>Loading dashboard…</span>
      </div>
    </div>
  );

  const {
    completedCount = 0, totalExperiments = 60, averageScore = 0,
    totalMinutes = 0, streakDays = 0,
    subjectProgress = {}, recentActivity = [], quizHistory = [],
    achievements = [], recommendedExperiments = [], studyCalendar = []
  } = stats || {};

  const completionPct = totalExperiments ? Math.round((completedCount / totalExperiments) * 100) : 0;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const scoreColor = averageScore >= 80 ? '#32d74b' : averageScore >= 60 ? '#ff9f0a' : '#ff453a';
  const userName = user?.name?.split(' ')[0] || 'Scientist';

  /* ────────── RENDER ────────── */
  return (
    <div className="dashboard-page">
      <Toaster position="top-right" />
      <div className="dashboard-container">

        {/* ── WELCOME HERO ── */}
        <div className="dash-hero">
          <div className="dash-hero-glow" />
          <p className="dash-hero-date">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
          <h1 className="dash-hero-title">Welcome back, {userName} 👋</h1>
          <p className="dash-hero-sub">Ready to explore science in 3D today?</p>
          <div className="dash-hero-btns">
            <button
              onClick={() => navigate('/simulation')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              <span style={{ fontSize: '20px' }}>🥽</span>
              Enter Simulation World
              <span style={{
                position: 'absolute',
                top: '4px', right: '8px',
                fontSize: '9px',
                background: '#ff4d6d',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>NEW</span>
            </button>
            <button className="hero-btn primary" onClick={() => navigate('/explore')}>
              🔬 Explore Experiments →
            </button>
            <button className="hero-btn physics" onClick={() => navigate('/explore?subject=physics')}>
              ⚡ Physics
            </button>
            <button className="hero-btn chemistry" onClick={() => navigate('/explore?subject=chemistry')}>
              🧪 Chemistry
            </button>
            <button className="hero-btn biology" onClick={() => navigate('/explore?subject=biology')}>
              🌿 Biology
            </button>
          </div>
        </div>

        {/* ── SECTION 1: HERO STATS ── */}
        <section className="stats-grid">
          {/* Card 1: Completed */}
          <motion.div className="stat-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <div className="stat-ring-wrap">
              <ProgressRing pct={completionPct} color="#00e5ff" />
              <span className="ring-center-text">{completionPct}%</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">EXPERIMENTS COMPLETED</span>
              <span className="stat-value">{completedCount} / {totalExperiments}</span>
            </div>
          </motion.div>

          {/* Card 2: Avg Score */}
          <motion.div className="stat-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="stat-ring-wrap">
              <ProgressRing pct={averageScore} color={scoreColor} />
              <span className="ring-center-text" style={{ color: scoreColor }}>{averageScore}%</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">AVG QUIZ SCORE</span>
              <span className="stat-value" style={{ color: scoreColor }}>{averageScore}%</span>
            </div>
          </motion.div>

          {/* Card 3: Streak */}
          <motion.div className="stat-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="stat-icon streak-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-label">STUDY STREAK</span>
              <span className="stat-value">{streakDays} Day{streakDays !== 1 ? 's' : ''}</span>
            </div>
          </motion.div>

          {/* Card 4: Time Spent */}
          <motion.div className="stat-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="stat-icon"><Clock color="#00e5ff" size={28} /></div>
            <div className="stat-info">
              <span className="stat-label">TOTAL TIME SPENT</span>
              <span className="stat-value">{hrs}h {mins}m</span>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 2: SUBJECT PROGRESS ── */}
        <section className="subject-cards-row">
          {['physics', 'chemistry', 'biology'].map(subj => {
            const sp = subjectProgress[subj] || { completed: 0, total: 20, percent: 0 };
            const colorMap = { physics: '#00e5ff', chemistry: '#c084fc', biology: '#22c55e' };
            const labelMap = { physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology' };
            return (
              <motion.div key={subj} className={`subject-card glass ${subj}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <div className="subj-card-header">
                  <span className="subj-dot" style={{ background: colorMap[subj] }} />
                  <span className="subj-name">{labelMap[subj]}</span>
                  <span className="subj-ratio">{sp.completed}/{sp.total}</span>
                </div>
                <div className="progress-track">
                  <motion.div className={`progress-fill ${subj}`} initial={{ width: 0 }} animate={{ width: `${sp.percent ?? 0}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                </div>
                <span className="subj-pct">{sp.percent}% complete</span>
              </motion.div>
            );
          })}
        </section>

        <div className="dashboard-main">
          <div className="main-left">

            {/* ── SECTION 3: RECENT ACTIVITY ── */}
            <section className="section-card glass">
              <div className="section-header">
                <h3><Clock size={18} /> Recent Activity</h3>
              </div>
              <div className="activity-list">
                {recentActivity.length === 0 && <p className="empty-state">No experiments started yet. Dive in!</p>}
                {recentActivity.map((act, i) => (
                  <motion.a
                    key={i}
                    className="activity-item"
                    href={act.sceneKey ? `/experiment/${act.sceneKey}` : '#'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={`activity-status ${act.status}`} />
                    <div className="activity-info">
                      <span className="activity-title">{act.title}</span>
                      <div className="activity-meta">
                        <span className={`subject-badge ${act.subject}`}>{act.subject}</span>
                        <span className="activity-time">{relativeTime(act.time)}</span>
                      </div>
                    </div>
                    <span className="activity-step-info">{act.stepInfo}</span>
                    <ArrowUpRight size={14} className="activity-link" />
                  </motion.a>
                ))}
              </div>
            </section>

            {/* ── SECTION 4: PERFORMANCE CHART ── */}
            <section className="section-card glass">
              <div className="section-header">
                <h3><BarChart2 size={18} /> Quiz Performance</h3>
              </div>
              {quizHistory.length === 0 ? (
                <p className="empty-state">Complete quizzes to see your performance trend.</p>
              ) : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={quizHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#4a5a7a', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#4a5a7a', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        contentStyle={{ background: '#0a0e1a', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 12, color: '#e0eaff' }}
                        labelStyle={{ color: '#00e5ff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#00e5ff" strokeWidth={2} fill="url(#scoreGrad)" dot={{ r: 3, fill: '#00e5ff' }} activeDot={{ r: 5, fill: '#00e5ff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {/* ── SECTION 7: STUDY CALENDAR ── */}
            <section className="section-card glass">
              <div className="section-header">
                <h3><Calendar size={18} /> Study Calendar (Last 30 Days)</h3>
              </div>
              <div className="calendar-grid">
                {studyCalendar.map((day, i) => {
                  const levelClass = day.level === 2 ? 'cal-high' : day.level === 1 ? 'cal-mid' : 'cal-empty';
                  const dateObj = new Date(day.date);
                  const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const tip = day.experiments > 0
                    ? `${label} — ${day.completed} completed, ${day.experiments} accessed, ${day.minutes}m`
                    : `${label} — No activity`;
                  return (
                    <div key={i} className={`cal-cell ${levelClass}`} title={tip}>
                      {i % 7 === 0 && <span className="cal-label">{label}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="cal-legend">
                <span>Less</span>
                <div className="cal-cell cal-empty" style={{ width: 12, height: 12 }} />
                <div className="cal-cell cal-mid" style={{ width: 12, height: 12 }} />
                <div className="cal-cell cal-high" style={{ width: 12, height: 12 }} />
                <span>More</span>
              </div>
            </section>
          </div>

          <div className="main-right">

            {/* ── SECTION 6: RECOMMENDED ── */}
            <section className="section-card glass special">
              <div className="section-header">
                <h3><TrendingUp size={18} /> Recommended Next</h3>
              </div>
              <div className="rec-list">
                {recommendedExperiments.length === 0 && <p className="empty-state">All experiments completed! 🎉</p>}
                {recommendedExperiments.map((exp) => (
                  <a key={exp._id || exp.sceneKey} className="rec-item glass" href={`/experiment/${exp.sceneKey}`}>
                    <div className="rec-thumbnail" style={{ background: exp.subject === 'physics' ? '#00e5ff' : exp.subject === 'chemistry' ? '#c084fc' : '#22c55e' }} />
                    <div className="rec-content">
                      <span className={`subject-badge ${exp.subject}`}>{exp.subject}</span>
                      <p>{exp.title}</p>
                    </div>
                    <Play size={16} />
                  </a>
                ))}
              </div>
            </section>

            {/* ── SECTION 5: ACHIEVEMENTS ── */}
            <section className="section-card glass">
              <div className="section-header">
                <h3><Award size={18} /> Achievements</h3>
                <span className="badge-count">{achievements.filter(a => a.earned).length}/{achievements.length}</span>
              </div>
              <div className="badges-grid">
                {achievements.map((badge, i) => (
                  <motion.div
                    key={badge.id || i}
                    className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
                    title={badge.description}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="badge-emoji">{badge.emoji}</span>
                    <span className="badge-name">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
