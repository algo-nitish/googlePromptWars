import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Sparkles, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
  'Cloud Architect', 'Product Manager', 'UX/UI Designer',
  'Cybersecurity Analyst', 'Mobile Developer (iOS/Android)',
  'Data Analyst', 'Blockchain Developer', 'Game Developer'
];

const GenerateRoadmap = () => {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { refreshUser } = useContext(AuthContext);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleGenerate = async () => {
    if (!targetRole) return toast.error('Please select a target role');
    if (skills.length === 0) return toast.error('Please add at least one current skill');

    setLoading(true);
    try {
      const res = await api.post('/roadmap/generate', {
        targetRole,
        currentSkills: skills
      });
      await refreshUser();
      toast.success('Roadmap generated successfully! +50 XP!');
      navigate(`/roadmap/${res.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate roadmap');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          
          {loading && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-4 border-purple-500 animate-spin opacity-80" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-xl font-bold text-slate-800 animate-pulse">Analyzing your skill gaps...</p>
              <p className="text-slate-500 mt-2 text-sm">Gemini AI is crafting your personalized roadmap.</p>
            </div>
          )}

          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Career Pathfinder AI</h1>
            </div>
            <p className="text-slate-500 mb-10">Tell us where you are and where you want to be. We'll map the journey.</p>

            <div className="space-y-8">
              {/* Target Role selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Job Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3.5 appearance-none shadow-sm"
                >
                  <option value="" disabled>Select your dream role...</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Current Skills Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    placeholder="e.g. HTML, CSS, Basic Python"
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 p-3.5 shadow-sm"
                  />
                  <button
                    onClick={handleAddSkill}
                    type="button"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 p-3.5 rounded-xl transition flex items-center justify-center font-medium"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-500 ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-xl font-bold font-lg shadow-lg shadow-indigo-200 transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate My Learning Roadmap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateRoadmap;
