import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Map, UserCircle, LogOut, Settings, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useScrollDirection } from '../hooks/useScrollDirection';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const scrollDirection = useScrollDirection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: scrollDirection === 'down' ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full z-50 glass border-b-0 border-white/10 shadow-lg"
    >
      {/* Scroll progress bar */}
      <motion.div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-accent1)] to-[var(--color-accent2)]"
        style={{ width: '100%' }} // You could map this to scroll progress
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
            <Zap className="h-6 w-6 text-[var(--color-accent2)]" />
            <span className="font-heading font-bold text-xl gradient-text">SkillBridge</span>
          </div>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition">Sign In</Link>
              <Link to="/register" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition">Get Started</Link>
            </div>
          ) : (
            <>
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/dashboard" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition flex items-center gap-2">
                  <Map className="w-4 h-4"/> Dashboard
                </Link>
                <Link to="/generate" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition flex items-center gap-2">
                  <Zap className="w-4 h-4"/> Generate
                </Link>
              </div>

              {/* Desktop User Hub */}
              <div className="hidden md:flex items-center gap-4 relative">
                {/* XP Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Zap className="w-4 h-4 text-[var(--color-accent3)]" fill="currentColor" />
                  <span className="text-xs font-bold text-white">{user.xp || 0} XP</span>
                </div>

                <div 
                  className="flex items-center gap-2 cursor-pointer relative"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-white/20" alt="avatar" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent1)] to-[var(--color-accent2)] flex items-center justify-center font-bold text-white text-sm">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/20">
                      L{user.level || 1}
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-14 right-0 w-48 glass border border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                    >
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-white/5" onClick={() => setProfileDropdownOpen(false)}>
                        <UserCircle className="w-4 h-4"/> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5">
                        <LogOut className="w-4 h-4 text-red-400"/> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/10"
          >
            <div className="px-4 py-5 space-y-4">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                {user.avatar ? (
                  <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent1)] to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">{user.name}</p>
                  <p className="text-xs text-[var(--color-accent3)]">{user.xp || 0} XP • Level {user.level || 1}</p>
                </div>
              </div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-white hover:text-[var(--color-accent2)]">Dashboard</Link>
              <Link to="/generate" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-white hover:text-[var(--color-accent2)]">Generate Roadmap</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-white hover:text-[var(--color-accent2)]">Profile Settings</Link>
              <button onClick={handleLogout} className="block w-full text-left text-base font-medium text-red-400 hover:text-red-300">Logout</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
