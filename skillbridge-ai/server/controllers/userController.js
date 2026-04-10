import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, college, linkedinUrl, githubUrl, targetRole } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.college = college || user.college;
    user.linkedinUrl = linkedinUrl || user.linkedinUrl;
    user.githubUrl = githubUrl || user.githubUrl;
    user.targetRole = targetRole || user.targetRole;

    const updatedUser = await user.save();
    
    // Omit password hash in response
    const { passwordHash, ...userWithoutPassword } = updatedUser._doc;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    const user = await User.findById(req.user.id);
    user.avatar = req.file.path; // Cloudinary URL
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};
