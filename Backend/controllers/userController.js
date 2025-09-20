const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

// Get all users
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
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
