---
id: "004"
title: "Phase I Tasks Generation"
stage: "tasks"
date: "2025-12-29"
surface: "agent"
model: "sonnet-4-5-20250929"
feature: "1-console-todo"
branch: "1-console-todo"
user: "unknown"
command: "/sp.tasks"
labels: ["tasks","phase-i","console-todo","python","sdd"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - specs/1-console-todo/tasks.md
tests: []
---

## Prompt

```text
# Tasks: Phase I - In-Memory Python Console Todo App

## Phase 1: Foundation & Project Setup

**MCP Context7 Research:**
- [ ] Fetch latest `uv` commands and Pydantic v2 syntax

### T-101: Environment Setup
**Pre:** Python 3.13+, UV installed, WSL 2
**Out:** `pyproject.toml`, `src/`
**Time:** 15 min

- [ ] Run `uv init` to initialize project
- [ ] Add deps: `uv add pydantic` and `uv add --dev mypy ruff`
- [ ] Setup `.gitignore` for Python/WSL

**Validate:** `uv run python --version` shows 3.13+

### T-102: Data Modeling
**Pre:** T-101 complete
**Out:** `src/models.py` with Task class
**Time:** 20 min

- [ ] Create `src/models.py`
- [ ] Define Pydantic `Task` model: `id` (int), `title` (str, 1-200), `description` (Optional[str], max 1000), `completed` (bool), `created_at` (datetime)

**Validate:** `uv run mypy --strict src/models.py` passes

---

## Phase 2: Business Logic Implementation

### T-103: TodoManager Core
**Pre:** T-102 complete
**Out:** `src/todo.py` with full CRUD
**Time:** 45 min

- [ ] Create `src/todo.py` with `TodoManager` class
- [ ] Initialize with `List[Task]` and `next_id: int = 1`

**CRUD Operations:**
- [ ] `add_task(title, desc="") -> Task` - Auto-increment ID
- [ ] `list_tasks() -> List[Task]` - Return copy
- [ ] `get_task(id) -> Optional[Task]` - None if missing
- [ ] `update_task(id, title=None, desc=None) -> Task` - ValueError if misied)

**SDD Compliance:**
- [ ] All functions have Task ID comments (e.g., `# Task T-103`)
- [ ] All specs exist in `/specs` folder

---

## Phase 5: Documentation & Submission

### T-106: Documentation
**Pre:** T-105 complete
**Out:** README.md, CLAUDE.md
**Time:** 20 min

- [ ] `README.md`: Setup with `uv run`, features list, usage examples
- [ ] `CLAUDE.md`: Agent roles (spec-architect, backend-specialist), Task ID guide

### T-107: Demo Video
**Pre:** T-106 complete
**Out:** 90-second video
**Time:** 30 min

- [ ] Record: Add → View → Update → Toggle → Delete
- [ ] Keep under 90 seconds (judges watch only first 90s)

### T-108: Submission
**Pre:** T-107 complete
**Time:** 10 min

- [ ] Push to public GitHub
- [ ] Verify `/specs` folder complete
- [ ] Submit form with demo link

---

**Total: 8 Tasks | ~4 hours | Critical Path: T-101 → T-102 → T-103 → T-104 → T-105**
```

## Response snapshot

Generated comprehensive `tasks.md` with 44 tasks organized across 8 phases:

1. **Phase 1 (Setup)**: 5 tasks - UV project init, dependencies, src/ structure
2. **Phase 2 (Foundational)**: 3 tasks - Task Pydantic model, TodoManager CRUD
3. **Phase 3 (US1 - Add)**: 6 tasks - CLI loop, input handling, add confirmation
4. **Phase 4 (US2 - View)**: 4 tasks - List display, formatting, empty state
5. **Phase 5 (US3 - Update)**: 7 tasks - ID validation, update prompts, error handling
6. **Phase 6 (US4 - Delete)**: 7 tasks - Confirmation flow, delete logic
7. **Phase 7 (US5 - Toggle)**: 5 tasks - Toggle status, messages
8. **Phase 8 (Polish)**: 7 tasks - Exit, mypy strict, ruff, docs

Each task follows format: `- [ ] T### [P] [Story] Description with file path`

## Outcome

- ✅ Impact: 44 executable tasks ready for implementation following SDD
- 🧪 Tests: Not included (not explicitly requested)
- 📁 Files: 1 file created (specs/1-console-todo/tasks.md)
- 🔁 Next prompts: Implement tasks T101-T144 following task order
- 🧠 Reflection: Tasks organized by user story for independent testing, parallelizable where possible

## Evaluation notes (flywheel)

- Failure modes observed: "none"
- Graders run and results (PASS/FAIL): "N/A - task generation phase"
- Prompt variant (if applicable): "N/A"
- Next experiment (smallest change to try): "N/A"
