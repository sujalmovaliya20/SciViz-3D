import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Search, User, LogOut, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useAppStore from '../store/useAppStore';
import './Navbar.css';

const subjectColors = {
  all: '#00e5ff',
  physics: '#00e5ff',
  chemistry: '#a855f7',
  biology: '#22c55e'
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { activeSubject, setActiveSubject, activeClass, setActiveClass } = useAppStore();

  const mainTabs = [
    { label: '⬡ Dashboard', path: '/dashboard' },
    { label: '🔬 Explore', path: '/explore' },
  ];

  const subjects = [
    { key: 'all', label: 'All' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'biology', label: 'Biology' },
  ];

  return (
    <nav className="navbar glass">
      <div className="navbar-container">

        {/* Logo → Dashboard */}
        <div
          onClick={() => navigate('/dashboard')}
          className="logo"
          style={{ cursor: 'pointer' }}
        >
          <Atom className="logo-icon" size={32} color="var(--accent-color)" />
          <span className="logo-text">
            SciViz <span className="logo-badge">3D</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-center">

          {/* Main Tabs: Dashboard + Explore */}
          {user && (
            <div className="main-tabs">
              {mainTabs.map(tab => (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`main-tab ${location.pathname === tab.path ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
              <button onClick={() => navigate('/simulation')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: location.pathname === '/simulation'
                    ? 'none' : '1px solid rgba(124,58,237,0.4)',
                  background: location.pathname === '/simulation'
                    ? '#7c3aed' : 'transparent',
                  color: location.pathname === '/simulation'
                    ? '#fff' : '#a855f7',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  marginLeft: '8px'
                }}
              >
                🥽 Sim World
              </button>
            </div>
          )}

          {/* Subject + Class filters: ONLY on /explore */}
          {user && location.pathname === '/explore' && (
            <div className="filter-controls-nav">
              <div className="subject-tabs">
                {subjects.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSubject(s.key)}
                    className={`subject-tab ${activeSubject === s.key ? `active ${s.key}` : ''}`}
                    style={activeSubject === s.key ? { background: subjectColors[s.key], color: '#000' } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="class-toggle-nav">
                {['all', '10', '12'].map(cls => (
                  <button
                    key={cls}
                    className={activeClass === cls ? 'active' : ''}
                    onClick={() => setActiveClass(cls)}
                  >
                    {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          <div className={`search-wrapper ${isSearchOpen ? 'expanded' : ''}`}>
            <button className="nav-icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={20} />
            </button>
            <input
              type="text"
              placeholder="Search experiments..."
              className="search-input"
              autoFocus={isSearchOpen}
            />
          </div>

          {user ? (
            <div className="user-menu-wrapper">
              <button
                className="user-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <div className="avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="username">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={isUserDropdownOpen ? 'rotate' : ''} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    className="user-dropdown glass"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <button onClick={() => { navigate('/dashboard'); setIsUserDropdownOpen(false); }} className="dropdown-item">
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button onClick={logout} className="dropdown-item logout">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Get Started</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mobile-nav-links">
              {user && mainTabs.map(tab => (
                <button
                  key={tab.path}
                  onClick={() => { navigate(tab.path); setIsMobileMenuOpen(false); }}
                  className={`mobile-subject-link ${location.pathname === tab.path ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}

              {user && location.pathname === '/explore' && (
                <>
                  {subjects.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setActiveSubject(s.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`mobile-subject-link ${activeSubject === s.key ? 'active' : ''}`}
                    >
                      {s.label}
                    </button>
                  ))}

                  <div className="mobile-class-toggles">
                    {['all', '10', '12'].map(cls => (
                      <button
                        key={cls}
                        className={activeClass === cls ? 'active' : ''}
                        onClick={() => { setActiveClass(cls); setIsMobileMenuOpen(false); }}
                      >
                        {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mobile-auth-links">
                {user ? (
                  <button onClick={logout} className="mobile-logout">Logout</button>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
