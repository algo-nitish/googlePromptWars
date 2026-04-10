import React, { useEffect, useState, useContext } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Map, Zap, CheckCircle, Shield, ArrowRight, PlayCircle, Plus } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

const AnimatedCounter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  
  useEffect(() => {
    const animation = count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const ROLES_EXPLORE = [
  { title: 'Frontend Developer', icon: '🎨', weeks: 8 },
  { title: 'Backend Developer', icon: '⚙️', weeks: 10 },
  { title: 'Data Scientist', icon: '📊', weeks: 12 },
  { title: 'DevOps Engineer', icon: '🚀', weeks: 8 },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/roadmap/history');
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalCompleted = history.reduce((acc, curr) => acc + curr.roadmap.filter(w => w.completed).length, 0);
  const mostRecent = history.length > 0 ? history[0] : null;

  // Fake radar data based on user profile logic could be built here.
  const chartData = [
    { subject: 'Frontend', A: 80, fullMark: 100 },
    { subject: 'Backend', A: Math.min(100, (user?.skills?.length || 0) * 10), fullMark: 100 },
    { subject: 'DevOps', A: 20, fullMark: 100 },
    { subject: 'DSA', A: 50, fullMark: 100 },
    { subject: 'AI/ML', A: 10, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-20 pt-24"
    >
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Map, title: "Total Roadmaps", val: loading ? 0 : history.length, color: "var(--color-accent1)" },
            { icon: CheckCircle, title: "Weeks Complete", val: loading ? 0 : totalCompleted, color: "var(--color-accent2)" },
            { icon: Zap, title: "Total XP", val: user?.xp || 0, color: "var(--color-accent3)" },
            { icon: Shield, title: "Streak", val: user?.streak || 0, color: "#ec4899" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: i * 0.1 }}
              className="glass p-5 rounded-2xl flex flex-col glow-border card-hover"
            >
              <div className="flex justify-between items-start mb-2">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-white"><AnimatedCounter value={stat.val} /></p>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-bold mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Column 60% */}
          <div className="w-full lg:w-[60%] space-y-8">
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent1)] to-transparent opacity-10 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-2xl font-bold">Continue Learning</h3>
              </div>
              
              {loading ? (
                <div className="h-32"><SkeletonCard /></div>
              ) : mostRecent ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 hover:bg-white/10 transition">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black px-3 py-1 bg-gradient-to-r from-[var(--color-accent1)] to-[var(--color-accent2)] rounded-full text-white">
                      {mostRecent.targetRole}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Week {mostRecent.roadmap.filter(w=>w.completed).length + 1} Target</h4>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                    <div className="bg-[var(--color-accent2)] h-2 rounded-full" style={{ width: `${(mostRecent.roadmap.filter(w=>w.completed).length / mostRecent.roadmap.length)*100}%` }}></div>
                  </div>
                  <Link to={`/roadmap/${mostRecent._id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent1)] hover:text-white transition group">
                    Resume Mission <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Map className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-[var(--color-text-muted)]">No active roadmaps found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column 40% */}
          <div className="w-full lg:w-[40%] space-y-8">
            <div className="glass rounded-3xl p-6 relative">
              <h3 className="font-bold mb-4 text-center">Your Skill DNA</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                    <Radar name="Skills" dataKey="A" stroke="var(--color-accent2)" fill="var(--color-accent1)" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link to="/generate" className="block w-full glass rounded-2xl p-6 card-hover glow-border text-center group bg-gradient-to-b from-transparent to-[var(--color-accent1)]/10">
               <Plus className="w-8 h-8 text-white mx-auto mb-2 opacity-50 group-hover:opacity-100 transition" />
               <h3 className="font-bold">Quick Generate</h3>
               <p className="text-xs text-[var(--color-text-muted)]">Build a new roadmap instantly</p>
            </Link>
          </div>
        </div>

        {/* Bottom Explore Roles */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Explore Roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLES_EXPLORE.map((role, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="glass border border-white/5 p-5 rounded-2xl flex flex-col cursor-pointer transition-colors hover:bg-white/5 hover:border-[var(--color-accent2)]"
              >
                <div className="text-3xl mb-3">{role.icon}</div>
                <h4 className="font-bold text-white mb-1">{role.title}</h4>
                <p className="text-[10px] uppercase text-[var(--color-text-muted)] font-black tracking-widest mb-4">Avg. {role.weeks} Weeks</p>
                <button className="mt-auto text-xs font-bold text-[var(--color-accent1)] text-left flex items-center gap-1 group">
                  Preview <PlayCircle className="w-3 h-3 group-hover:text-white transition" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
