import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart, 
  Download, 
  Search,
  ChevronRight,
  TrendingUp,
  Mail
} from 'lucide-react';
import axios from 'axios';
import './TeacherConsole.css';

const TeacherConsole = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, statsRes] = await Promise.all([
        axios.get('/api/users?role=student'),
        axios.get('/api/progress/class-stats')
      ]);
      setStudents(studentsRes.data?.data || []);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      console.error('TeacherConsole fetch error:', err);
      // Fallbacks
      setStudents([]);
      setStats({ popularExperiments: [] });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    // Logic to generate and download CSV
    console.log('Exporting CSV...');
  };

  if (loading) return <div className="console-loading">Loading Teacher Console...</div>;

  return (
    <div className="console-page">
      <header className="console-header">
        <div>
          <h1 className="syne-bold">Teacher Console</h1>
          <p className="text-secondary">Monitor your class progress and engagement.</p>
        </div>
        <button className="export-btn" onClick={exportCSV}>
          <Download size={18} /> Export CSV
        </button>
      </header>

      <div className="console-grid">
        {/* Class Overview */}
        <section className="section-card glass">
          <div className="section-header">
            <h3><TrendingUp size={18} color="var(--accent-color)" /> Class Engagement</h3>
          </div>
          <div className="engagement-tiles">
            {(stats?.popularExperiments || []).map((exp, i) => (
              <div key={i} className="engagement-tile glass">
                <span className="tile-label">{exp.title}</span>
                <span className="tile-value">{exp.completionRate || 0}%</span>
                <div className="tile-track"><div className="tile-fill" style={{ width: `${exp.completionRate || 0}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Student List */}
        <section className="section-card glass main-list">
          <div className="section-header">
            <h3><Users size={18} color="var(--accent-color)" /> Student Progress</h3>
            <div className="search-mini glass">
              <Search size={14} />
              <input type="text" placeholder="Search students..." />
            </div>
          </div>
          
          <table className="student-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Completed</th>
                <th>Avg. Score</th>
                <th>Last Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(students || []).map((student) => (
                <tr key={student._id}>
                  <td className="student-cell">
                    <img src={student.avatar || '/default-avatar.png'} alt="" className="mini-avatar" />
                    <div>
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.completedCount || 0}</td>
                  <td>
                    <span className={`score-badge ${(student.avgScore || 0) > 80 ? 'high' : 'medium'}`}>
                      {student.avgScore || 0}%
                    </span>
                  </td>
                  <td>{student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <button className="action-btn"><Mail size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default TeacherConsole;
