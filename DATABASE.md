# Database Structure and Tables

## Overview
This document provides an overview of the database schema, including table definitions, relationships, and key fields.

## Tables

### 1. **users**
Stores user information.

- **Primary Key:** `user_id`
- **Fields:**
  - `email` (TEXT, NOT NULL)
  - `firstname` (TEXT, NOT NULL)
  - `lastname` (TEXT, NOT NULL)
  - `password` (TEXT, NOT NULL)
  - `city` (TEXT)
  - `mobile` (VARCHAR)
  - `lang` (TEXT, NOT NULL)
  - `token` (TEXT)
  - `created` (TEXT, NOT NULL, DEFAULT `CURRENT_TIMESTAMP`)

---

### 2. **_projects**
Stores basic project information for offline availability.

- **Primary Key:** `project_id_`
- **Fields:**
  - `project_uuid` (TEXT, NOT NULL)
  - `projectname` (TEXT, NOT NULL)
  - `start` (TEXT, NOT NULL)
  - `lang` (TEXT, NOT NULL)

---

### 3. **ft_projects**
Tracks projects with files uploaded to the FTP server.

- **Primary Key:** `ft_project_id`
- **Foreign Keys:** 
  - `user_id` → `users(user_id)`
  - `project_id` → `projects(project_id)`
- **Fields:**
  - `project_uuid` (TEXT)
  - `projectname` (TEXT)
  - `is_sent` (BOOLEAN, DEFAULT `0`)
  - `is_deleted` (BOOLEAN, DEFAULT `0`)
  - `created` (TEXT, DEFAULT `CURRENT_TIMESTAMP`)
  - `user_id` (INTEGER)
  - `project_id` (INTEGER)

---

### 4. **ft_files**
Stores files uploaded to the FTP server for corresponding projects.

- **Primary Key:** `ft_file_id`
- **Foreign Key:** `ft_project_id` → `ft_projects(ft_project_id)`
- **Fields:**
  - `filename` (VARCHAR(255), NOT NULL)
  - `filepath` (VARCHAR(255))
  - `uploaded_at` (TIMESTAMP, DEFAULT `CURRENT_TIMESTAMP`)

---

### 5. **projects**
Stores detailed project information.

- **Primary Key:** `project_id`
- **Foreign Key:** `user_id` → `users(user_id)`
- **Fields:**
  - `project_uuid` (TEXT, NOT NULL)
  - `projectname` (TEXT, NOT NULL)
  - `photographername` (TEXT)
  - `project_date` (TEXT, NOT NULL)
  - `type` (TEXT, NOT NULL)
  - `anomaly` (TEXT)
  - `merged_teams` (TEXT)
  - `unit` (BOOLEAN)
  - `lang` (TEXT)
  - `created` (TEXT, DEFAULT `CURRENT_TIMESTAMP`)
  - `alert_sale` (BOOLEAN)
  - `is_deleted` (BOOLEAN, DEFAULT `0`)
  - `is_sent` (BOOLEAN, DEFAULT `0`)
  - `is_sent_id` (INTEGER)
  - `files_uploaded` (BOOLEAN, DEFAULT `0`)
  - `sent_date` (TEXT)

---

### 6. **knowledgebase**
Stores articles and downloadable files for offline access.

- **Primary Key:** `id`
- **Fields:**
  - `article_id` (TEXT, UNIQUE, NOT NULL)
  - `title` (TEXT, UNIQUE, NOT NULL)
  - `description` (TEXT, NOT NULL)
  - `tags` (TEXT)
  - `langs` (TEXT)
  - `files` (TEXT)
  - `author` (TEXT)
  - `created_at` (TEXT, NOT NULL)
  - `updated_at` (TEXT)
  - `deleted` (INTEGER, DEFAULT `0`)

---

### 7. **timereport**
Logs time reports for projects.

- **Primary Key:** `id`
- **Foreign Keys:**
  - `user_id` → `users(user_id)`
  - `project_id` → `projects(project_id)`
- **Fields:**
  - `projectname` (TEXT, NOT NULL)
  - `starttime` (TEXT, NOT NULL)
  - `endtime` (TEXT, NOT NULL)
  - `breaktime` (REAL, DEFAULT `0.5`)
  - `miles` (REAL, DEFAULT `0`)
  - `tolls` (REAL, DEFAULT `0`)
  - `park` (REAL, DEFAULT `0`)
  - `other_fees` (REAL, DEFAULT `0`)
  - `is_sent` (BOOLEAN, DEFAULT `0`)
  - `created` (TEXT, DEFAULT `CURRENT_TIMESTAMP`)
  - `project_date` (TEXT, NOT NULL)

---

### 8. **schema_version**
Tracks applied database schema versions.

- **Primary Key:** `id`
- **Fields:**
  - `version` (INTEGER, NOT NULL)
  - `applied_at` (TEXT, DEFAULT `CURRENT_TIMESTAMP`)

---

### 9. **news**
Manages news entries and read statuses.

- **Primary Key:** `id`
- **Fields:**
  - `title` (TEXT)
  - `content` (TEXT)
  - `author` (TEXT)
  - `created_at` (TEXT)
  - `updated_at` (TEXT)
  - `is_read` (BOOLEAN, DEFAULT `0`)
  - `is_sent_date` (TIMESTAMP, DEFAULT `NULL`)

---

### 10. **teams**
Stores data about teams and their configurations.

- **Primary Key:** `team_id`
- **Foreign Key:** `project_id` → `projects(project_id)`
- **Fields:**
  - `teamname` (TEXT, NOT NULL)
  - `amount` (INTEGER)
  - `leader_firstname`, `leader_lastname`, `leader_address`, etc. (TEXT)
  - `portrait` (BOOLEAN, DEFAULT `0`)
  - `is_deleted` (BOOLEAN, DEFAULT `0`)
  - `created` (TEXT, DEFAULT `CURRENT_TIMESTAMP`)

---

### 11. **teams_history**
Keeps track of historical team data.

- **Primary Key:** `team_history_id`
- **Foreign Key:** `team_id` → `teams(team_id)`
- **Fields:**
  - Similar to `teams` table with additional historical fields.
