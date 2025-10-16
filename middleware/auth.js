const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // check blacklist
    const black = await BlacklistedToken.findOne({ token });
    if (black) return res.status(401).json({ message: 'Token invalidated (logged out)' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Auth failed', error: err.message });
  }
};

module.exports = auth;
