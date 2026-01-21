# Tasks: Phase I - In-Memory Python Console Todo App

**Input**: Design documents from `/specs/1-console-todo/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/cli-commands.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5 for Add, View, Update, Delete, Toggle)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T101 Initialize UV project with `uv init` in todo/ directory
- [ ] T102 [P] Add Pydantic dependency with `uv add pydantic`
- [ ] T103 [P] Add dev dependencies with `uv add --dev mypy ruff pytest`
- [ ] T104 Create src/ directory structure with __init__.py files
- [ ] T105 [P] Setup .gitignore for Python/UV/WSL

**Validate**: `uv run python --version` shows Python 3.13+

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T106 Create Pydantic Task model in src/models.py with fields:
  - id: int (ge=1)
  - title: str (min_length=1, max_length=200)
  - description: str | None (max_length=500, default=None)
  - completed: bool (default=False)
  - created_at: datetime (default_factory=datetime.utcnow)
- [ ] T107 Add title validator to reject whitespace-only titles in src/models.py
- [ ] T108 Implement TodoManager class in src/todo.py with:
  - __init__ with tasks: List[Task] and next_id: int = 1
  - add_task(title: str, description: str | None) -> Task
  - list_tasks() -> List[Task]
  - get_task(id: int) -> Task | None
  - update_task(id: int, title: str | None, description: str | None) -> Task
  - delete_task(id: int) -> bool
  - toggle_task(id: int) -> Task | None

**Validate**: `uv run mypy --strict src/models.py src/todo.py` passes

---

## Phase 3: User Story 1 - Add Task (Priority: P1) MVP

**Goal**: Users can create new tasks with a title and optional description

**Independent Test**: Add a task, verify it appears in the list with correct ID, title, and description

**Acceptance Scenarios**:
1. Given app running, When user selects "Add", Then system prompts for task title
2. Given valid title entered, When user optionally enters description, Then system creates task and confirms "Task #1 added"
3. Given title without description, When user skips description prompt, Then system creates task with empty description

### Implementation for User Story 1

- [ ] T109 [US1] Implement main.py CLI loop with while True and menu display
- [ ] T110 [US1] Add input handling for option "1" (Add Task)
- [ ] T111 [US1] Implement title input prompt with validation (non-empty, 1-200 chars)
- [ ] T112 [US1] Implement description input prompt (optional, max 500 chars)
- [ ] T113 [US1] Connect add_task() from TodoManager to CLI input
- [ ] T114 [US1] Add output for "Task #<id> added" confirmation

**Checkpoint**: User Story 1 complete - can add tasks and see confirmation

---

## Phase 4: User Story 2 - View Tasks (Priority: P1)

**Goal**: Users can see all their tasks with their current status

**Independent Test**: View tasks and verify all added tasks appear with correct formatting

**Acceptance Scenarios**:
1. Given tasks exist, When user selects "View", Then system displays each task with ID, status indicator `[ ]` or `[✓]`, and text
2. Given no tasks exist, When user selects "View", Then system displays "No tasks found"

### Implementation for User Story 2

- [ ] T115 [US2] Add input handling for option "2" (View Tasks)
- [ ] T116 [US2] Implement task formatting function in src/main.py:
  - ID as `N.` (with period)
  - Status as `[ ]` for incomplete, `[✓]` for complete
  - Title on first line
  - Description on second line (indented) if present
- [ ] T117 [US2] Connect list_tasks() from TodoManager to CLI display
- [ ] T118 [US2] Handle empty list case with "No tasks found" message

**Checkpoint**: User Story 2 complete - can view tasks with correct formatting

---

## Phase 5: User Story 3 - Update Task (Priority: P1)

**Goal**: Users can modify existing task details by referencing the task ID

**Independent Test**: Update a task and verify the changes are reflected when viewing

**Acceptance Scenarios**:
1. Given a task exists, When user selects "Update" and provides task ID, Then system prompts to edit title (press Enter to keep current)
2. Given user provided new title or pressed Enter, When system prompts for description, Then user can edit description or press Enter to keep current
3. Given invalid ID provided, When user attempts to update, Then system displays error and returns to main menu

### Implementation for User Story 3

- [ ] T119 [US3] Add input handling for option "3" (Update Task)
- [ ] T120 [US3] Implement task ID input with validation (must exist)
- [ ] T121 [US3] Implement title update prompt with "press Enter to keep current" logic
- [ ] T122 [US3] Implement description update prompt with "press Enter to keep current" logic
- [ ] T123 [US3] Connect update_task() from TodoManager to CLI input
- [ ] T124 [US3] Add error handling for invalid IDs with "Error: Task #<id> not found"
- [ ] T125 [US3] Add output for "Task #<id> updated" confirmation

**Checkpoint**: User Story 3 complete - can update existing tasks

---

## Phase 6: User Story 4 - Delete Task (Priority: P1)

**Goal**: Users can remove tasks by ID with confirmation

**Independent Test**: Delete a task and verify it no longer appears in the list

**Acceptance Scenarios**:
1. Given a task exists, When user selects "Delete" and provides task ID, Then system asks "Are you sure? (y/n)"
2. Given user confirms with "y", When deletion is confirmed, Then system removes task and displays "Task #X deleted"
3. Given user declines with "n", When confirmation is declined, Then system cancels deletion and returns to main menu
4. Given invalid ID provided, When user attempts to delete, Then system displays error and returns to main menu

### Implementation for User Story 4

- [ ] T126 [US4] Add input handling for option "4" (Delete Task)
- [ ] T127 [US4] Implement task ID input with validation (must exist)
- [ ] T128 [US4] Implement confirmation prompt "Are you sure? (y/n): "
- [ ] T129 [US4] Handle 'y' confirmation: call delete_task() and show confirmation
- [ ] T130 [US4] Handle 'n' cancellation: return to main menu silently
- [ ] T131 [US4] Handle invalid confirmation: reprompt until valid 'y' or 'n'
- [ ] T132 [US4] Add error handling for invalid IDs

**Checkpoint**: User Story 4 complete - can delete tasks with confirmation

---

## Phase 7: User Story 5 - Toggle Task Status (Priority: P1)

**Goal**: Users can mark tasks as complete or incomplete

**Independent Test**: Toggle task status and verify the indicator changes between `[ ]` and `[✓]`

**Acceptance Scenarios**:
1. Given incomplete task exists, When user selects "Complete" and provides task ID, Then task status changes to complete with `[✓]` indicator
2. Given complete task exists, When user selects "Reopen" and provides task ID, Then task status changes to incomplete with `[ ]` indicator
3. Given invalid ID provided, When user attempts to toggle status, Then system displays error and returns to main menu

### Implementation for User Story 5

- [ ] T133 [US5] Add input handling for option "5" (Toggle Complete)
- [ ] T134 [US5] Implement task ID input with validation (must exist)
- [ ] T135 [US5] Connect toggle_task() from TodoManager to CLI input
- [ ] T136 [US5] Add output messages:
  - "Task #<id> marked as complete" (when toggling to complete)
  - "Task #<id> marked as incomplete" (when toggling to incomplete)
- [ ] T137 [US5] Add error handling for invalid IDs

**Checkpoint**: User Story 5 complete - can toggle task completion status

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T138 [P] Add input handling for option "6" (Exit) with "Goodbye!" message
- [ ] T139 [P] Add main menu loop return to menu after each operation
- [ ] T140 [P] Add "Invalid choice" reprompt for menu input
- [ ] T141 [P] Run `uv run mypy --strict` and fix any type errors
- [ ] T142 [P] Run `uv run ruff check` and fix any linting issues
- [ ] T143 [P] Create README.md with setup and usage instructions
- [ ] T144 [P] Update CLAUDE.md with project context

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - BLOCKS all user stories
- **Phase 3-7 (User Stories)**: All depend on Phase 2 completion
  - User stories can proceed in parallel (different developers)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Phase 8 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Add)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 2 (View)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 3 (Update)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 4 (Delete)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 5 (Toggle)**: Can start after Phase 2 - No dependencies on other stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to polish phase

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks can run in parallel (but T106 must complete before T107-T108)
- Once Foundational phase completes, all user stories can start in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: Phase 2 (Foundational)

```bash
Task: "Create Pydantic Task model in src/models.py"
Task: "Implement TodoManager class in src/todo.py" (depends on T106)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Add Task)
4. **STOP and VALIDATE**: Test Add Task operation
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Phase 1 + Phase 2 → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Polish phase → Final delivery

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once Foundational is done:
   - Developer A: User Story 1 (Add)
   - Developer B: User Story 2 (View)
   - Developer C: User Story 3 (Update)
   - Developer D: User Story 4 (Delete) and User Story 5 (Toggle)
3. Stories complete and integrate independently

---

## Quick Test Logic (from spec)

After each story phase:

- **US1**: Add task → Verify ID 1, correct title and description
- **US2**: View tasks → Verify "[ ]" status indicator, correct formatting
- **US3**: Update task → Verify changes reflected in view
- **US4**: Delete task → Verify list is empty or task removed
- **US5**: Toggle complete → Verify "[✓]" indicator appears

---

## Total Task Count

| Phase | Task Count | Parallelizable |
|-------|------------|----------------|
| Phase 1: Setup | 5 | 3 (T102, T103, T105) |
| Phase 2: Foundational | 3 | 1 (T107-T108 depend on T106) |
| Phase 3: US1 (Add) | 6 | 0 (sequential) |
| Phase 4: US2 (View) | 4 | 0 (sequential) |
| Phase 5: US3 (Update) | 7 | 0 (sequential) |
| Phase 6: US4 (Delete) | 7 | 0 (sequential) |
| Phase 7: US5 (Toggle) | 5 | 0 (sequential) |
| Phase 8: Polish | 7 | 3 (T138, T139, T140 can parallelize) |
| **Total** | **44** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `uv run mypy --strict` after Phase 2 and Phase 8
- Run `uv run ruff check` after Phase 8
