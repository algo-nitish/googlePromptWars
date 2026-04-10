import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ActivityCalendar } from 'react-activity-calendar';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Settings, Edit2, Upload, Code, Briefcase, Award, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // Simulated heatmap data for UI consistency
  const data = [
    { date: "2025-01-01", count: 0, level: 0 },
    { date: "2025-12-31", count: 0, level: 0 },
    // Fill required bounds, actual implementation mapping omitted for visual mockup
  ];

  if (!user) return null;

  const BADGES = ['First Steps', '5x Builder', 'Week Warrior', 'Role Master'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen pb-20 pt-16 bg-[var(--color-background)] font-sans"
    >
      <Navbar />

      {/* Hero Banner with Avatar */}
      <div className="relative border-b border-white/10 bg-[var(--color-surface)] glow-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent1)]/20 to-[var(--color-accent2)]/10 opacity-30 mask-image:linear-gradient(to_bottom,black,transparent)"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group cursor-pointer">
              {user.avatar ? (
                <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-[var(--color-surface)] shadow-2xl object-cover" alt="Profile" />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-[var(--color-surface)] shadow-2xl bg-gradient-to-tr from-[var(--color-accent1)] to-[var(--color-accent2)] flex items-center justify-center text-4xl font-black text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white mb-1" />
                <span className="text-xs font-bold text-white">Upload</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-black font-heading tracking-tight">{user.name}</h1>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Edit2 className="w-5 h-5 text-[var(--color-text-muted)] hover:text-white transition" />
                </motion.button>
              </div>
              
              <p className="text-lg text-[var(--color-text-muted)] mb-4 max-w-xl">
                {user.bio || "Full-stack developer building cool things on the internet. Tracking my growth on SkillBridge AI."}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="text-sm font-bold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                  🎓 {user.college || "University"}
                </span>
                <span className="text-sm font-bold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                  💼 {user.targetRole || "Software Engineer"}
                </span>
                <div className="flex gap-2 ml-auto">
                  <a href={user.githubUrl || "#"} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition"><Code className="w-5 h-5" /></a>
                  <a href={user.linkedinUrl || "#"} className="p-2 bg-white/5 hover:bg-[#0077b5]/20 hover:text-[#0077b5] rounded-full transition"><Briefcase className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        
        {/* GAMIFICATION ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-6 rounded-3xl glow-border flex flex-col items-center">
            <Trophy className="w-8 h-8 text-[var(--color-accent1)] mb-2" />
            <p className="text-3xl font-black">{user.level || 1}</p>
            <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest mt-1">Current Level</p>
          </div>
          <div className="glass p-6 rounded-3xl glow-border flex flex-col items-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-3xl font-black">{user.xp || 0}</p>
            <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest mt-1">Total XP</p>
          </div>
          <div className="glass p-6 rounded-3xl glow-border flex flex-col items-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-3xl font-black">{user.streak || 0}</p>
            <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest mt-1">Day Streak</p>
          </div>
          <div className="glass p-6 rounded-3xl glow-border flex flex-col items-center">
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-3xl font-black">{user?.badges?.length || 0}</p>
            <p className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest mt-1">Badges Earned</p>
          </div>
        </div>

        {/* BADGES & SKILLS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl w-full">
            <h3 className="font-heading font-black text-xl mb-6">Achievement Badges</h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((b) => {
                const earned = user?.badges?.includes(b);
                return (
                  <div key={b} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${earned ? 'bg-[var(--color-accent1)]/10 border-[var(--color-accent1)]/30' : 'bg-black/20 border-white/5 grayscale opacity-50'}`}>
                    <Award className={`w-8 h-8 ${earned ? 'text-[var(--color-accent1)]' : 'text-gray-500'}`} />
                    <span className={`font-bold text-sm ${earned ? 'text-white' : 'text-gray-400'}`}>{b}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl w-full">
             <h3 className="font-heading font-black text-xl mb-6">Skills Mastered</h3>
             <div className="flex flex-wrap gap-2">
               {(user.currentSkills?.length > 0 ? user.currentSkills : ['HTML', 'CSS', 'JavaScript', 'React']).map(skill => (
                 <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition cursor-default">
                   {skill}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* ACTIVITY HEATMAP */}
        <div className="glass p-8 rounded-3xl w-full overflow-hidden">
          <h3 className="font-heading font-black text-xl mb-6">Progress Activity</h3>
          <div className="overflow-x-auto pb-4">
             <ActivityCalendar 
               data={data}
               theme={{
                 light: ['#1e1e2e', '#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed'],
                 dark: ['#1e1e2e', '#3b0764', '#581c87', '#7e22ce', '#a855f7'],
               }}
               colorScheme="dark"
               blockSize={14}
               blockRadius={4}
               blockMargin={4}
             />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;
