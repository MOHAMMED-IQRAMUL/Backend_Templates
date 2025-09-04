const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body;
    if (!email || !fullName || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: 'Email already exists' });
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(409).json({ error: 'Username already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, fullName, username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created', user: { _id: user._id, email, fullName, username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true, context: 'query' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user: { _id: user._id, email: user.email, fullName: user.fullName, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
