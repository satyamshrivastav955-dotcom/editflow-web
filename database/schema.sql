-- EditFlow Module 1 – Database Schema
-- Run this in your MySQL client

CREATE DATABASE IF NOT EXISTS editflow;
USE editflow;

-- ─────────────────────────────────────────
-- Table: users
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('client','editor','admin') NOT NULL DEFAULT 'client',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────
-- Table: projects
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  client_id               INT           NOT NULL,
  project_name            VARCHAR(200)  NOT NULL,
  description             TEXT          NOT NULL,
  project_type            VARCHAR(100)  NOT NULL,
  deadline                DATE          NOT NULL,
  budget                  DECIMAL(10,2) NOT NULL,
  resolution              VARCHAR(50),
  aspect_ratio            VARCHAR(20),
  editing_style           VARCHAR(100),
  subtitles_required      BOOLEAN       NOT NULL DEFAULT FALSE,
  music_required          BOOLEAN       NOT NULL DEFAULT FALSE,
  color_grading_required  BOOLEAN       NOT NULL DEFAULT FALSE,
  additional_instructions TEXT,
  status                  ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_project_client
    FOREIGN KEY (client_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────
-- Indexes for common queries
-- ─────────────────────────────────────────
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status    ON projects(status);
