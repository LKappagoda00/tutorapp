const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get teacher's subjects
exports.getTeacherSubjects = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.teacherId,
      role: 'teacher'
    }).select('subject');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ subject: teacher.subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { role, password, confirmPassword, ...rest } = req.body;
    if (!role || !password || !confirmPassword) {
      console.log('Missing required fields:', { role, password, confirmPassword });
      return res.status(400).json({ error: 'Role, password, and confirmPassword are required.' });
    }
    if (password !== confirmPassword) {
      console.log('Passwords do not match:', { password, confirmPassword });
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...rest, role, password: hashedPassword });
    console.log('User to be saved:', user);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all users (with role filter support)
exports.getAll = async (req, res) => {
  try {
    const { role } = req.query; // e.g. ?role=teacher
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
