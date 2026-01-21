# CLI Contracts: Phase I - In-Memory Python Console Todo

**Feature Branch**: `1-console-todo`
**Date**: 2025-12-29
**Related Plan**: [plan.md](./plan.md)

This document defines the contract for all CLI commands and user interactions.

## Command Overview

| Command | Option | Input | Output | Error Handling |
|---------|--------|-------|--------|----------------|
| Add | 1 | title, optional description | Confirmation | Invalid title → reprompt |
| View | 2 | None | Task list or "No tasks found" | None |
| Update | 3 | task_id, new title, new description | Confirmation | Invalid ID → error + menu |
| Delete | 4 | task_id, confirmation (y/n) | Confirmation | Invalid ID → error + menu |
| Toggle | 5 | task_id | Confirmation | Invalid ID → error + menu |
| Exit | 6 | None | Goodbye message | None |

## Add Task Contract

### Input Contract

```
Operation: Add Task
Trigger: User selects option 1 from main menu

Input Sequence:
1. System prompts: "Enter task title: "
2. User enters: <title_string>
3. System prompts: "Enter description (optional): "
4. User enters: <description_string> or presses Enter
```

### Validation Rules

| Field | Rule | Error Action |
|-------|------|--------------|
| title | 1-200 chars, non-empty after strip | Reprompt with "Title cannot be empty" |
| description | 0-500 chars, optional | Accept empty or skip |

### Output Contract

```
Success: "Task #<id> added"

Examples:
- Task #1 added
- Task #2 added
```

### State Changes

```
Before: tasks = []
After:  tasks = [Task(id=1, title="Buy groceries", ...)]
```

---

## View Tasks Contract

### Input Contract

```
Operation: View Tasks
Trigger: User selects option 2 from main menu
Input: None required
```

### Output Contract

```
Empty State: "No tasks found"

Non-Empty State:
=== TASKS ===
1. [ ] <title>
   <description>

2. [✓] <title>
   <description>
```

### Display Format

| Field | Format |
|-------|--------|
| ID | `N.` (with period) |
| Status | `[ ]` incomplete, `[✓]` complete |
| Title | As entered |
| Description | On second line, indented, only if present |

### State Changes

```
Before: No change
After:  No change (read-only operation)
```

---

## Update Task Contract

### Input Contract

```
Operation: Update Task
Trigger: User selects option 3 from main menu

Input Sequence:
1. System prompts: "Enter task ID: "
2. User enters: <task_id>
3. System prompts: "Enter new title (or press Enter to keep '<current>'): "
4. User enters: <new_title> or presses Enter
5. System prompts: "Enter new description (or press Enter to keep '<current>'): "
6. User enters: <new_description> or presses Enter
```

### Validation Rules

| Field | Rule | Error Action |
|-------|------|--------------|
| task_id | Must exist in tasks list | Error + return to menu |
| title | 1-200 chars, optional | Accept empty = keep current |
| description | 0-500 chars, optional | Accept empty = keep current |

### Output Contract

```
Success: "Task #<id> updated"
Error (invalid ID): "Error: Task #<id> not found"
```

### State Changes

```
Before: Task(title="Buy groceries", description="Milk")
After:  Task(title="Buy food", description="Milk, bread")
```

---

## Delete Task Contract

### Input Contract

```
Operation: Delete Task
Trigger: User selects option 4 from main menu

Input Sequence:
1. System prompts: "Enter task ID: "
2. User enters: <task_id>
3. System prompts: "Are you sure? (y/n): "
4. User enters: <y/n>
```

### Validation Rules

| Field | Rule | Error Action |
|-------|------|--------------|
| task_id | Must exist in tasks list | Error + return to menu |
| confirmation | Must be 'y' or 'n' | Reprompt |

### Output Contract

```
Success: "Task #<id> deleted"
Cancelled: (no output, returns to menu)
Error (invalid ID): "Error: Task #<id> not found"
```

### State Changes

```
Before: tasks = [Task(id=1, ...), Task(id=2, ...)]
After:  tasks = [Task(id=2, ...)]  (id=1 removed)
```

---

## Toggle Complete Contract

### Input Contract

```
Operation: Toggle Complete
Trigger: User selects option 5 from main menu

Input Sequence:
1. System prompts: "Enter task ID: "
2. User enters: <task_id>
```

### Validation Rules

| Field | Rule | Error Action |
|-------|------|--------------|
| task_id | Must exist in tasks list | Error + return to menu |

### Output Contract

```
Success (now complete): "Task #<id> marked as complete"
Success (now incomplete): "Task #<id> marked as incomplete"
Error (invalid ID): "Error: Task #<id> not found"
```

### State Changes

```
Before: Task(completed=False)
After:  Task(completed=True)

Or:
Before: Task(completed=True)
After:  Task(completed=False)
```

---

## Exit Contract

### Input Contract

```
Operation: Exit
Trigger: User selects option 6 from main menu
Input: None required
```

### Output Contract

```
Goodbye: "Goodbye!"
```

### State Changes

```
Before: tasks = [...]
After:  Application terminates
```

---

## Error Taxonomy

| Error Type | Message Pattern | Behavior |
|------------|-----------------|----------|
| Invalid ID | "Error: Task #<id> not found" | Return to main menu |
| Empty title | "Title cannot be empty" | Reprompt |
| Invalid confirmation | "Please enter 'y' or 'n'" | Reprompt |
| General error | "An error occurred: <message>" | Return to menu |

---

## Idempotency

| Operation | Idempotent? | Notes |
|-----------|-------------|-------|
| Add | Yes | Creates new ID each time |
| View | Yes | Read-only |
| Update | Yes | Can update to same values |
| Delete | No | Returns error if ID not found |
| Toggle | Yes | Toggles each time |

---

## Timeout & Retry

| Operation | Timeout | Retry Behavior |
|-----------|---------|----------------|
| Add | None (interactive) | Unlimited reprompts |
| View | None | N/A |
| Update | None (interactive) | Unlimited reprompts |
| Delete | None (interactive) | Unlimited confirmation prompts |
| Toggle | None | Single attempt per ID |

---

## Menu Display Contract

### Main Menu Format

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

### Input Handling

| Input | Behavior |
|-------|----------|
| 1-6 | Execute corresponding operation |
| Empty | Reprompt |
| Other | Reprompt with "Invalid choice" |

---

## Example Session Trace

```
=== TODO LIST ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit

Enter choice (1-6): 1
Enter task title: Buy groceries
Enter description (optional): Milk, bread, eggs
Task #1 added

Enter choice (1-6): 1
Enter task title: Call mom
Enter description (optional): Birthday wishes
Task #2 added

Enter choice (1-6): 2
=== TASKS ===
1. [ ] Buy groceries
   Milk, bread, eggs

2. [ ] Call mom
   Birthday wishes

Enter choice (1-6): 5
Enter task ID: 1
Task #1 marked as complete

Enter choice (1-6): 2
=== TASKS ===
1. [✓] Buy groceries
   Milk, bread, eggs

2. [ ] Call mom
   Birthday wishes

Enter choice (1-6): 6
Goodbye!
```
