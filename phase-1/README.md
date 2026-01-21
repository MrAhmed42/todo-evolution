# Todo CLI Application

A simple command-line todo list application built with Python and Pydantic.

## Features

- Add tasks with title and optional description
- View all tasks with completion status
- Update task title and description
- Delete tasks with confirmation
- Toggle task completion status

## Requirements

- Python 3.13+
- UV (package manager)

## Setup

```bash
# Install dependencies
uv sync

# Or install manually
uv pip install -e .
```

## Usage

Run the application:

```bash
uv run python -m src.main
```

Or:

```bash
uv run python src/main.py
```

### Menu Options

1. **Add Task** - Create a new task with title and optional description
2. **View Tasks** - Display all tasks with their status (`[ ]` incomplete, `[✓]` complete)
3. **Update Task** - Modify an existing task's title and/or description
4. **Delete Task** - Remove a task (with confirmation)
5. **Toggle Complete** - Mark a task as complete or incomplete
6. **Exit** - Close the application

## Project Structure

```
todo/
├── src/
│   ├── __init__.py
│   ├── models.py      # Pydantic Task model
│   ├── todo.py        # TodoManager class
│   └── main.py        # CLI interface
├── pyproject.toml
└── README.md
```

## Development

```bash
# Run type checking
uv run mypy --strict

# Run linter
uv run ruff check

# Run tests
uv run pytest
```
