# Claude Code Instructions for Hackathon Todo App

This is a monorepo containing both frontend and backend for the todo application.

## Navigation

- `frontend/` - Next.js application with Better Auth integration
- `backend/` - FastAPI application with SQLModel and JWT authentication
- `specs/001-web-todo/` - All specifications, plans, and tasks for the web todo feature.

## Development Workflow

### Backend (Python/FastAPI)
```bash
cd backend
uv venv  # Create virtual environment
source .venv/bin/activate  # Activate (on Windows: .venv\Scripts\activate)
uv pip install -e .  # Install dependencies
uvicorn src.main:app --reload  # Start development server
```

### Frontend (Next.js)
```bash
cd frontend
npm install  # Install dependencies
npm run dev  # Start development server
```

## Architecture Notes

- Authentication is handled by Better Auth with JWT tokens
- User isolation is enforced at the database level with user_id filtering
- All API endpoints require JWT validation in headers
- Shared BETTER_AUTH_SECRET between frontend and backend