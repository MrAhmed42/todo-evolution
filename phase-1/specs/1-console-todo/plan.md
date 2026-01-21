# Implementation Plan: Phase I - In-Memory Python Console Todo

**Branch**: `1-console-todo` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-console-todo/spec.md`

## Summary

Build a foundation-level Python CLI Todo application using Spec-Driven Development (SDD). The application provides a text-based console interface for managing tasks with CRUD operations (Create, Read, Update, Delete) and status toggling. All data is stored in-memory for the session duration, using Pydantic models for validation and UV for package management.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Pydantic (validation), UV (package management)
**Storage**: In-memory `List[Task]` (stateless between runs, no persistence)
**Testing**: pytest (Phase II+ requires 80% coverage)
**Target Platform**: Console/CLI (text-based input/output)
**Project Type**: Single CLI application
**Performance Goals**: Sub-second response times for all operations (< 500ms p95)
**Constraints**: In-memory only (no database), no cross-session persistence, ID sequence non-reusable within session
**Scale/Scope**: Single user, session-based, ~100 tasks maximum per session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status | Notes |
|------|-------------|--------|-------|
| SDD Compliance | All code must reference Task IDs | ✅ Required | Tasks.md will define T-101, T-102, etc. |
| Spec-Driven | Specifications in `/specs` folder | ✅ Compliant | spec.md, plan.md, tasks.md all present |
| Type Hints | Full type annotations using Python 3.13+ syntax | ✅ Required | All functions must have type hints |
| Package Manager | UV for dependency management | ✅ Compliant | No pip/conda |
| Validation Library | Pydantic for data models | ✅ Compliant | FR-001 requires validation |
| Data Isolation | User isolation at DB level | N/A | Phase I is single-user, in-memory |

**Constitution Violations**: None detected. Phase I is foundational and exempt from database requirements (III. Stateless Cloud-Native Design).

## Project Structure

### Documentation (this feature)

```text
specs/1-console-todo/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (N/A - no clarifications needed)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── cli-commands.md  # CLI command contracts
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
todo/
├── src/
│   ├── __init__.py
│   ├── models.py        # Pydantic Task model
│   ├── todo.py          # TodoManager class (CRUD operations)
│   └── main.py          # CLI input/output loop
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py   # Task model tests
│   ├── test_todo.py     # TodoManager tests
│   └── test_cli.py      # CLI integration tests
├── pyproject.toml       # UV project config
└── README.md
```

**Structure Decision**: Single project with `src/` layout for clean separation of concerns. Models, business logic, and CLI are in separate modules under `src/`. Tests mirror the source structure for clarity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Technical Design

### Architecture Overview

```
┌─────────────────────────────────┐
│           main.py               │  ← CLI loop (while True)
│    ┌───────────────────┐        │
│    │  TodoApp (Menu)   │        │  ← Routes user input
│    └─────────┬─────────┘        │
│              │                  │
│    ┌─────────▼─────────┐        │
│    │   TodoManager     │        │  ← CRUD operations
│    └─────────┬─────────┘        │
│              │                  │
│    ┌─────────▼─────────┐        │
│   Task (Pydantic Model) │        │  ← Data validation
│    └───────────────────┘        │
└─────────────────────────────────┘
```

### Key Components

1. **Task Model** (`models.py`): Pydantic model with `id`, `title`, `description`, `completed`, `created_at`
2. **TodoManager** (`todo.py`): In-memory CRUD operations on `List[Task]`
3. **CLI Loop** (`main.py`): Text-based menu system with input handling

### Data Flow

```
User Input → Validation → TodoManager → Task Model → Display
              │              │              │
           Pydantic       In-memory      Serialized
           validation     storage        for display
```

### Error Handling Strategy

| Operation | Invalid Input | Error Response |
|-----------|---------------|----------------|
| Add | Empty title | Prompt until valid title entered |
| View | N/A | "No tasks found" if empty |
| Update | Invalid ID | Error message + return to menu |
| Delete | Invalid ID | Error message + return to menu |
| Toggle | Invalid ID | Error message + return to menu |

### ID Generation Strategy

- Sequential integers starting at 1
- Never reuse deleted IDs within a session
- Stored as `next_id: int` in TodoManager

## Phase 1 Deliverables

- [x] `plan.md` - This file (completed)
- [ ] `data-model.md` - Entity definitions and validation rules
- [ ] `quickstart.md` - Setup and run instructions
- [ ] `contracts/cli-commands.md` - CLI command contracts
- [ ] Agent context update

## Next Steps

1. Review and approve this plan
2. Run `/sp.tasks` to generate testable tasks
3. Implement code following Task IDs
4. Run QA: `mypy --strict` and `ruff`
