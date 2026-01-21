---
id: 001
title: generate-tasks
stage: tasks
date_iso: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-web-todo
branch: main
user: user
command: /sp.tasks
labels: ["tasks", "phase-ii", "full-stack", "web-todo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - C:\Users\user\Desktop\AI-Hackathon-2\todo\specs\001-web-todo\tasks.md
tests_yaml: |
  - Generated tasks.md following spec-driven development principles
  - Validated task format compliance with checklist requirements
  - Verified user story organization and dependencies
---

# Generate Tasks for Phase II - Full-Stack Web Todo Application

## Prompt Text

```
# Tasks: Phase II - Full-Stack Web Todo Application

**Prerequisites**: plan.md, spec.md, data-model.md, API/Auth contracts in `specs/2-web-todo/`
**Legend**: `[P]` Parallel, `[BE]` Backend, `[FE]` Frontend, `[INT]` Integration

---

## Phase 1: Monorepo Setup (6 tasks)

```bash
# T201-T206: Create project structure
mkdir -p hackathon-todo/{frontend,backend,specs/2-web-todo}
cd hackathon-todo
```

- [ ] **T201**: Create root `hackathon-todo/` directory
- [ ] **T202**: Create `frontend/` and `backend/` subdirectories
- [ ] **T203**: Create `specs/2-web-todo/` directory
- [ ] **T204** [P]: Create root `CLAUDE.md` with monorepo navigation instructions
- [ ] **T205** [P]: Create root `README.md` with setup commands for both services
- [ ] **T206** [P]: Create `.gitignore` (Node.js + Python patterns)

**Validate**: `ls -la` shows all directories

---

## Phase 2: Backend Foundation (11 tasks) - BLOCKING

**Critical**: Must complete before any API work

```bash
# T207-T217: Backend setup
cd backend
uv init
```

- [ ] **T207** [BE]: Initialize UV project in `backend/`
- [ ] **T208** [BE]: Add dependencies:
  ```bash
  uv add fastapi sqlmodel psycopg2-binary python-jose[cryptography] uvicorn[standard]
  ```
- [ ] **T209** [BE]: Add dev dependencies:
  ```bash
  uv add --dev mypy ruff pytest httpx
  ```
- [ ] **T210** [BE]: Create `backend/src/` with `__init__.py`
- [ ] **T211** [BE]: Create `backend/.env.example`:
  ```
  DATABASE_URL=postgresql://user:pass@host/db
  BETTER_AUTH_SECRET=<shared-secret>
  ```

**Models** (2 tasks):
- [ ] **T212** [BE]: Create `User` model in `backend/src/models.py`:
  - `id: str` (UUID primary key)
  - `email: str` (unique, indexed)
  - `name: str`, `created_at: datetime`

- [ ] **T213** [BE]: Create `Task` model in `backend/src/models.py`:
  - `id: int` (auto-increment), `user_id: str` (FK, indexed)
  - `title: str` (1-200), `description: str | None` (max 1000)
  - `completed: bool` (default False)
  - `created_at, updated_at: datetime`

**Infrastructure** (4 tasks):
- [ ] **T214** [BE]: Create `backend/src/db.py`:
  - `engine = create_engine(DATABASE_URL)`
  - `get_session()` dependency function
  - `create_db_and_tables()` for startup

- [ ] **T215** [BE]: Create `backend/src/config.py`:
  - Pydantic `Settings` class with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `DEBUG: bool`

- [ ] **T216** [BE]: Create `backend/src/auth.py`:
  - `verify_jwt(authorization: str) -> dict`
  - Decode JWT using `BETTER_AUTH_SECRET`
  - Return `{"user_id": ..., "email": ...}`
  - Raise `HTTPException(401)` if invalid/expired

- [ ] **T217** [BE]: Create `backend/src/main.py`:
  - `app = FastAPI()` with CORS middleware
  - Startup event: `create_db_and_tables()`
  - Include tasks router (placeholder)

**Validate**: `uv run mypy --strict backend/src/` passes with 0 errors

---

## Phase 3-8: Backend API (13 tasks)

### List Tasks (4 tasks)
```bash
# T218-T221: Implement GET endpoint
```

- [ ] **T218** [BE]: Create `backend/src/routes/tasks.py` with `APIRouter()`
- [ ] **T219** [BE]: Implement `GET /api/{user_id}/tasks`:
  - JWT check via `Depends(verify_jwt)`
  - Verify `token["user_id"] == path_user_id` (403 if not)
  - Query: `SELECT * FROM tasks WHERE user_id = {user_id}`
  - Return `List[Task]`
- [ ] **T220** [BE]: Add `status` query param: `all | pending | completed`
- [ ] **T221** [BE]: Register router in `main.py`: `app.include_router(tasks.router)`

**Checkpoint**: Test with curl:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/{user_id}/tasks
```

### Create Task (3 tasks)
```bash
# T222-T224: Implement POST endpoint
```

- [ ] **T222** [BE]: Create `TaskCreate` schema in `models.py`:
  ```python
  class TaskCreate(BaseModel):
      title: str = Field(min_length=1, max_length=200)
      description: str | None = Field(default=None, max_length=1000)
  ```
- [ ] **T223** [BE]: Implement `POST /api/{user_id}/tasks`:
  - JWT check, user_id verify
  - `INSERT INTO tasks (user_id, title, description) VALUES (...)`
  - Return `Task` with 201 status
- [ ] **T224** [BE]: Add validation error handling (422 Unprocessable Entity)

### Update Task (3 tasks)
```bash
# T225-T227: Implement PUT endpoint
```

- [ ] **T225** [BE]: Create `TaskUpdate` schema:
  ```python
  class TaskUpdate(BaseModel):
      title: str | None = None
      description: str | None = None
  ```
- [ ] **T226** [BE]: Implement `PUT /api/{user_id}/tasks/{id}`:
  - Query: `WHERE id = {id} AND user_id = {user_id}`
  - Return 404 if not found
  - Update provided fields only
- [ ] **T227** [BE]: Set `updated_at = datetime.utcnow()` on update

### Delete, Toggle, Get Single (3 tasks)
```bash
# T228-T230: Remaining CRUD operations
```

- [ ] **T228** [BE]: `DELETE /api/{user_id}/tasks/{id}` → Return 204 No Content
- [ ] **T229** [BE]: `PATCH /api/{user_id}/tasks/{id}/complete`:
  - Toggle: `completed = NOT completed`
  - Update `updated_at`
  - Return updated `Task`
- [ ] **T230** [BE]: `GET /api/{user_id}/tasks/{id}` → Return single `Task` or 404

**Checkpoint**: All 6 endpoints working - test with Postman/curl

---

## Phase 9-10: Frontend Foundation & Auth (12 tasks)

### Foundation (8 tasks)
```bash
# T231-T238: Next.js setup
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
```

- [ ] **T231** [FE]: Initialize Next.js project in `frontend/`
- [ ] **T232** [FE]: Install dependencies:
  ```bash
  npm install better-auth lucide-react
  ```
- [ ] **T233** [FE]: Install dev dependencies:
  ```bash
  npm install -D @types/node
  ```
- [ ] **T234** [FE]: Create `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  BETTER_AUTH_SECRET=<same-as-backend>
  ```
- [ ] **T235** [FE]: Define types in `frontend/types/index.ts`:
  ```typescript
  export interface Task {
    id: number
    user_id: string
    title: string
    description?: string
    completed: boolean
    created_at: string
    updated_at: string
  }

  export interface User {
    id: string
    email: string
    name: string
  }
  ```
- [ ] **T236** [FE]: Create `frontend/lib/auth.ts`:
  - Better Auth client config
  - `getSession()`, `signIn()`, `signUp()` helpers

- [ ] **T237** [FE]: Create `frontend/lib/api.ts`:
  ```typescript
  export class ApiClient {
    private token: string | null = null

    setToken(token: string): void
    getTasks(userId: string, status?: string): Promise<Task[]>
    createTask(userId: string, title: string, desc?: string): Promise<Task>
    updateTask(userId: string, taskId: number, data: Partial<Task>): Promise<Task>
    deleteTask(userId: string, taskId: number): Promise<void>
    toggleTask(userId: string, taskId: number): Promise<Task>
  }
  ```
- [ ] **T238** [FE]: Create `frontend/CLAUDE.md` with Next.js patterns

**Validate**: `npm run build` succeeds with 0 TypeScript errors

### Auth UI (4 tasks)
```bash
# T239-T242: Authentication pages
```

- [ ] **T239** [FE]: Create `app/(auth)/layout.tsx` for auth group
- [ ] **T240** [FE]: Create `app/(auth)/signup/page.tsx`:
  - Form: email, password, name fields
  - Submit → `signUp()` → redirect to /signin
- [ ] **T241** [FE]: Create `app/(auth)/signin/page.tsx`:
  - Form: email, password fields
  - Submit → `signIn()` → store JWT → redirect to /dashboard
- [ ] **T242** [FE]: Create protected route in `app/dashboard/layout.tsx`:
  - Check `getSession()` server-side
  - Redirect to /signin if no session

**Checkpoint**: Auth flow works - signup → signin → dashboard access

---

## Phase 11-15: Frontend Task UI (23 tasks)

### View Tasks (4 tasks)
```bash
# T243-T246: Display tasks
```

- [ ] **T243** [FE]: Create `app/dashboard/page.tsx` (Server Component):
  - Fetch session, pass `userId` to client component
- [ ] **T244** [FE]: Create `components/TaskDashboard.tsx` (Client Component):
  - `useState` for tasks, loading, error
  - `useEffect` to `api.getTasks(userId)`
  - Render `<TaskList>` and `<AddTaskForm>`
- [ ] **T245** [FE]: Create `components/TaskList.tsx`:
  - Map `tasks.map(task => <TaskItem key={task.id} task={task} />)`
  - Show "No tasks yet. Add one!" if empty
- [ ] **T246** [FE]: Create `components/TaskItem.tsx`:
  - Display: checkbox, title, description, edit icon, delete icon
  - Handlers: `onToggle`, `onEdit`, `onDelete` props

### Add Task (3 tasks)
```bash
# T247-T249: Create task form
```

- [ ] **T247** [FE]: Create `components/AddTaskForm.tsx`:
  - Form: title (required), description (optional)
  - Submit → `api.createTask()` → add to list
  - Validation: title 1-200 chars
- [ ] **T248** [FE]: Integrate `<AddTaskForm>` into `TaskDashboard`
- [ ] **T249** [FE]: Add optimistic UI update (show task before API responds)

### Update Task (4 tasks)
```bash
# T250-T253: Inline editing
```

- [ ] **T250** [FE]: Add `isEditing` state to `TaskItem`
- [ ] **T251** [FE]: Show edit form when `isEditing = true`:
  - Inputs pre-filled with current title/description
  - Save and Cancel buttons
- [ ] **T252** [FE]: Save handler:
  - Call `api.updateTask()`
  - Update task in list
  - Set `isEditing = false`
- [ ] **T253** [FE]: Cancel handler: Reset form, set `isEditing = false`

### Delete Task (3 tasks)
```bash
# T254-T256: Delete functionality
```

- [ ] **T254** [FE]: Add delete icon click handler
- [ ] **T255** [FE]: Show `confirm("Delete this task?")` dialog
- [ ] **T256** [FE]: On confirm:
  - Call `api.deleteTask()`
  - Remove from list on success

### Toggle Complete (3 tasks)
```bash
# T257-T259: Checkbox functionality
```

- [ ] **T257** [FE]: Add checkbox component to `TaskItem`
- [ ] **T258** [FE]: Style: `[ ]` for incomplete, `[✓]` for complete
- [ ] **T259** [FE]: Checkbox click handler:
  - Call `api.toggleTask()`
  - Update `completed` status in list

**Checkpoint**: Full UI working - complete CRUD cycle functional

---

## Phase 16: Integration & Polish (8 tasks)

```bash
# T260-T267: Final validation and deployment prep
```

- [ ] **T260** [INT]: E2E test flow:
  - Signup → Signin → Add task → View → Update → Delete → Toggle
- [ ] **T261** [INT]: User isolation test:
  - Create 2 users, verify each sees only their tasks
- [ ] **T262** [INT]: JWT expiry test:
  - Wait for token expiration, verify redirect to signin
- [ ] **T263** [BE]: Run `uv run mypy --strict backend/src/` - fix all errors
- [ ] **T264** [BE]: Run `uv run ruff check backend/src/` - fix all issues
- [ ] **T265** [FE]: Run `npm run build` - fix all TypeScript errors
- [ ] **T266** [P]: Create deployment guide in root `README.md`
- [ ] **T267** [P]: Record 90-second demo video (all features)

**Final Validate**: Full stack works in production mode

---

## Execution Strategy

### Solo Developer (Sequential)
```
Phase 1 (6) → Phase 2 (11) → Phase 3-8 (13) →
Phase 9-10 (12) → Phase 11-15 (23) → Phase 16 (8)

Total: 73 tasks, ~2-3 weeks
```

### Two Developers (Parallel)
```
Dev A: Phase 1 (together) → Phase 2-8 (24 tasks, backend complete)
Dev B: Phase 1 (together) → Phase 9-15 (35 tasks, frontend complete)
Both:  Phase 16 (8 tasks, integration)

Total: ~1-2 weeks
```

### MVP Path (37 tasks for working demo)
```
Phase 1 (6) → Phase 2 (11) →
T218-T223 (7 tasks: List + Create API) →
Phase 9-10 (12 tasks: Auth + Foundation) →
T243-T249 (7 tasks: View + Add UI)

= Auth + List + Create working in ~1 week
```

---

## Quick Reference

**Validation Commands:**
```bash
# Backend
cd backend
uv run mypy --strict src/
uv run ruff check src/
uv run pytest

# Frontend
cd frontend
npm run build
npm run lint

# Run both
npm run dev    # Frontend on :3000
uvicorn src.main:app --reload  # Backend on :8000
```

**Environment Setup:**
```bash
# Backend .env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<shared-secret>

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<same-secret>
```

---

**Total Tasks**: 67
**Critical Dependencies**: Phase 2 blocks Phase 3-8 | Phase 10 blocks Phase 11-15
**Parallel Work**: Backend (T207-T230) and Frontend (T231-T259) independent after Phase 1
```

## Response Text

Generated comprehensive tasks.md file for Phase II - Full-Stack Web Todo Application based on the specifications from spec.md, plan.md, data-model.md, and API contracts. The tasks are organized by user stories in priority order, with proper dependencies and parallel execution opportunities identified. Each task follows the required checklist format with sequential IDs, labels for parallelizability and user story mapping, and clear file paths where applicable.

The generated tasks cover:
- Monorepo setup and project structure
- Backend foundation with FastAPI, SQLModel, and JWT authentication
- All six user stories from the specification implemented in priority order
- Frontend foundation with Next.js, Better Auth, and responsive UI
- Complete CRUD operations for tasks with proper security and user isolation
- Integration and validation tasks to ensure security and functionality

The tasks are designed to enable independent implementation and testing of each user story while maintaining proper dependencies between phases.