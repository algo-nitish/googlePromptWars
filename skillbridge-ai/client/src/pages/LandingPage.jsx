import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Map, Zap, Award, Target, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated Orbs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[var(--color-background)]">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-accent1)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--color-accent2)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 px-4 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            Stop Guessing.<br/>
            <span className="gradient-text">Start Growing.</span>
          </h1>
          <p className="mt-4 text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10">
            AI-powered skill gap analyzer built for Indian developers. Generate your weekly roadmap instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-accent1)] to-[var(--color-accent2)] text-white font-bold tracking-wide"
              >
                Get Started Free
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass border border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
            >
              Watch Demo <ChevronRight className="w-4 h-4"/>
            </motion.button>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] font-medium">Join 2,400+ students building smarter 🚀</p>
        </motion.div>
      </div>

      {/* Roles Marquee */}
      <div className="w-full bg-[var(--color-surface)] py-4 border-y border-white/5 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-8 whitespace-nowrap">
          {["Frontend Dev", "Backend Dev", "DevOps Eng", "Data Scientist", "ML Engineer", "Product Manager", "UI/UX Designer", "Cybersecurity", "Blockchain Dev"].map((role, idx) => (
            <span key={idx} className="text-xl font-bold text-[var(--color-text-muted)] uppercase tracking-widest opacity-50 px-8">
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to <span className="gradient-text">level up</span>.</h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
        >
          <motion.div variants={itemVariants} className="md:col-span-2 glass rounded-3xl p-8 card-hover relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-accent1)] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <Map className="w-12 h-12 text-[var(--color-accent1)] mb-4" />
            <h3 className="text-2xl font-bold mb-2">AI-Driven Roadmaps</h3>
            <p className="text-[var(--color-text-muted)]">We analyze your current stack against your dream role and map out the exact free resources you need to cross the gap.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1 glass rounded-3xl p-8 card-hover flex flex-col justify-end">
            <Target className="w-10 h-10 text-[var(--color-accent2)] mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Check off weeks and watch your skill graph grow.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1 glass rounded-3xl p-8 card-hover">
            <Award className="w-10 h-10 text-[var(--color-accent3)] mb-4" />
            <h3 className="text-xl font-bold mb-2">Gamified Learning</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Earn XP, collect badges, and keep your daily streak alive.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 glass rounded-3xl p-8 card-hover flex items-center justify-between">
            <div>
              <Zap className="w-10 h-10 text-[var(--color-accent1)] mb-4" />
              <h3 className="text-xl font-bold mb-2">Dynamic Skill Cloud</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Visually track the skills you actually know.</p>
            </div>
            <div className="hidden sm:flex gap-2 flex-wrap max-w-xs justify-end">
              {['React', 'Node.js', 'MongoDB', 'Python', 'AWS'].map(s => <span key={s} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">{s}</span>)}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center bg-[var(--color-background)]">
        <p className="font-heading font-bold text-xl gradient-text mb-4">SkillBridge</p>
        <p className="text-[var(--color-text-muted)] text-sm">Built with ❤️ for PromptWars 2026 — powered by Gemini AI</p>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
