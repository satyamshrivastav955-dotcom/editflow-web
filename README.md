# EditFlow – Module 1

**A collaborative video-editing project management platform for freelance editors and clients.**

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + TypeScript + Vite        |
| State      | Redux Toolkit                       |
| Routing    | React Router v6                     |
| HTTP       | Axios                               |
| Backend    | Node.js + Express.js                |
| Database   | MySQL                               |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Validation | express-validator (BE) + custom (FE)|
| PHP Demo   | PHP 8 + PDO/MySQLi                  |

---

## Project Structure

```
editflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── projectController.js
│   │   ├── middleware/auth.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── projectRoutes.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── projects/
│   │   │       ├── ProjectCard.tsx
│   │   │       ├── ProjectForm.tsx
│   │   │       └── ProjectList.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── CreateProjectPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   └── EditProjectPage.tsx
│   │   ├── redux/
│   │   │   ├── authSlice.ts
│   │   │   ├── projectSlice.ts
│   │   │   └── store.ts
│   │   ├── services/api.ts
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── php-demo/
    └── auth_demo.php
```

---

## Setup Instructions

### 1. MySQL Database

Open your MySQL client (MySQL Workbench / CLI) and run:

```sql
source /path/to/editflow/database/schema.sql
```

### 2. Backend

```bash
cd editflow/backend
cp .env.example .env     # Edit DB_PASSWORD if needed
npm install
npm run dev              # Starts on http://localhost:5000
```

### 3. Frontend

```bash
cd editflow/frontend
npm install
npm run dev              # Opens http://localhost:5173
```

### 4. PHP Demo (Optional)

Copy `php-demo/auth_demo.php` to your XAMPP/WAMP `htdocs` folder and open:
```
http://localhost/auth_demo.php
```

---

## API Endpoints

### Authentication

| Method | URL                    | Auth Required | Description          |
|--------|------------------------|---------------|----------------------|
| POST   | `/api/auth/register`   | ❌            | Register new user    |
| POST   | `/api/auth/login`      | ❌            | Login + get JWT      |
| GET    | `/api/auth/me`         | ✅ JWT        | Get current user     |

### Projects

| Method | URL                    | Auth Required | Description          |
|--------|------------------------|---------------|----------------------|
| POST   | `/api/projects`        | ✅ JWT        | Create project       |
| GET    | `/api/projects`        | ✅ JWT        | Get all my projects  |
| GET    | `/api/projects/:id`    | ✅ JWT        | Get project by ID    |
| PUT    | `/api/projects/:id`    | ✅ JWT        | Update project       |
| DELETE | `/api/projects/:id`    | ✅ JWT        | Delete project       |

---

## Postman Testing

### Register

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Satyam Sharma",
  "email": "satyam@example.com",
  "password": "secret123",
  "role": "client"
}
```

### Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "satyam@example.com",
  "password": "secret123"
}
```
> Copy the `token` from the response. Use it as `Authorization: Bearer <token>` in all project requests.

### Create Project

```
POST http://localhost:5000/api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_name": "YouTube Video #01",
  "description": "10-minute technology review video.",
  "project_type": "YouTube Video",
  "deadline": "2026-09-20",
  "budget": 5000,
  "resolution": "1920 × 1080",
  "aspect_ratio": "16:9",
  "editing_style": "Fast-paced and cinematic",
  "subtitles_required": true,
  "music_required": true,
  "color_grading_required": true,
  "additional_instructions": "Keep the intro below 15 seconds."
}
```

### Get All Projects

```
GET http://localhost:5000/api/projects
Authorization: Bearer <token>
```

### Update Project

```
PUT http://localhost:5000/api/projects/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

### Delete Project

```
DELETE http://localhost:5000/api/projects/1
Authorization: Bearer <token>
```

---

## Frontend Routes

| Route                  | Page                  |
|------------------------|-----------------------|
| `/login`               | Login Page            |
| `/register`            | Register Page         |
| `/dashboard`           | Client Dashboard      |
| `/projects`            | Projects List         |
| `/projects/create`     | Create New Project    |
| `/projects/:id`        | Project Details       |
| `/projects/:id/edit`   | Edit Project          |

---

## Module 1 Workflow

```
Register → Login → Dashboard → Create Project → Fill Requirements
→ Submit → Saved to MySQL → Project Details → View / Edit / Delete
```

---

## Syllabus Coverage

| Topic                          | Implemented In                           |
|--------------------------------|------------------------------------------|
| React Components               | All .tsx files                           |
| JSX/TSX                        | All pages and components                 |
| Props & State                  | ProjectForm, ProjectCard, StatusBadge    |
| Events & Forms                 | LoginPage, RegisterPage, ProjectForm     |
| React Router                   | App.tsx – 7 routes                       |
| Redux                          | authSlice, projectSlice, store           |
| TypeScript                     | All frontend files (types/index.ts)      |
| Hooks (useState/useEffect)     | All pages + useAuth.ts                   |
| API Integration                | services/api.ts + Axios                  |
| Node.js + Express              | backend/src/index.js                     |
| Node modules / NPM             | package.json (both)                      |
| Database connectivity          | config/db.js (mysql2/promise pool)       |
| PHP form + session + MySQL     | php-demo/auth_demo.php                   |

---

## What's Next – Module 2

- Editor assignment workflow
- Video file uploads
- Multiple video versions
- Timestamp-based revision system
- Spring Boot API implementation
- Servlet/JSP academic demo
