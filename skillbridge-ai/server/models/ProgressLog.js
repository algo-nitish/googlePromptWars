import mongoose from 'mongoose';

const progressLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapSession',
    required: true,
  },
  weekCompleted: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ProgressLog', progressLogSchema);
