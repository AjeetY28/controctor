const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // token should be provided in Authorization header and auth middleware gives req.token
    const token = req.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(400).json({ message: 'No token provided' });

    // decode without verifying to get expiry
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      // if no exp, still blacklist for safety
      const bl = new BlacklistedToken({ token, expiresAt: new Date(Date.now() + 24*60*60*1000) });
      await bl.save();
      return res.json({ message: 'Logged out' });
    }

    const expiresAt = new Date(decoded.exp * 1000);
    const bl = new BlacklistedToken({ token, expiresAt });
    await bl.save();
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

module.exports = { register, login, logout };
