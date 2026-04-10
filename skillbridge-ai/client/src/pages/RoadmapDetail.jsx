import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Circle, Play, BookOpen, GraduationCap, ArrowLeft, Layers, Trophy } from 'lucide-react';
import { BadgeToast } from '../components/BadgeToast';

const RoadmapDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/roadmap/${id}`);
        setSession(res.data);
      } catch (error) {
        toast.error('Failed to load roadmap details');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleMarkComplete = async (weekNum) => {
    // Optimistic UI update
    setSession(prev => {
      const newSession = {...prev};
      const weekIdx = newSession.roadmap.findIndex(w => w.week === weekNum);
      if(weekIdx !== -1) newSession.roadmap[weekIdx].completed = true;
      return newSession;
    });

    // Fire Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#06b6d4', '#f59e0b']
    });

    try {
      const res = await api.patch(`/roadmap/${id}/week/${weekNum}/complete`);
      await refreshUser();
      toast.success(`Milestone reached! Gamification synced.`);
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'video': return <Play className="w-3 h-3" />;
      case 'course': return <GraduationCap className="w-3 h-3" />;
      case 'article':
      default: return <BookOpen className="w-3 h-3" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-[var(--color-accent1)] border-[rgba(255,255,255,0.1)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const completedWeeks = session.roadmap.filter((w) => w.completed).length;
  const progressPercentage = session.roadmap.length === 0 ? 0 : Math.round((completedWeeks / session.roadmap.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen pb-20 pt-24"
    >
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <Link to="/dashboard" className="inline-flex items-center text-[var(--color-text-muted)] hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        {/* Progress Header */}
        <div className="bg-[var(--color-surface)] border border-white/5 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden glass">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[var(--color-accent1)] opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold mb-2 font-heading tracking-tight">{session.targetRole}</h1>
              <p className="text-[var(--color-text-muted)]">Mission completion: {progressPercentage}%</p>
            </div>
            
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 min-w-[220px]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)]">Progress</span>
                <span className="font-black text-[var(--color-accent2)]">{completedWeeks} / {session.roadmap.length}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[var(--color-accent1)] to-[var(--color-accent2)] h-3 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="mb-12">
          <h3 className="flex items-center gap-2 text-xl font-bold mb-5 font-heading">
            <Layers className="text-[var(--color-accent1)] w-6 h-6"/> Skills to Acquire
          </h3>
          <div className="flex flex-wrap gap-2">
            {session.skillGaps.map((gap, i) => (
              <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05, type: 'spring' }}
                key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full text-sm font-bold"
              >
                {gap}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-xl font-bold mb-8 font-heading">
            <Trophy className="text-[var(--color-accent3)] w-6 h-6"/> Strategic Curriculum
          </h3>
          
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-10">
            {session.roadmap.map((week, idx) => {
              const isComp = week.completed;
              return (
                <motion.div variants={itemVariants} key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[45px] top-5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isComp ? 'bg-[var(--color-accent2)] shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-[var(--color-surface)] border-2 border-white/20 group-hover:border-[var(--color-accent1)]'}`}>
                    {isComp && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>

                  <div className={`glass rounded-2xl border p-6 transition-all duration-300 ${isComp ? 'border-[var(--color-accent2)]/30 bg-black/40 opacity-70' : 'border-white/10 hover:border-[var(--color-accent1)]/50 glow-border card-hover'}`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${isComp ? 'text-[var(--color-accent2)]' : 'text-[var(--color-accent1)]'}`}>
                          Phase {week.week}
                        </span>
                        <h4 className={`text-xl font-bold font-heading ${isComp ? 'text-white/70 line-through' : 'text-white'}`}>{week.topic}</h4>
                      </div>
                      
                      {!isComp ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkComplete(week.week)}
                          className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent1)] to-purple-800 hover:from-purple-600 hover:to-indigo-600 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
                        >
                          <Circle className="w-4 h-4" /> Mark Complete
                        </motion.button>
                      ) : (
                        <span className="flex items-center gap-2 text-[var(--color-accent2)] bg-[var(--color-accent2)]/10 px-4 py-2 rounded-xl text-sm font-bold border border-[var(--color-accent2)]/20">
                          <CheckCircle className="w-4 h-4" /> Verified
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest">Resources</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {week.resources.map((res, rIdx) => (
                          <motion.a
                            whileHover={{ y: -2 }}
                            key={rIdx}
                            href={res.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-start p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group/link"
                          >
                            <div className="mt-0.5 p-2 bg-black/50 rounded-lg text-[var(--color-accent1)] group-hover/link:text-white group-hover/link:bg-[var(--color-accent1)] transition-colors border border-white/5 shrink-0">
                              {getIconForType(res.type)}
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                              <p className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1">
                                {res.title}
                              </p>
                              <span className="text-[9px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                                {res.type}
                              </span>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapDetail;
