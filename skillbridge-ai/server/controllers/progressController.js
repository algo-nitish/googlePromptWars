import ProgressLog from '../models/ProgressLog.js';
import RoadmapSession from '../models/RoadmapSession.js';

export const getProgress = async (req, res, next) => {
  try {
    const logs = await ProgressLog.find({ 
      sessionId: req.params.sessionId,
      userId: req.user.id
    }).sort({ createdAt: -1 });
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const logProgress = async (req, res, next) => {
  try {
    const { sessionId, weekCompleted, notes } = req.body;

    const session = await RoadmapSession.findById(sessionId);
    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }

    if (session.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const log = await ProgressLog.create({
      userId: req.user.id,
      sessionId,
      weekCompleted,
      notes,
    });

    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};
