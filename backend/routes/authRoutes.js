const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail, getWelcomeEmailTemplate, getAdminRegistrationAlertTemplate, getOtpEmailTemplate } = require('../utils/emailService');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Gate 1: Check if account exists
  if (!user) {
    return res.status(401).json({ message: 'Account not found. Please create an account first.' });
  }

  // Gate 2: Check if password matches
  if (!(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  // Gate 3: Check if account is verified (backward compatible for existing verified users)
  if (user.isVerified === false) {
    return res.status(401).json({ message: 'Please verify your account using the OTP code sent to your email.' });
  }

  // Success: Log the user in
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
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

  // Generate 6-digit secure code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  const user = await User.create({
    name,
    email,
    password,
    phone,
    otp: otpCode,
    otpExpires,
    isVerified: false,
  });

  if (user) {
    // Send OTP Verification Email to Customer
    sendEmail({
      email: user.email,
      subject: 'Verify your account - Victoria Baby Essentials',
      html: getOtpEmailTemplate(otpCode),
    }).catch(err => console.error('OTP verification email failed:', err));

    res.status(201).json({
      message: 'Registration successful! Verification code sent to your email.',
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'Account is already verified' });
  }

  if (user.otp !== code || new Date() > user.otpExpires) {
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  }

  // Activate the user
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

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

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    phone: user.phone,
    token: generateToken(user._id),
  });
});

// @desc    Resend registration verification OTP code
// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'Account is already verified' });
  }

  // Generate new OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  user.otp = otpCode;
  user.otpExpires = otpExpires;
  await user.save();

  sendEmail({
    email: user.email,
    subject: 'Verify your account - Victoria Baby Essentials',
    html: getOtpEmailTemplate(otpCode),
  }).catch(err => console.error('OTP resend failed:', err));

  res.status(200).json({ message: 'New verification code sent to your email.' });
});

module.exports = router;
