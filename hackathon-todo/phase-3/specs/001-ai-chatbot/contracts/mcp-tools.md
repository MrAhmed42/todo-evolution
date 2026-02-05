# MCP Tools Contract: Todo Management

## Overview
This document defines the Model Context Protocol (MCP) tools that will be available to the AI assistant for managing user tasks.

## Tool: add_task

### Description
Adds a new task to the user's todo list.

### Parameters
- `title` (string, required): The title of the task to be added
- `user_id` (string, required): The ID of the user to whom the task belongs

### Returns
```json
{
  "success": true,
  "task_id": 123,
  "title": "Buy groceries"
}
```

### Error Cases
- Returns error if user_id is invalid or doesn't match authenticated user
- Returns error if title is empty

## Tool: list_tasks

### Description
Lists tasks from the user's todo list with optional filtering.

### Parameters
- `user_id` (string, required): The ID of the user whose tasks to list
- `status` (string, optional): Filter status - "all", "pending", "completed" (default: "all")

### Returns
```json
{
  "tasks": [
    {
      "id": 123,
      "title": "Buy groceries",
      "completed": false
    },
    {
      "id": 124,
      "title": "Walk the dog",
      "completed": true
    }
  ]
}
```

### Error Cases
- Returns error if user_id is invalid or doesn't match authenticated user

## Tool: update_task

### Description
Updates an existing task in the user's todo list.

### Parameters
- `task_id` (integer, required): The ID of the task to update
- `user_id` (string, required): The ID of the user who owns the task
- `title` (string, optional): New title for the task
- `completed` (boolean, optional): New completion status for the task

### Returns
```json
{
  "success": true,
  "task_id": 123
}
```

### Error Cases
- Returns error if user_id is invalid or doesn't match authenticated user
- Returns error if task_id doesn't exist or belong to user
- Returns error if both title and completed are null

## Tool: delete_task

### Description
Deletes a task from the user's todo list.

### Parameters
- `task_id` (integer, required): The ID of the task to delete
- `user_id` (string, required): The ID of the user who owns the task

### Returns
```json
{
  "success": true,
  "task_id": 123
}
```

### Error Cases
- Returns error if user_id is invalid or doesn't match authenticated user
- Returns error if task_id doesn't exist or belong to user

## Security Requirements

1. **User Isolation**: Every tool call must validate that the `user_id` parameter matches the authenticated user's identity.
2. **Access Control**: Tools must return 403 Forbidden if a user attempts to access tasks belonging to another user.
3. **Input Validation**: All string inputs must be validated for length and content to prevent injection attacks.
4. **Rate Limiting**: Tool calls should be rate-limited to prevent abuse.

## Implementation Notes

- All tools must use SQLModel Session for database transactions
- Tools should return appropriate success/error responses
- Tools should log important operations for audit purposes
- Tools should handle database connection errors gracefully