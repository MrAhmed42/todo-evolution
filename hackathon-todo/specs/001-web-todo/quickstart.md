# Quickstart Guide: Phase II - Full-Stack Web Todo Application

**Feature**: 001-web-todo | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)

## Overview

This guide provides step-by-step instructions to set up, configure, and run the multi-user todo application locally. The application consists of a Next.js frontend and a FastAPI backend with Neon PostgreSQL database.

## Prerequisites

- **Node.js**: v18.0+ for Next.js frontend
- **Python**: v3.13+ for FastAPI backend
- **UV**: Package manager for Python (alternative to pip)
- **PostgreSQL**: Local installation or Neon Serverless account
- **Git**: Version control system
- **WSL 2**: (Windows users) for development environment consistency

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd todo

# Or if starting fresh:
mkdir todo
cd todo
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment with UV
uv venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate    # Windows

# Install dependencies
uv pip install -e .

# Install development dependencies
uv pip install -e ".[dev]"
```

### 3. Configure Environment Variables

#### Backend Configuration
```bash
# Create .env file in backend directory
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

Required backend variables:
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# JWT Configuration
JWT_SECRET="another-super-secret-for-jwt"
JWT_ALGORITHM="RS256"
JWT_EXPIRATION_DELTA=604800  # 7 days in seconds
```

#### Frontend Configuration
```bash
# Navigate to frontend directory
cd ../frontend

# Create environment file
cp .env.example .env.local

# Edit the file with your configuration
nano .env.local
```

Required frontend variables:
```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here"
```

### 4. Set Up Database

#### Option A: Local PostgreSQL
```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # Mac
# Or start via pgAdmin/other GUI

# Create database
psql -U postgres -c "CREATE DATABASE todo_db;"
psql -U postgres -c "CREATE USER todo_user WITH PASSWORD 'secure_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;"
```

#### Option B: Neon Serverless PostgreSQL
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string from the project dashboard
4. Update `DATABASE_URL` in backend `.env` file

### 5. Run Database Migrations

```bash
# Ensure you're in the backend directory with activated virtual environment
cd backend

# Run database migrations to create tables
uv run python -m src.db.init

# OR if using Alembic (if configured)
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 6. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies with npm
npm install

# Verify TypeScript configuration
npx tsc --noEmit
```

## Running the Application

### Method 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate  # Activate virtual environment
uv run python -m src.main
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Using Concurrently

Install concurrently globally:
```bash
npm install -g concurrently
```

Run both services:
```bash
concurrently "cd backend && source .venv/bin/activate && uv run python -m src.main" "cd frontend && npm run dev"
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Backend Redoc**: http://localhost:8000/redoc

## Testing the Setup

### 1. Verify Backend is Running
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

### 2. Verify Frontend is Running
- Open http://localhost:3000 in your browser
- You should see the landing page

### 3. Test Authentication Flow
1. Navigate to http://localhost:3000/signup
2. Create a new account
3. Sign in with your credentials
4. Verify you can access the dashboard

### 4. Test Task Operations
1. After signing in, go to the dashboard
2. Add a new task
3. Verify the task appears in the list
4. Try marking it as complete
5. Try editing and deleting the task

## Common Issues and Solutions

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Ensure UV virtual environment is activated and dependencies are installed
```bash
cd backend
uv venv  # Create venv if not exists
source .venv/bin/activate
uv pip install -e .
```

**Issue**: `ConnectionRefusedError: [Errno 111] Connection refused`
**Solution**: Verify PostgreSQL is running and credentials are correct

**Issue**: `OperationalError: FATAL: password authentication failed`
**Solution**: Check database credentials in `.env` file

### Frontend Issues

**Issue**: `TypeError: Cannot read properties of undefined`
**Solution**: Verify environment variables are set in `.env.local`

**Issue**: `Network Error` when calling API
**Solution**: Ensure backend is running on port 8000 and `NEXT_PUBLIC_API_URL` is set correctly

### Authentication Issues

**Issue**: JWT validation errors
**Solution**: Ensure `BETTER_AUTH_SECRET` is identical in both frontend and backend `.env` files

## Development Commands

### Backend Commands
```bash
# Run backend with auto-reload
uv run python -m src.main --reload

# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=src

# Format code
uv run ruff format src/
uv run black src/

# Lint code
uv run ruff check src/
uv run mypy src/
```

### Frontend Commands
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

## Database Operations

### Reset Database
```bash
# Connect to database and drop/create
psql -U todo_user -d todo_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then run migrations again
```

### Seed Sample Data
```bash
# Run seed script (if available)
cd backend
uv run python -m src.db.seed
```

## Environment Configuration

### Development Environment
```bash
# Backend .env
DATABASE_URL="postgresql://todo_user:secure_password@localhost:5432/todo_dev"
BETTER_AUTH_SECRET="dev_super_secret_key_for_local_development"
LOG_LEVEL="DEBUG"

# Frontend .env.local
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production Environment
```bash
# Backend .env
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/todo_prod"
BETTER_AUTH_SECRET="long-and-complex-production-secret-key"
LOG_LEVEL="INFO"

# Frontend .env.local
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_BETTER_AUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

## Next Steps

1. **Customize the UI**: Modify components in `frontend/components/`
2. **Extend API**: Add new endpoints in `backend/src/routes/`
3. **Add Features**: Implement additional user stories from the specification
4. **Configure Deployment**: Set up for Vercel (frontend) and appropriate backend hosting
5. **Add Tests**: Expand test coverage following TDD approach
6. **Performance Tuning**: Optimize database queries and API responses