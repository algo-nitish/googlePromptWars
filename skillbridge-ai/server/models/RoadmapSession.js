import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: {
    type: String,
    enum: ['video', 'article', 'course'],
  },
});

const roadmapWeekSchema = new mongoose.Schema({
  week: Number,
  topic: String,
  resources: [resourceSchema],
  completed: {
    type: Boolean,
    default: false,
  },
});

const roadmapSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  currentSkills: {
    type: [String],
    default: [],
  },
  skillGaps: {
    type: [String],
    default: [],
  },
  roadmap: [roadmapWeekSchema],
  geminiRaw: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RoadmapSession', roadmapSessionSchema);
