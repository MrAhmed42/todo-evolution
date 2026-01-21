# Tasks: Phase II - Full-Stack Web Todo Application

**Prerequisites**: plan.md, spec.md, data-model.md, API/Auth contracts in `specs/001-web-todo/`
**Legend**: `[P]` Parallel, `[BE]` Backend, `[FE]` Frontend, `[INT]` Integration

---

## Phase 1: Monorepo Setup (6 tasks)

```bash
# T301-T306: Create project structure
mkdir -p hackathon-todo/{frontend,backend,specs/001-web-todo}
cd hackathon-todo
```

- [x] **T301** Create root `hackathon-todo/` directory
- [x] **T302** Create `frontend/` and `backend/` subdirectories
- [x] **T303** Create `specs/001-web-todo/` directory
- [x] **T304** [P] Create root `CLAUDE.md` with monorepo navigation instructions
- [x] **T305** [P] Create root `README.md` with setup commands for both services
- [x] **T306** [P] Create `.gitignore` (Node.js + Python patterns)

**Validate**: `ls -la` shows all directories

---

## Phase 2: Backend Foundation (11 tasks) - BLOCKING

**Critical**: Must complete before any API work

```bash
# T307-T317: Backend setup
cd backend
uv init
```

- [x] **T307** [BE] Initialize UV project in `backend/`
- [x] **T308** [BE] Add dependencies:
  ```bash
  uv add fastapi sqlmodel psycopg2-binary python-jose[cryptography] uvicorn[standard]
  ```
- [x] **T309** [BE] Add dev dependencies:
  ```bash
  uv add --dev mypy ruff pytest httpx
  ```
- [x] **T310** [BE] Create `backend/src/` with `__init__.py`
- [x] **T311** [BE] Create `backend/.env.example`:
  ```
  DATABASE_URL=postgresql://user:pass@host/db
  BETTER_AUTH_SECRET=<shared-secret>
  ```

**Models** (2 tasks):
- [x] **T312** [BE] Create `User` model in `backend/src/models.py`:
  - `id: str` (UUID primary key)
  - `email: str` (unique, indexed)
  - `name: str`, `created_at: datetime`

- [x] **T313** [BE] Create `Task` model in `backend/src/models.py`:
  - `id: int` (auto-increment), `user_id: str` (FK, indexed)
  - `title: str` (1-200), `description: str | None` (max 1000)
  - `completed: bool` (default False)
  - `created_at, updated_at: datetime`

**Infrastructure** (4 tasks):
- [x] **T314** [BE] Create `backend/src/db.py`:
  - `engine = create_engine(DATABASE_URL)`
  - `get_session()` dependency function
  - `create_db_and_tables()` for startup

- [x] **T315** [BE] Create `backend/src/config.py`:
  - Pydantic `Settings` class with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `DEBUG: bool`

- [x] **T316** [BE] Create `backend/src/auth.py`:
  - `verify_jwt(authorization: str) -> dict`
  - Decode JWT using `BETTER_AUTH_SECRET`
  - Return `{"user_id": ..., "email": ...}`
  - Raise `HTTPException(401)` if invalid/expired

- [x] **T317** [BE] Create `backend/src/main.py`:
  - `app = FastAPI()` with CORS middleware
  - Startup event: `create_db_and_tables()`
  - Include tasks router (placeholder)

**Validate**: `uv run mypy --strict backend/src/` passes with 0 errors

---

## Phase 3: User Story 1 - User Signup/Signin (Priority: P0) (13 tasks)

### Authentication Endpoints (5 tasks)
```bash
# T318-T322: Implement authentication endpoints
```

- [x] **T318** [BE] [US1] Create `backend/src/routes/auth.py` with `APIRouter()`
- [x] **T319** [BE] [US1] Implement `POST /api/auth/signup`:
  - Validate email format, password strength
  - Create user record in database
  - Return success response with user info
- [x] **T320** [BE] [US1] Implement `POST /api/auth/signin`:
  - Validate credentials against database
  - Issue JWT token with user_id and expiry
  - Return token and user info
- [x] **T321** [BE] [US1] Implement `POST /api/auth/signout`:
  - Invalidate session/token if needed
  - Return success confirmation
- [x] **T322** [BE] [US1] Implement `GET /api/auth/me`:
  - Verify JWT token
  - Return authenticated user info

### Frontend Auth Integration (8 tasks)
```bash
# T323-T330: Implement frontend authentication
```

- [x] **T323** [FE] [US1] Create `frontend/lib/auth.ts`:
  - Better Auth client configuration
  - `getSession()`, `signIn()`, `signUp()` helper functions
- [x] **T324** [FE] [US1] Create `app/(auth)/layout.tsx` for authentication routes
- [x] **T325** [FE] [US1] Create `app/(auth)/signup/page.tsx`:
  - Form with email, password, name fields
  - Submit handler for account creation
  - Redirect to signin after successful signup
- [x] **T326** [FE] [US1] Create `app/(auth)/signin/page.tsx`:
  - Form with email, password fields
  - Submit handler for authentication
  - Store JWT and redirect to dashboard
- [x] **T327** [FE] [US1] Create protected route middleware in `app/dashboard/layout.tsx`:
  - Check for valid session/server-side
  - Redirect to signin if no valid session
- [x] **T328** [FE] [US1] Create `frontend/types/index.ts` with User interface:
  ```typescript
  export interface User {
    id: string
    email: string
    name: string
  }
  ```
- [x] **T329** [FE] [US1] Create `frontend/lib/api.ts` with authentication methods:
  - `login(email, password)`, `register(email, password, name)`, `logout()`
- [x] **T330** [FE] [US1] Implement error handling for auth operations with user-friendly messages

**Validate**: User can signup, signin, and access dashboard with valid JWT

---

## Phase 4: User Story 2 - Add Task via Web UI (Priority: P1) (9 tasks)

### Backend API (4 tasks)
```bash
# T331-T334: Implement task creation API
```

- [x] **T331** [BE] [US2] Create `TaskCreate` schema in `models.py`:
  ```python
  class TaskCreate(BaseModel):
      title: str = Field(min_length=1, max_length=200)
      description: str | None = Field(default=None, max_length=1000)
  ```
- [x] **T332** [BE] [US2] Implement `POST /api/users/{user_id}/tasks`:
  - JWT check, user_id verification
  - Validate token user_id matches URL user_id (403 if not)
  - Create task with provided data in database
  - Return created `Task` with 201 status
- [x] **T333** [BE] [US2] Add validation error handling (422 Unprocessable Entity)
- [x] **T334** [BE] [US2] Register auth router in `main.py`: `app.include_router(auth.router)`

### Frontend UI (5 tasks)
```bash
# T335-T339: Implement add task UI
```

- [x] **T335** [FE] [US2] Create `app/dashboard/page.tsx` (Server Component):
  - Fetch session, pass `userId` to client component
- [x] **T336** [FE] [US2] Create `components/AddTaskForm.tsx`:
  - Form with title (required) and description (optional) fields
  - Submit handler: `api.createTask(userId, title, description)`
  - Validation: title 1-200 characters
- [x] **T337** [FE] [US2] Create `frontend/types/index.ts` with Task interface:
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
  ```
- [x] **T338** [FE] [US2] Extend `frontend/lib/api.ts` with task methods:
  ```typescript
  createTask(userId: string, title: string, desc?: string): Promise<Task>
  ```
- [x] **T339** [FE] [US2] Integrate `<AddTaskForm>` into `app/dashboard/page.tsx`

**Validate**: User can add tasks via web form and see success confirmation

---

## Phase 5: User Story 3 - View Personal Tasks (Priority: P1) (10 tasks)

### Backend API (4 tasks)
```bash
# T340-T343: Implement task listing API
```

- [x] **T340** [BE] [US3] Implement `GET /api/users/{user_id}/tasks`:
  - JWT check via `Depends(verify_jwt)`
  - Verify `token["user_id"] == path_user_id` (403 if not)
  - Query: `SELECT * FROM tasks WHERE user_id = {user_id}`
  - Return `List[Task]`
- [x] **T341** [BE] [US3] Add `status` query param: `all | pending | completed`
- [x] **T342** [BE] [US3] Implement `GET /api/users/{user_id}/tasks/{id}`:
  - JWT check, user_id verification
  - Verify token user_id matches URL user_id (403 if not)
  - Query: `SELECT * FROM tasks WHERE id = {id} AND user_id = {user_id}`
  - Return single `Task` or 404
- [x] **T343** [BE] [US3] Register tasks router in `main.py`: `app.include_router(tasks.router)`

### Frontend UI (6 tasks)
```bash
# T344-T349: Implement task viewing UI
```

- [x] **T344** [FE] [US3] Create `components/TaskDashboard.tsx` (Client Component):
  - `useState` for tasks, loading, error
  - `useEffect` to `api.getTasks(userId)`
  - Render `<TaskList>` and `<AddTaskForm>`
- [x] **T345** [FE] [US3] Create `components/TaskList.tsx`:
  - Map `tasks.map(task => <TaskItem key={task.id} task={task} />)`
  - Show "No tasks yet. Add one to get started!" if empty
- [x] **T346** [FE] [US3] Create `components/TaskItem.tsx`:
  - Display: checkbox, title, description, edit icon, delete icon
  - Basic display of task information
- [x] **T347** [FE] [US3] Extend `frontend/lib/api.ts` with task methods:
  ```typescript
  getTasks(userId: string, status?: string): Promise<Task[]>
  getTask(userId: string, taskId: number): Promise<Task>
  ```
- [x] **T348** [FE] [US3] Add optimistic UI update (show task before API responds)
- [x] **T349** [FE] [US3] Implement user isolation - verify each user sees only their own tasks

**Validate**: User can view their own tasks and cannot see other users' tasks

---

## Phase 6: User Story 4 - Update Task via Web UI (Priority: P1) (9 tasks)

### Backend API (3 tasks)
```bash
# T350-T352: Implement task update API
```

- [x] **T350** [BE] [US4] Create `TaskUpdate` schema:
  ```python
  class TaskUpdate(BaseModel):
      title: str | None = None
      description: str | None = None
      completed: bool | None = None
  ```
- [x] **T351** [BE] [US4] Implement `PUT /api/users/{user_id}/tasks/{id}`:
  - JWT check, user_id verification
  - Verify token user_id matches URL user_id (403 if not)
  - Query: `WHERE id = {id} AND user_id = {user_id}`
  - Return 404 if not found
  - Update provided fields only
- [x] **T352** [BE] [US4] Set `updated_at = datetime.utcnow()` on update

### Frontend UI (6 tasks)
```bash
# T353-T358: Implement task update UI
```

- [x] **T353** [FE] [US4] Add `isEditing` state to `TaskItem`
- [x] **T354** [FE] [US4] Show edit form when `isEditing = true`:
  - Inputs pre-filled with current title/description
  - Save and Cancel buttons
- [x] **T355** [FE] [US4] Implement save handler:
  - Call `api.updateTask()` with updated data
  - Update task in list on success
  - Set `isEditing = false`
- [x] **T356** [FE] [US4] Implement cancel handler: Reset form, set `isEditing = false`
- [x] **T357** [FE] [US4] Extend `frontend/lib/api.ts` with update method:
  ```typescript
  updateTask(userId: string, taskId: number, data: Partial<Task>): Promise<Task>
  ```
- [x] **T358** [FE] [US4] Add security validation - ensure user cannot update other users' tasks

**Validate**: User can edit their tasks and changes persist after page refresh

---

## Phase 7: User Story 5 - Delete Task via Web UI (Priority: P1) (7 tasks)

### Backend API (2 tasks)
```bash
# T359-T360: Implement task delete API
```

- [x] **T359** [BE] [US5] Implement `DELETE /api/users/{user_id}/tasks/{id}`:
  - JWT check, user_id verification
  - Verify token user_id matches URL user_id (403 if not)
  - Query: `WHERE id = {id} AND user_id = {user_id}`
  - Return 404 if not found
  - Delete task from database
  - Return 204 No Content
- [x] **T360** [BE] [US5] Add proper error handling for delete operations

### Frontend UI (5 tasks)
```bash
# T361-T365: Implement task delete UI
```

- [x] **T361** [FE] [US5] Add delete icon click handler to `TaskItem`
- [x] **T362** [FE] [US5] Show `confirm("Delete this task?")` dialog
- [x] **T363** [FE] [US5] Implement delete confirmation handler:
  - Call `api.deleteTask()` with task ID
  - Remove from list on success
- [x] **T364** [FE] [US5] Extend `frontend/lib/api.ts` with delete method:
  ```typescript
  deleteTask(userId: string, taskId: number): Promise<void>
  ```
- [x] **T365** [FE] [US5] Add security validation - ensure user cannot delete other users' tasks

**Validate**: User can delete their tasks and they disappear from the list

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P1) (7 tasks)

### Backend API (2 tasks)
```bash
# T366-T367: Implement task completion toggle API
```

- [x] **T366** [BE] [US6] Implement `PATCH /api/users/{user_id}/tasks/{id}/complete`:
  - JWT check, user_id verification
  - Verify token user_id matches URL user_id (403 if not)
  - Query: `WHERE id = {id} AND user_id = {user_id}`
  - Toggle: `completed = NOT completed`
  - Update `updated_at`
  - Return updated `Task`
- [x] **T367** [BE] [US6] Add proper error handling for completion toggle

### Frontend UI (5 tasks)
```bash
# T368-T372: Implement task completion toggle UI
```

- [x] **T368** [FE] [US6] Add checkbox component to `TaskItem`
- [x] **T369** [FE] [US6] Style checkbox: `[ ]` for incomplete, `[✓]` for complete
- [x] **T370** [FE] [US6] Implement checkbox click handler:
  - Call `api.toggleTask()` to toggle completion status
  - Update `completed` status in list
- [x] **T371** [FE] [US6] Extend `frontend/lib/api.ts` with toggle method:
  ```typescript
  toggleTask(userId: string, taskId: number): Promise<Task>
  ```
- [x] **T372** [FE] [US6] Add security validation - ensure user cannot toggle other users' tasks

**Validate**: User can mark tasks as complete/incomplete and status persists after page refresh

---

## Phase 9: Frontend Foundation & Polish (12 tasks)

### Frontend Setup (8 tasks)
```bash
# T373-T380: Complete frontend foundation
```

- [x] **T373** [FE] Initialize Next.js project in `frontend/`
- [x] **T374** [FE] Install dependencies:
  ```bash
  npm install better-auth lucide-react
  ```
- [x] **T375** [FE] Install dev dependencies:
  ```bash
  npm install -D @types/node
  ```
- [x] **T376** [FE] Create `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  BETTER_AUTH_SECRET=<same-as-backend>
  ```
- [x] **T377** [FE] Create `frontend/lib/api.ts` with complete API client:
  ```typescript
  export class ApiClient {
    private token: string | null = null

    setToken(token: string): void
    getTasks(userId: string, status?: string): Promise<Task[]>
    createTask(userId: string, title: string, desc?: string): Promise<Task>
    updateTask(userId: string, taskId: number, data: Partial<Task>): Promise<Task>
    deleteTask(userId: string, taskId: number): Promise<void>
    toggleTask(userId: string, taskId: number): Promise<Task>
    getUserInfo(): Promise<User>
    login(email: string, password: string): Promise<{user: User, token: string}>
    register(email: string, password: string, name: string): Promise<{user: User, token: string}>
    logout(): Promise<void>
  }
  ```
- [x] **T378** [FE] Create `frontend/CLAUDE.md` with Next.js patterns
- [x] **T379** [FE] Set up proper error handling and loading states in UI components
- [x] **T380** [FE] Implement responsive design with Tailwind CSS for mobile/desktop

### Frontend Integration (4 tasks)
```bash
# T381-T384: Complete frontend integration
```

- [x] **T381** [FE] Connect all API calls from UI components to backend endpoints
- [x] **T382** [FE] Implement proper error handling with user-friendly messages
- [x] **T383** [FE] Add loading states and optimistic UI updates where appropriate
- [x] **T384** [FE] Implement proper form validation on the client side

**Validate**: `npm run build` succeeds with 0 TypeScript errors

---

## Phase 10: Integration & Security Validation (8 tasks)

```bash
# T385-T392: Final validation and security checks
```

- [ ] **T385** [INT] E2E test flow:
  - Signup → Signin → Add task → View → Update → Delete → Toggle
- [ ] **T386** [INT] User isolation test:
  - Create 2 users, verify each sees only their tasks
- [ ] **T387** [INT] JWT validation test:
  - Attempt to access resources without token (should get 401)
  - Attempt to access other user's resources with valid token (should get 403)
- [ ] **T388** [BE] Run `uv run mypy --strict backend/src/` - fix all errors
- [ ] **T389** [BE] Run `uv run ruff check backend/src/` - fix all issues
- [ ] **T390** [FE] Run `npm run build` - fix all TypeScript errors
- [ ] **T391** [P] Update root `README.md` with deployment instructions
- [ ] **T392** [P] Conduct security review focusing on JWT validation and user isolation

**Final Validate**: Full stack works in production mode with proper security

---

## Dependencies

- **Phase 2** blocks all subsequent phases - Backend foundation must be complete
- **Phase 3** (Authentication) blocks **Phase 4-8** - Auth must work before task operations
- **Phase 9** (Frontend Foundation) can run in parallel with **Phases 4-8** after auth setup

---

## Execution Strategy

### Solo Developer (Sequential)
```
Phase 1 (6) → Phase 2 (11) → Phase 3 (13) →
Phase 4 (9) → Phase 5 (10) → Phase 6 (9) →
Phase 7 (7) → Phase 8 (7) → Phase 9 (12) → Phase 10 (8)

Total: 92 tasks, ~2-3 weeks
```

### Two Developers (Parallel)
```
Dev A: Phase 1 (together) → Phase 2-8 (60 tasks, backend complete)
Dev B: Phase 1 (together) → Phase 3,9 (25 tasks, frontend complete)
Both:  Phase 10 (8 tasks, integration)

Total: ~1-2 weeks
```

### MVP Path (37 tasks for working demo)
```
Phase 1 (6) → Phase 2 (11) →
T318-T322 (5 tasks: Auth API) →
T331-T334 (4 tasks: Create Task API) →
T340-T343 (4 tasks: List Task API) →
Phase 9 (7 tasks: Basic Frontend) →
T335-T339 (5 tasks: Add Task UI) →
T344-T349 (6 tasks: View Task UI)

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

**Total Tasks**: 92
**Critical Dependencies**: Phase 2 blocks Phase 3-10 | Phase 3 blocks Phase 4-8
**Parallel Work**: Backend (T307-T367) and Frontend (T323-T384) can work in parallel after Phase 2