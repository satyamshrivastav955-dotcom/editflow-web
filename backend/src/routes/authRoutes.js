// src/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Register ─────────────────────────────
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ max: 100 }).withMessage('Name must be at most 100 characters.'),

    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),

    body('role')
      .notEmpty().withMessage('Role is required.')
      .isIn(['client', 'editor', 'admin']).withMessage('Role must be client, editor, or admin.'),
  ],
  register
);

// ─── Login ────────────────────────────────
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required.'),
  ],
  login
);

// ─── Get current user (token check) ───────
router.get('/me', authMiddleware, getMe);

module.exports = router;
