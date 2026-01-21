# Hackathon Todo Application

A full-stack web todo application with user authentication and task management.

## Features

- User authentication (signup/signin)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- User isolation (each user sees only their own tasks)

## Tech Stack

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS, Better Auth
- **Backend**: Python 3.13+, FastAPI, SQLModel, Neon PostgreSQL
- **Authentication**: JWT tokens with Better Auth
- **Database**: Neon Serverless PostgreSQL

## Setup

### Prerequisites

- Node.js 18+
- Python 3.13+
- UV package manager
- PostgreSQL (or Neon account)

### Backend Setup

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
cp .env.example .env
# Update .env with your database URL and auth secret
uvicorn src.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with your API URL and auth secret
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host/db
BETTER_AUTH_SECRET=your-super-secret-key-here
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-key-here
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login and get token
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/users/{user_id}/tasks` - Get user's tasks
- `POST /api/users/{user_id}/tasks` - Create new task
- `PUT /api/users/{user_id}/tasks/{id}` - Update task
- `PATCH /api/users/{user_id}/tasks/{id}/complete` - Toggle task completion
- `DELETE /api/users/{user_id}/tasks/{id}` - Delete task

## Development

### Backend Development
```bash
# Run tests
uv run pytest

# Type checking
uv run mypy --strict src/

# Linting
uv run ruff check src/
```

### Frontend Development
```bash
# Build
npm run build

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment

### Backend
Deploy to a Python-compatible hosting service (Heroku, Railway, etc.)

### Frontend
Deploy to Vercel, Netlify, or similar platform

Set the appropriate environment variables in your deployment environment.