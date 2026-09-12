// src/routes/projectRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// ─── Shared validation rules ──────────────
const projectValidation = [
  body('project_name')
    .trim()
    .notEmpty().withMessage('Project name is required.')
    .isLength({ max: 200 }).withMessage('Project name must be at most 200 characters.'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.'),

  body('project_type')
    .trim()
    .notEmpty().withMessage('Project type is required.')
    .isIn([
      'YouTube Video', 'Instagram Reel', 'Short Film',
      'Advertisement', 'Podcast', 'Other',
    ]).withMessage('Invalid project type.'),

  body('deadline')
    .notEmpty().withMessage('Deadline is required.')
    .isDate().withMessage('Deadline must be a valid date (YYYY-MM-DD).'),

  body('budget')
    .notEmpty().withMessage('Budget is required.')
    .isFloat({ gt: 0 }).withMessage('Budget must be a positive number.'),
];

const updateValidation = [
  body('project_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Project name cannot be empty.')
    .isLength({ max: 200 }),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty.'),

  body('project_type')
    .optional()
    .isIn([
      'YouTube Video', 'Instagram Reel', 'Short Film',
      'Advertisement', 'Podcast', 'Other',
    ]).withMessage('Invalid project type.'),

  body('deadline')
    .optional()
    .isDate().withMessage('Deadline must be a valid date.'),

  body('budget')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Budget must be a positive number.'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status.'),
];

// ─── Routes ───────────────────────────────
router.post('/',   projectValidation, createProject);
router.get('/',    getProjects);
router.get('/:id', getProject);
router.put('/:id', updateValidation, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
