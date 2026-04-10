import RoadmapSession from '../models/RoadmapSession.js';
import User from '../models/User.js';
import { generateRoadmap as callGemini } from '../services/geminiService.js';

export const generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole, currentSkills } = req.body;

    if (!targetRole || !currentSkills || !Array.isArray(currentSkills)) {
      res.status(400);
      throw new Error('Please provide target role and an array of current skills');
    }

    // Call Gemini Service
    const geminiRes = await callGemini(currentSkills, targetRole);

    if (!geminiRes.success) {
      res.status(500);
      throw new Error('Failed to generate roadmap: ' + geminiRes.error);
    }

    const { skillGaps, roadmap } = geminiRes.data;

    // Save to DB
    const session = await RoadmapSession.create({
      userId: req.user.id,
      targetRole,
      currentSkills,
      skillGaps,
      roadmap,
      geminiRaw: geminiRes.raw,
    });

    const user = await User.findById(req.user.id);
    user.targetRole = targetRole;
    user.currentSkills = [...new Set([...user.currentSkills, ...currentSkills])];
    
    // Gamification
    const allSessions = await RoadmapSession.countDocuments({ userId: req.user.id });
    if (allSessions === 1) {
      user.xp += 50;
      if (!user.badges.includes('First Steps')) user.badges.push('First Steps');
    }
    if (allSessions >= 5) {
      if (!user.badges.includes('5x Builder')) user.badges.push('5x Builder');
    }
    
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getRoadmapHistory = async (req, res, next) => {
  try {
    const sessions = await RoadmapSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getRoadmapById = async (req, res, next) => {
  try {
    const session = await RoadmapSession.findById(req.params.id);
    if (!session) {
      res.status(404);
      throw new Error('Roadmap session not found');
    }

    if (session.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const markWeekComplete = async (req, res, next) => {
  try {
    const { id, weekNum } = req.params;

    const session = await RoadmapSession.findById(id);
    if (!session) {
      res.status(404);
      throw new Error('Roadmap session not found');
    }

    if (session.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const weekIndex = session.roadmap.findIndex(r => r.week === parseInt(weekNum));
    
    if (weekIndex === -1) {
      res.status(404);
      throw new Error('Week not found in roadmap');
    }

    if (!session.roadmap[weekIndex].completed) {
      session.roadmap[weekIndex].completed = true;
      await session.save();

      const user = await User.findById(req.user.id);
      user.xp += 10;
      
      const sessionWins = await RoadmapSession.find({ userId: req.user.id });
      let totalCompletedWeeks = 0;
      sessionWins.forEach(s => {
        totalCompletedWeeks += s.roadmap.filter(w => w.completed).length;
      });

      if (totalCompletedWeeks >= 5 && !user.badges.includes('Week Warrior')) {
        user.badges.push('Week Warrior');
      }

      // Check if whole roadmap is done
      const allDone = session.roadmap.every(w => w.completed);
      if (allDone) {
        user.xp += 25;
        if (!user.badges.includes('Role Master')) {
          user.badges.push('Role Master');
        }
      }

      user.level = Math.floor(user.xp / 100) + 1;
      await user.save();
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};
