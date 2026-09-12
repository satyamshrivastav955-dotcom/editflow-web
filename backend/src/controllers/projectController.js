// src/controllers/projectController.js
const { validationResult } = require('express-validator');
const db = require('../config/db');

// ─────────────────────────────────────────
// POST /api/projects  – Create project
// ─────────────────────────────────────────
const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    project_name,
    description,
    project_type,
    deadline,
    budget,
    resolution,
    aspect_ratio,
    editing_style,
    subtitles_required,
    music_required,
    color_grading_required,
    additional_instructions,
  } = req.body;

  const clientId = req.user.id;

  try {
    const [result] = await db.execute(
      `INSERT INTO projects
        (client_id, project_name, description, project_type, deadline, budget,
         resolution, aspect_ratio, editing_style, subtitles_required,
         music_required, color_grading_required, additional_instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientId,
        project_name,
        description,
        project_type,
        deadline,
        parseFloat(budget),
        resolution        || null,
        aspect_ratio      || null,
        editing_style     || null,
        subtitles_required      ? 1 : 0,
        music_required          ? 1 : 0,
        color_grading_required  ? 1 : 0,
        additional_instructions || null,
      ]
    );

    const [rows] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Project created successfully.',
      project: rows[0],
    });
  } catch (err) {
    console.error('Create project error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────
// GET /api/projects  – Get all projects for logged-in client
// ─────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'admin') {
      // Admins see all projects
      [rows] = await db.execute(
        `SELECT p.*, u.name AS client_name
         FROM projects p
         JOIN users u ON p.client_id = u.id
         ORDER BY p.created_at DESC`
      );
    } else {
      // Clients see only their own projects
      [rows] = await db.execute(
        'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
    }
    return res.status(200).json({ projects: rows });
  } catch (err) {
    console.error('Get projects error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// GET /api/projects/:id  – Get single project
// ─────────────────────────────────────────
const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const project = rows[0];

    // Authorization: client can only see own projects
    if (req.user.role !== 'admin' && project.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.status(200).json({ project });
  } catch (err) {
    console.error('Get project error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// PUT /api/projects/:id  – Update project
// ─────────────────────────────────────────
const updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    // Check ownership
    const [existing] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    const project = existing[0];
    if (req.user.role !== 'admin' && project.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const {
      project_name,
      description,
      project_type,
      deadline,
      budget,
      resolution,
      aspect_ratio,
      editing_style,
      subtitles_required,
      music_required,
      color_grading_required,
      additional_instructions,
      status,
    } = req.body;

    await db.execute(
      `UPDATE projects SET
        project_name            = COALESCE(?, project_name),
        description             = COALESCE(?, description),
        project_type            = COALESCE(?, project_type),
        deadline                = COALESCE(?, deadline),
        budget                  = COALESCE(?, budget),
        resolution              = COALESCE(?, resolution),
        aspect_ratio            = COALESCE(?, aspect_ratio),
        editing_style           = COALESCE(?, editing_style),
        subtitles_required      = COALESCE(?, subtitles_required),
        music_required          = COALESCE(?, music_required),
        color_grading_required  = COALESCE(?, color_grading_required),
        additional_instructions = COALESCE(?, additional_instructions),
        status                  = COALESCE(?, status)
       WHERE id = ?`,
      [
        project_name            ?? null,
        description             ?? null,
        project_type            ?? null,
        deadline                ?? null,
        budget != null ? parseFloat(budget) : null,
        resolution              ?? null,
        aspect_ratio            ?? null,
        editing_style           ?? null,
        subtitles_required != null ? (subtitles_required ? 1 : 0) : null,
        music_required     != null ? (music_required     ? 1 : 0) : null,
        color_grading_required != null ? (color_grading_required ? 1 : 0) : null,
        additional_instructions ?? null,
        status                  ?? null,
        id,
      ]
    );

    const [updated] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      message: 'Project updated successfully.',
      project: updated[0],
    });
  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// DELETE /api/projects/:id  – Delete project
// ─────────────────────────────────────────
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    const project = existing[0];
    if (req.user.role !== 'admin' && project.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await db.execute('DELETE FROM projects WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
