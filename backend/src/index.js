// src/index.js – EditFlow Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Initialize DB connection (runs on require)
require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);

// ─── Health check ─────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── Global error handler ─────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

// ─── Start server ─────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  EditFlow backend running on http://localhost:${PORT}`);
});
