const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail, getWelcomeEmailTemplate, getAdminRegistrationAlertTemplate } = require('../utils/emailService');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    // Send Welcome Email to Customer
    sendEmail({
      email: user.email,
      subject: 'Welcome to Victoria Baby Essentials!',
      html: getWelcomeEmailTemplate(user.name),
    }).catch(err => console.error('Welcome email failed:', err));

    // Send Alert Email to Admin
    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `New User Registration: ${user.name}`,
        html: getAdminRegistrationAlertTemplate(user),
      }).catch(err => console.error('Admin registration alert failed:', err));
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

module.exports = router;
