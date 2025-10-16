const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register); // optional - create admin/user
router.post('/login', login);
router.post('/logout', auth, logout); // need token in header

module.exports = router;
