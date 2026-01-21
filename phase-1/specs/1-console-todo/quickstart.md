# Quickstart: Phase I - In-Memory Python Console Todo

**Feature Branch**: `1-console-todo`
**Date**: 2025-12-29
**Related Plan**: [plan.md](./plan.md)

## Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Python | 3.13+ | Yes |
| UV | Latest | Yes (no pip/conda) |

## Setup

### 1. Verify Python Version

```bash
python --version
# Expected: Python 3.13.x
```

### 2. Verify UV Installation

```bash
uv --version
# Expected: uv x.x.x or higher
```

If UV is not installed, install it:

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. Initialize the Project

```bash
# Navigate to project root
cd todo

# Create virtual environment and install dependencies
uv venv
uv sync

# Activate virtual environment
# Linux/macOS:
source .venv/bin/activate

# Windows:
.venv\Scripts\activate
```

## Running the Application

### Development Mode

```bash
uv run python -m src.main
```

### With Arguments (Optional)

```bash
# Run with verbose logging
uv run python -m src.main --verbose

# Interactive mode (default)
uv run python -m src.main --interactive
```

## Usage Guide

### Main Menu

```
=== TODO LIST ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit

Enter choice (1-6):
```

### Operation Guide

#### Add Task (Option 1)

```
Enter choice: 1
Enter task title: Buy groceries
Enter description (optional): Milk, bread, eggs
Task #1 added
```

#### View Tasks (Option 2)

```
Enter choice: 2
=== TASKS ===
1. [ ] Buy groceries
   Milk, bread, eggs

2. [✓] Call mom
   Birthday wishes

No tasks found  (if empty)
```

#### Update Task (Option 3)

```
Enter choice: 3
Enter task ID: 1
Enter new title (or press Enter to keep 'Buy groceries'):
Enter new description (or press Enter to keep 'Milk, bread, eggs'):
Task #1 updated
```

#### Delete Task (Option 4)

```
Enter choice: 4
Enter task ID: 1
Are you sure? (y/n): y
Task #1 deleted
```

#### Toggle Complete (Option 5)

```
Enter choice: 5
Enter task ID: 1
Task #1 marked as complete
```

## Testing

### Run All Tests

```bash
uv run pytest
```

### Run with Coverage

```bash
uv run pytest --cov=src --cov-report=term-missing
```

### Run Specific Test Categories

```bash
# Unit tests only
uv run pytest tests/unit/

# Integration tests only
uv run pytest tests/integration/

# Contract tests only
uv run pytest tests/contract/
```

## Linting & Type Checking

### Type Checking (Strict)

```bash
uv run mypy --strict src/
```

### Linting

```bash
uv run ruff check src/
```

### Format Code

```bash
uv run ruff format src/
```

### All Checks (CI Pipeline)

```bash
uv run mypy --strict src/ && uv run ruff check src/ && uv run pytest
```

## Project Structure

```
todo/
├── src/
│   ├── __init__.py
│   ├── models.py        # Task Pydantic model
│   ├── todo.py          # TodoManager CRUD operations
│   └── main.py          # CLI loop and menu
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py   # Model validation tests
│   ├── test_todo.py     # Manager operation tests
│   └── test_cli.py      # CLI integration tests
├── pyproject.toml       # UV project config
└── README.md
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `python: command not found` | Use `python3` or verify Python 3.13+ installation |
| `uv: command not found` | Reinstall UV from https://docs.astral.sh/uv/ |
| Import errors | Run `uv sync` to install dependencies |
| Type errors | Run `mypy --strict` to identify issues |
| Tests failing | Check `pytest` output for specific failures |

## Next Steps

After setup, proceed to implementation:

1. Run `/sp.tasks` to generate implementation tasks
2. Implement code following Task IDs (T-101, T-102, etc.)
3. Verify with: `mypy --strict && ruff check && pytest`

## Success Criteria

Setup is complete when:
- [ ] `uv run python -m src.main` starts the CLI
- [ ] `uv run pytest` passes all tests
- [ ] `uv run mypy --strict` reports no errors
- [ ] `uv run ruff check` reports no issues
