---
id: "002"
title: "Phase I Console Todo Specification"
stage: "spec"
date: "2025-12-29"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "console-todo"
branch: "1-console-todo"
user: "user"
command: "/sp.specify"
labels: ["specification","phase-i","console-todo","cli"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/1-console-todo/spec.md"
  - "specs/1-console-todo/checklists/requirements.md"
tests:
  - "none"
---

## Prompt

# Phase I Specification: In-Memory Python Console Todo

## 🎯 Intent
Build a foundation-level Python CLI Todo application using **Spec-Driven Development (SDD)**. This phase focuses on core business logic and clean architecture using in-memory User Scenarios
- **Scenario 1 (Add)**: User selects "Add" -> System confirms `✅ Task #1 added`.
- **Scenario 2 (View)**: System displays ID, status, and text for all items.
- **Scenario 3 (Update)**: User selects ID -> Edits fields or presses `Enter` to keep current.
- **Scenario 4 (Delete)**: User selects ID -> `Are you sure?` -> `🗑️ Task #2 deleted`.
- **Scenario 5 (Empty State)**: Display "No tasks found" instead of an empty screen.

## ✅ Success Criteria (100 Points)

### 1. Functional Requirements (30 pts)
- **Add Task**: Support unique IDs, titles, and optional descriptions.
- **View Tasks**: Display list with completion indicators `[ ]` or `[✓]`.
- **Update Task**: Modify title or description by referencing ID.
- **Delete Task**: Remove task by ID with a "y/n" confirmation prompt.
- **Toggle Status**: Ability to mark tasks as complete or incomplete.

### 2. Technical Standards (50 pts)
- **Tech Stack**: Python 3.13+, **UV** package manager, **Pydantic** for models.
- **Code Structure**: Modular design (`main.py`, `todo.py`, `models.py`).
- **SDD Compliance**: Every function must reference a Task ID (e.g., `# Task T-101`).
- **Robustness**: 100% Type Hinting coverage; graceful handling of "ID not found" errors.

### 3. Deliverables (20 pts)
- **Docs**: `README.md` (Setup), `CLAUDE.md` (Agent instructions).
- **Video**: A 90-second demo showcasing the full CRUD cycle Testing Requirements
- **Manual Audit**: Perform a full Add -> View -> Update -> Complete -> Delete cycle.
- **ID Integrity**: Ensure deleted IDs are not immediately reused in the same session.
- **Type Check**: Pass `mypy --strict` validation.

## 📁 Project Structure
```text
hackathon-todo/
├── specs/
│   ├── 1spec.md
│   ├── 2plan.md
│   └── 3tasks.md
└── src/
    ├── main.py
    ├── models.py
    └── todo.py
```

## Response snapshot

Created comprehensive specification for Phase I In-Memory Python Console Todo application:

**User Stories (5)**:
- Add Task (P1) - Create tasks with unique IDs, titles, optional descriptions
- View Tasks (P1) - Display tasks with status indicators `[ ]`/`[✓]` or "No tasks found"
- Update Task (P1) - Modify tasks by ID with Enter-to-keep-current pattern
- Delete Task (P1) - Remove tasks with y/n confirmation
- Toggle Status (P1) - Mark complete/incomplete by ID

**Functional Requirements (8)**:
- CRUD operations with validation
- Error handling for invalid operations
- Unique ID assignment (non-reusable within session)

**Key Entities**:
- Task: id (int), title (str), description (str|None), completed (bool)

**Success Criteria (6)**:
- CRUD cycle completable in <5 minutes
- 100% operation success rate
- 100% error handling coverage
- 0 ID conflicts
- mypy --strict passing
- Setup in <10 minutes

**Quality Validation**: All checklist items pass, no [NEEDS CLARIFICATION] markers needed.

## Outcome

- ✅ Impact: Complete specification ready for planning phase
- 🧪 Tests: N/A - specification document
- 📁 Files: specs/1-console-todo/spec.md, specs/1-console-todo/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Used reasonable defaults for technical choices (Python 3.13, UV, Pydantic, in-memory storage) per Constitution Principle V

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Add task filtering or sorting as a P2 feature
