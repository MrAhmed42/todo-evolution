# Feature Specification: Phase II - Full-Stack Web Todo Application

**Feature Branch**: `001-web-todo`
**Created**: 2026-01-12
**Status**: Draft
**Input**: Transform Phase I console app into a multi-user web application with persistent storage and authentication

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Signup/Signin (Priority: P0)

Users can create accounts and authenticate to access their personal todo list.

**Why this priority**: Authentication is the foundation for multi-user support and data isolation.

**Independent Test**: Can be fully tested by creating an account, signing in, and verifying JWT token is issued.

**Acceptance Scenarios**:

1. **Given** the user visits the signup page, **When** they enter email, password, and name, **Then** the system creates their account and redirects to signin
2. **Given** the user has an account, **When** they enter valid credentials on signin page, **Then** the system issues JWT token and redirects to dashboard
3. **Given** the user enters invalid credentials, **When** they attempt to signin, **Then** the system displays error message without redirecting

---

### User Story 2 - Add Task via Web UI (Priority: P1)

Authenticated users can create tasks through a web form.

**Why this priority**: Adding tasks is the core functionality users need to begin managing their work.

**Independent Test**: Can be fully tested by submitting the add task form and verifying the task appears in the list with correct data.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard, **When** they enter a title and click "Add Task", **Then** the system creates the task via API and displays "✅ Task added"
2. **Given** the user entered title and description, **When** they submit the form, **Then** both fields are saved and visible in the task list
3. **Given** the user submits empty title, **When** form validation runs, **Then** the system prevents submission and shows error message

---

### User Story 3 - View Personal Tasks (Priority: P1)

Users can see only their own tasks in a responsive web interface.

**Why this priority**: Viewing tasks allows users to understand their workload; user isolation ensures privacy.

**Independent Test**: Can be fully tested by creating tasks with different users and verifying each user sees only their own data.

**Acceptance Scenarios**:

1. **Given** the user has tasks, **When** they view the dashboard, **Then** the system displays all their tasks with status indicators, title, and description
2. **Given** the user has no tasks, **When** they view the dashboard, **Then** the system displays "No tasks yet. Add one to get started!"
3. **Given** another user has tasks, **When** the current user views their dashboard, **Then** the system shows only the current user's tasks (user isolation enforced)

---

### User Story 4 - Update Task via Web UI (Priority: P1)

Users can edit their task details through the web interface.

**Why this priority**: Updating tasks allows users to refine and maintain accurate task information.

**Independent Test**: Can be fully tested by editing a task and verifying changes persist after page reload.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user clicks edit icon and modifies title, **Then** the system updates via API and reflects changes immediately
2. **Given** the user is editing a task, **When** they cancel the edit, **Then** the system discards changes and shows original values
3. **Given** the task belongs to another user, **When** the current user attempts to edit via API, **Then** the system returns 403 Forbidden

---

### User Story 5 - Delete Task via Web UI (Priority: P1)

Users can remove tasks from their list with confirmation.

**Why this priority**: Deleting tasks helps users maintain a clean, relevant task list.

**Independent Test**: Can be fully tested by deleting a task and verifying it no longer appears after page refresh.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user clicks delete icon, **Then** the system shows confirmation dialog
2. **Given** the user confirms deletion, **When** confirmation is accepted, **Then** the system deletes via API and removes from UI
3. **Given** the task belongs to another user, **When** the current user attempts to delete via API, **Then** the system returns 403 Forbidden

---

### User Story 6 - Toggle Task Completion (Priority: P1)

Users can mark tasks complete or incomplete via checkbox.

**Why this priority**: Status toggling allows users to track progress visually.

**Independent Test**: Can be fully tested by clicking checkbox and verifying status persists after page reload.

**Acceptance Scenarios**:

1. **Given** an incomplete task exists, **When** the user clicks the checkbox, **Then** the system marks complete via API and shows [✓] indicator
2. **Given** a complete task exists, **When** the user clicks the checkbox again, **Then** the system marks incomplete and shows [ ] indicator
3. **Given** the task belongs to another user, **When** the current user attempts to toggle via API, **Then** the system returns 403 Forbidden

---

### Edge Cases

- What happens when users attempt duplicate emails during signup (unique constraint)?
- What happens when user modifies another user's task via direct API call?
  - Backend verifies JWT user_id matches URL user_id; returns 403 if mismatch
- What happens when database connection fails?
  - System returns 500 error with user-friendly message; operation is not lost on retry

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users via Better Auth with JWT token issuance
- **FR-002**: System MUST enforce user isolation - users only see/modify their own tasks
- **FR-003**: System MUST validate JWT token on every API request; return 401 if invalid/missing
- **FR-004**: System MUST persist all tasks to Neon PostgreSQL database
- **FR-005**: System MUST implement 6 RESTful API endpoints: GET, POST, GET/:id, PUT/:id, DELETE/:id, PATCH/:id/complete
- **FR-006**: System MUST filter all database queries by authenticated user's ID
- **FR-007**: System MUST provide responsive web UI (mobile and desktop)
- **FR-008**: System MUST validate JWT user_id matches URL user_id parameter on all operations

### Key Entities

- **User**: Represents an authenticated user (managed by Better Auth)
  - `id`: Unique string identifier (UUID)
  - `email`: Unique email address
  - `name`: Display name
  - `created_at`: Timestamp

- **Task**: Represents a todo item with user ownership
  - `id`: Unique positive integer (auto-increment)
  - `user_id`: Foreign key to User (enforces ownership)
  - `title`: Required string (1-200 characters)
  - `description`: Optional string (0-1000 characters)
  - `completed`: Boolean flag
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can signup, signin, and access dashboard in under 2 minutes
- **SC-002**: All CRUD operations work via web UI with 100% success rate for valid inputs
- **SC-003**: User isolation enforced - 0% cross-user data leakage in security audit
- **SC-004**: API response times: GET < 200ms, POST/PUT/PATCH/DELETE < 500ms (95th percentile)
- **SC-005**: JWT authentication works - 100% of unauthenticated requests return 401
- **SC-006**: Frontend builds without errors; passes TypeScript type checking
- **SC-007**: Backend passes `mypy --strict` type checking with 100% coverage
- **SC-008**: Application deployed to Vercel (frontend) with working production URL

## Assumptions

- **Storage**: Neon Serverless PostgreSQL for persistent data
- **Authentication**: Better Auth configured with JWT plugin
- **Secret Sharing**: Same `BETTER_AUTH_SECRET` used by frontend and backend
- **Token Expiry**: JWT tokens expire after 7 days
- **Monorepo**: Frontend and backend in same repository for Claude Code navigation
- **Deployment**: Frontend on Vercel, backend on separate service (or same via API routes)
- **Database Migrations**: SQLModel creates tables automatically on first run
- **Error Handling**: All API errors return JSON with `detail` field

## Out of Scope

- Task filtering by status (all/pending/completed)
- Task categorization or tagging
- Task due dates and reminders
- Task sharing between users
- Email notifications
- Mobile app (native)
- Advanced reporting or analytics
- Import/export functionality