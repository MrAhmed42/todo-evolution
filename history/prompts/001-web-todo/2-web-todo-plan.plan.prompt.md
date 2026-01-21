---
id: 2
title: "web-todo-plan"
stage: plan
date_iso: "2026-01-12"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "001-web-todo"
branch: "001-web-todo"
user: "user"
command: "/sp.plan"
labels:
  - "implementation"
  - "planning"
  - "architecture"
  - "web-application"
links:
  spec: "specs/001-web-todo/spec.md"
  plan: "specs/001-web-todo/plan.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-web-todo/plan.md"
  - "specs/001-web-todo/data-model.md"
  - "specs/001-web-todo/contracts/api-endpoints.md"
  - "specs/001-web-todo/contracts/auth-flow.md"
  - "specs/001-web-todo/quickstart.md"
  - "history/prompts/001-web-todo/2-web-todo-plan.plan.prompt.md"
tests_yaml:
  - "constitution-check"
  - "spec-compliance"
  - "architecture-review"
outcome: "Complete implementation plan created with all required artifacts"
evaluation: "Successfully created implementation plan with data model, API contracts, auth flow, and quickstart guide"
---

# Implementation Plan: Phase II - Full-Stack Web Todo Application

**Branch**: `001-web-todo` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-web-todo/spec.md`

## Summary

Transform Phase I console application into a multi-user web application with persistent storage and authentication. The application provides a responsive web UI built with Next.js for task management, backed by a FastAPI REST API with Neon PostgreSQL database. Better Auth handles user authentication with JWT tokens, enforcing user isolation at the database query level.

## Technical Context

**Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth
**Backend**: Python 3.13+, FastAPI, SQLModel, Neon PostgreSQL
**Authentication**: Better Auth with JWT token issuance and verification
**Storage**: Neon Serverless PostgreSQL (persistent, multi-user)
**Testing**: pytest (backend), Jest (frontend) - 80% coverage target
**Target Platform**: Web (responsive design for mobile and desktop)
**Project Type**: Monorepo with frontend and backend services
**Performance Goals**: API response times: GET < 200ms, POST/PUT/PATCH/DELETE < 500ms (p95)
**Constraints**: User isolation mandatory, JWT required on all endpoints, shared secret between frontend/backend
**Scale/Scope**: Multi-user, ~10 concurrent users, ~1000 tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status | Notes |
|------|-------------|--------|-------|
| SDD Compliance | All code must reference Task IDs | ✅ Required | Tasks.md will define T-201, T-202, etc. |
| Spec-Driven | Specifications in `/specs` folder | ✅ Compliant | spec.md, plan.md, tasks.md all present |
| Stateless Architecture | All state in external DB, no in-memory session state | ✅ Required | Neon PostgreSQL for persistence |
| User Isolation | Filter all queries by authenticated user_id | ✅ Required | JWT verification + DB filtering |
| Type Hints | Full type annotations (Python backend, TypeScript frontend) | ✅ Required | mypy --strict + tsc --strict |
| Package Manager | UV (backend), npm (frontend) | ✅ Compliant | No pip/conda for backend |
| Monorepo | Frontend + backend in single repo | ✅ Compliant | Easier Claude Code navigation |

**Constitution Violations**: None detected. Phase II implements stateless architecture with JWT authentication and database persistence.

## Project Structure

### Documentation (this feature)

```text
specs/001-web-todo/
├── spec.md              # Feature specification
├── plan.md              # This file (/sp.plan command output)
├── data-model.md        # Phase 1 output - Database schema
├── quickstart.md        # Phase 1 output - Setup instructions
├── contracts/           # Phase 1 output
│   ├── api-endpoints.md # REST API contracts
│   └── auth-flow.md     # JWT authentication flow
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (monorepo)

```text
todo/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Better Auth
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/
│   │   │   ├── signin/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── dashboard/
│   │       └── page.tsx        # Task dashboard (protected)
│   ├── components/
│   │   ├── TaskList.tsx        # Task list display
│   │   ├── TaskItem.tsx        # Individual task
│   │   ├── AddTaskForm.tsx     # Task creation form
│   │   └── TaskFilters.tsx     # Status filters (Phase III)
│   ├── lib/
│   │   ├── api.ts              # API client with JWT
│   │   └── auth.ts             # Better Auth config
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── models.py           # SQLModel models (Task, User)
│   │   ├── db.py               # Database connection
│   │   ├── auth.py             # JWT verification middleware
│   │   ├── config.py           # Environment config
│   │   └── routes/
│   │       └── tasks.py        # Task CRUD endpoints
│   ├── tests/
│   │   ├── test_models.py
│   │   ├── test_auth.py
│   │   └── test_routes.py
│   ├── pyproject.toml          # UV config
│   └── .env.example
├── specs/                      # All specifications
├── CLAUDE.md                   # Root Claude Code instructions
└── README.md
```

**Structure Decision**: Monorepo with clear frontend/backend separation. Frontend uses Next.js App Router with Better Auth. Backend uses FastAPI with SQLModel ORM. Shared `.env` for `BETTER_AUTH_SECRET`.

## Complexity Assessment

### Critical Components

1. **Better Auth Integration (Frontend)**: Handles user signup/signin with JWT token management
2. **JWT Middleware (Backend)**: Verifies token signature, extracts user_id, attaches to request
3. **Task Routes (Backend)**: CRUD endpoints with user_id validation and database filtering
4. **SQLModel ORM**: Type-safe database operations with Pydantic validation
5. **Neon PostgreSQL**: Serverless Postgres with `users` and `tasks` tables

### Data Flow

#### Authentication Flow
```
1. User submits signup form
   → Frontend: Better Auth creates account
   → Backend: User record created (Better Auth manages)

2. User submits signin form
   → Frontend: Better Auth validates credentials
   → JWT token issued and stored

3. User accesses dashboard
   → Frontend: Redirects to /signin if no valid token
   → Backend: N/A (frontend-only check)
```

#### API Request Flow
```
1. User adds task via form
   → Frontend: Collects title, description
   → API Client: POST /api/{user_id}/tasks with JWT header

2. Backend receives request
   → Middleware: Verify JWT signature
   → Middleware: Extract user_id from token
   → Route: Verify token user_id == URL user_id
   → Route: INSERT INTO tasks WHERE user_id = {user_id}
   → Response: 201 Created with task object

3. Frontend receives response
   → Update UI with new task
   → Show success message
```

### Error Handling Strategy

| Scenario | HTTP Status | Frontend Behavior | Backend Response |
|----------|-------------|-------------------|------------------|
| No JWT token | 401 Unauthorized | Redirect to /signin | `{"detail": "Missing authentication"}` |
| Invalid JWT | 401 Unauthorized | Redirect to /signin | `{"detail": "Invalid token"}` |
| Expired JWT | 401 Unauthorized | Redirect to /signin | `{"detail": "Token expired"}` |
| User ID mismatch | 403 Forbidden | Show error toast | `{"detail": "Access denied"}` |
| Task not found | 404 Not Found | Show error message | `{"detail": "Task not found"}` |
| Validation error | 422 Unprocessable | Show field errors | `{"detail": [{"field": "message"}]}` |
| Database error | 500 Internal | Show retry option | `{"detail": "Database error"}` |

### Security Strategy

**JWT Token Flow:**
1. Better Auth issues JWT with `user_id`, `email`, `exp` (expiry)
2. Token signed with `BETTER_AUTH_SECRET` (shared between frontend/backend)
3. Frontend stores token (localStorage or cookie)
4. Frontend includes token in `Authorization: Bearer <token>` header
5. Backend verifies signature using same secret
6. Backend decodes token to extract `user_id`
7. Backend validates `token.user_id == url_params.user_id`

**User Isolation:**
- All database queries include `WHERE user_id = {authenticated_user_id}`
- Cross-user access attempts return 403 Forbidden
- Task IDs are globally unique but access is user-scoped

**Environment Variables:**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<shared-secret>

# Backend (.env)
DATABASE_URL=postgresql://user:pass@host/db
BETTER_AUTH_SECRET=<shared-secret>
```

## Phase 0: Research & Unknowns Resolution

### Research Tasks

1. **Better Auth Integration Patterns**
   - Decision: How to integrate Better Auth with Next.js App Router
   - Rationale: Next.js 16+ App Router has different patterns than pages router
   - Alternatives: Custom auth vs Better Auth vs NextAuth.js

2. **JWT Token Storage Strategy**
   - Decision: Where to store JWT tokens in browser (localStorage vs httpOnly cookies)
   - Rationale: Security vs convenience trade-offs
   - Alternatives: localStorage, sessionStorage, httpOnly cookies, memory

3. **Database Schema Design**
   - Decision: Optimal PostgreSQL schema for user isolation and performance
   - Rationale: Proper indexing and constraints for user isolation
   - Alternatives: Different indexing strategies, partitioning options

4. **Frontend API Client Architecture**
   - Decision: How to structure API client with automatic JWT inclusion
   - Rationale: Consistent authentication across all requests
   - Alternatives: Axios interceptors, fetch wrapper, SWR, React Query

### Research Outcomes

Based on best practices and the project constitution:
- Better Auth will be integrated with Next.js App Router using middleware for protected routes
- JWT tokens will be stored in httpOnly cookies for security (Better Auth default)
- Database will use proper indexes on `user_id` columns for performance
- API client will use fetch with automatic token inclusion from cookies

## Phase 1: Design & Contracts

### Data Model

**User Entity** (managed by Better Auth):
- `id`: UUID (primary key)
- `email`: VARCHAR UNIQUE (unique constraint)
- `name`: VARCHAR
- `created_at`: TIMESTAMP

**Task Entity**:
- `id`: INTEGER (auto-increment primary key)
- `user_id`: UUID (foreign key to User, indexed)
- `title`: VARCHAR(200) NOT NULL
- `description`: TEXT (nullable, max 1000 chars)
- `completed`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### API Contracts

#### Authentication Endpoints
```
POST /api/auth/signup     # Create account
POST /api/auth/signin     # Login and get token
POST /api/auth/signout    # Logout and invalidate token
GET  /api/auth/me         # Get current user info
```

#### Task CRUD Endpoints
```
GET    /api/users/{user_id}/tasks          # List user's tasks
POST   /api/users/{user_id}/tasks          # Create task for user
GET    /api/users/{user_id}/tasks/{id}     # Get specific task
PUT    /api/users/{user_id}/tasks/{id}     # Update task
PATCH  /api/users/{user_id}/tasks/{id}/complete  # Toggle completion
DELETE /api/users/{user_id}/tasks/{id}     # Delete task
```

#### Security Requirements
- All task endpoints require valid JWT in Authorization header
- JWT user_id must match URL user_id parameter
- 403 Forbidden returned for user_id mismatches

### Quickstart Guide

```bash
# Clone repository
git clone <repo-url>
cd todo

# Setup backend
cd backend
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install -e .
uv run alembic upgrade head  # Initialize database

# Setup frontend
cd ../frontend
npm install
cp .env.example .env.local
# Update environment variables in .env.local

# Run applications
# Terminal 1 (backend)
cd backend
uv run python -m src.main

# Terminal 2 (frontend)
cd frontend
npm run dev
```

### Technology Decisions

1. **Frontend Framework**: Next.js 16+ App Router for modern React development
2. **Styling**: Tailwind CSS for utility-first CSS
3. **Type Safety**: TypeScript with strict mode
4. **Backend Framework**: FastAPI for Python async web API
5. **ORM**: SQLModel for type-safe database operations
6. **Authentication**: Better Auth for secure JWT handling
7. **Database**: Neon Serverless PostgreSQL for scalability
8. **Package Manager**: UV for backend, npm for frontend

## Phase 2: Implementation Plan

### Implementation Order

1. **Setup & Configuration** (T-201)
   - Initialize project structure
   - Configure environment variables
   - Set up package managers (UV, npm)

2. **Backend Foundation** (T-202-T-205)
   - T-202: Set up FastAPI application
   - T-203: Implement SQLModel database models
   - T-204: Create JWT authentication middleware
   - T-205: Implement task CRUD endpoints with user isolation

3. **Frontend Foundation** (T-206-T-208)
   - T-206: Set up Next.js application with App Router
   - T-207: Integrate Better Auth for authentication
   - T-208: Create API client with JWT handling

4. **Core Features** (T-209-T-214)
   - T-209: Implement signup/signin UI
   - T-210: Create dashboard layout with protected routes
   - T-211: Build task list component
   - T-212: Implement add task form
   - T-213: Add task update/delete functionality
   - T-214: Implement task completion toggle

5. **Testing & Validation** (T-215-T-217)
   - T-215: Write backend unit tests
   - T-216: Write frontend integration tests
   - T-217: Perform security validation (user isolation)

6. **Documentation & Deployment** (T-218-T-219)
   - T-218: Update README and documentation
   - T-219: Prepare for Vercel deployment

## Risk Assessment

### High-Risk Areas

1. **Security**: JWT validation and user isolation must be robust
   - Mitigation: Thorough testing of user isolation, code review
2. **Authentication**: Better Auth integration with Next.js App Router
   - Mitigation: Follow official documentation, test thoroughly
3. **Database Performance**: Proper indexing for user isolation
   - Mitigation: Performance testing with realistic data volumes

### Contingency Plans

- If Better Auth proves incompatible with App Router, implement custom JWT solution
- If Neon PostgreSQL has issues, use local PostgreSQL for development
- If performance goals aren't met, optimize database queries and add caching

## Success Criteria Validation

All success criteria from spec.md will be validated:
- SC-001: Measure signup/signin/dashboard access time
- SC-002: Test all CRUD operations with valid inputs
- SC-003: Security audit with cross-user access attempts
- SC-004: Performance testing with load testing tools
- SC-005: Authentication validation with unauthenticated requests
- SC-006: TypeScript compilation and build validation
- SC-007: mypy strict type checking validation
- SC-008: Successful Vercel deployment and URL verification