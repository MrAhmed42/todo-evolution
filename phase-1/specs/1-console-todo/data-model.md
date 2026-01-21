# Data Model: Phase I - In-Memory Python Console Todo

**Feature Branch**: `1-console-todo`
**Date**: 2025-12-29
**Related Plan**: [plan.md](./plan.md)

## Entity: Task

Represents a todo item with all required attributes for the CLI application.

### Field Definitions

| Field | Type | Constraints | Validation | Source |
|-------|------|-------------|------------|--------|
| `id` | `int` | Positive integer, unique within session | Auto-generated, sequential | FR-001, FR-008 |
| `title` | `str` | 1-200 characters, non-empty | Required, stripped whitespace | FR-001, FR-003 |
| `description` | `str \| None` | 0-500 characters | Optional, defaults to `None` | FR-001, FR-003 |
| `completed` | `bool` | Boolean flag | Defaults to `False` | FR-005, FR-002 |
| `created_at` | `datetime` | UTC timestamp | Auto-generated on creation | Tracking |

### Pydantic Model Definition

```python
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class Task(BaseModel):
    """Represents a todo item in the CLI application."""

    id: int = Field(..., ge=1, description="Unique positive integer identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: str | None = Field(default=None, max_length=500, description="Optional task description")
    completed: bool = Field(default=False, description="Task completion status")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        """Reject whitespace-only titles after stripping."""
        if not v.strip():
            raise ValueError("title cannot be empty or whitespace only")
        return v.strip()
```

### Validation Rules

#### Title Validation
- **Minimum Length**: 1 character after stripping whitespace
- **Maximum Length**: 200 characters
- **Whitespace Handling**: Stripped before validation
- **Error Case**: `ValueError` raised for empty/whitespace-only titles

#### Description Validation
- **Optional**: Can be `None`
- **Maximum Length**: 500 characters when provided
- **Empty String**: Allowed (distinct from `None`)

#### ID Constraints
- **Type**: Positive integer (`>= 1`)
- **Generation**: Sequential (1, 2, 3, ...)
- **Reuse**: Never reused within a session
- **Scope**: Unique only within current session

### State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    Task State Machine                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [CREATED] ──────────────────────────────────────────────►  │
│      │                                                      │
│      │                                                      │
│      ▼                                                      │
│  [INCOMPLETE] ◄───────────────────────► [COMPLETE]           │
│      │         Toggle Complete          │                    │
│      │                                  │                    │
│      │                                  ▼                    │
│      │                                 [DELETED]             │
│      │                                                     │
│      └──────────────────────────────────────────────────►   │
│           Update (title/description only)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| From State | To State | Trigger | Side Effects |
|------------|----------|---------|--------------|
| Created | Incomplete | Initial state | `completed=False` |
| Incomplete | Complete | Toggle | `completed=True` |
| Complete | Incomplete | Toggle | `completed=False` |
| Any | Deleted | Delete | Removed from list |
| Incomplete/Complete | Updated | Update | Fields modified |

### Data Flow: Create Operation

```
User Input (title, optional description)
         │
         ▼
    ┌─────────┐
    │ Validate│ ──► Invalid title? ──► Prompt again
    └────┬────┘
         │
         ▼
    ┌─────────────────┐
    │ Generate ID     │ ──► next_id = 1, 2, 3...
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Create Task     │ ──► Task(id, title, description, False, now())
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Add to List     │ ──► tasks.append(task)
    └────────┬────────┘
             │
             ▼
    Output: "Task #X added"
```

### Data Flow: Toggle Operation

```
User Input (task_id)
         │
         ▼
    ┌───────────────┐
    │ Find Task     │ ──► Not found? ──► Error message
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Toggle Status │ ──► task.completed = not task.completed
    └───────┬───────┘
            │
            ▼
    Output: "[✓]" or "[ ]" indicator
```

### Relationships

```text
Task (1) ──► (N) None
    │
    └── Self-contained entity
         No foreign keys
         No relationships
```

### Serialization

For CLI display, tasks are serialized to strings:

| Field | Display Format |
|-------|----------------|
| `id` | `#N` (e.g., `#1`) |
| `completed` | `[✓]` if True, `[ ]` if False |
| `title` | As-is |
| `description` | Shown on second line if present |
| `created_at` | Not displayed (internal use) |

### Example Output

```
1. [ ] Buy groceries
   Milk, bread, eggs

2. [✓] Call mom
   Birthday wishes
```

### Type Safety Requirements

Per Constitution (Section V - Modern Python Standards):
- All fields must have type annotations
- All methods must return type annotations
- `mypy --strict` compliance required
- No `Any` types unless absolutely necessary

### Testing Requirements

| Scenario | Expected Result |
|----------|-----------------|
| Create task with valid title | Task created with ID |
| Create task with empty title | `ValueError` raised |
| Create task with 200-char title | Task created |
| Create task with 201-char title | `ValueError` raised |
| Toggle incomplete task | `completed=True` |
| Toggle complete task | `completed=False` |
| Delete task | Removed from list |
