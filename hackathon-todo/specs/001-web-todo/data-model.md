# Data Model: Phase II - Full-Stack Web Todo Application

**Feature**: 001-web-todo | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)

## Overview

This document defines the database schema and entity relationships for the multi-user todo application. The design emphasizes user isolation, security, and performance through proper indexing and constraints.

## Entity Models

### User Entity (Managed by Better Auth)

```sql
TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for each user
- `email`: VARCHAR(255) - User's email address (unique constraint)
- `name`: VARCHAR(255) - User's display name (nullable)
- `created_at`: TIMESTAMP - When the user account was created
- `updated_at`: TIMESTAMP - When the user account was last updated

**Constraints**:
- `email` must be unique across all users
- `email` must be a valid email format (handled by Better Auth validation)

### Task Entity

```sql
TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tasks_user_id (user_id),
    INDEX idx_tasks_completed (completed)
);
```

**Fields**:
- `id`: SERIAL (Auto-increment Primary Key) - Unique identifier for each task
- `user_id`: UUID (Foreign Key) - Links task to owning user
- `title`: VARCHAR(200) - Task title (required, 1-200 characters)
- `description`: TEXT - Optional task description (max 1000 characters)
- `completed`: BOOLEAN - Whether task is completed (default: false)
- `created_at`: TIMESTAMP - When the task was created
- `updated_at`: TIMESTAMP - When the task was last updated

**Constraints**:
- `user_id` must reference a valid user (foreign key constraint)
- `title` must be 1-200 characters
- `description` can be null or up to 1000 characters
- When user is deleted, all their tasks are automatically deleted (CASCADE)

## Database Schema

### Tables

```
┌─────────────────────────┐    ┌─────────────────────────┐
│        users            │    │         tasks           │
│                         │    │                         │
│ id          UUID PK     │    │ id          SERIAL PK   │
│ email       VARCHAR     │    │ user_id     UUID FK     │
│ name        VARCHAR     │    │ title       VARCHAR     │
│ created_at  TIMESTAMP   │    │ description TEXT        │
│ updated_at  TIMESTAMP   │    │ completed   BOOLEAN     │
└─────────────────────────┘    │ created_at  TIMESTAMP   │
                              │ updated_at  TIMESTAMP   │
                              └─────────────────────────┘
```

### Indexes

1. **Primary Keys**: Automatically indexed by database
   - `users.id` - For fast user lookups
   - `tasks.id` - For fast task lookups

2. **Foreign Key Index**: Critical for JOIN performance
   - `tasks.user_id` - Essential for user isolation queries

3. **Filter Index**: For common filtering operations
   - `tasks.completed` - For completed/incomplete task filtering

## Relationships

### User → Tasks (One-to-Many)
- One user can have many tasks
- Foreign key: `tasks.user_id` references `users.id`
- Cascade delete: When user is deleted, all their tasks are deleted
- All queries must filter by `user_id` to enforce isolation

## Validation Rules

### User Validation (Handled by Better Auth)
- Email format validation
- Password strength requirements
- Duplicate email prevention

### Task Validation
- Title length: 1-200 characters
- Description length: 0-1000 characters
- User must exist before creating tasks
- User can only access their own tasks

## Access Patterns

### Common Queries

1. **Get all tasks for a user**:
   ```sql
   SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC;
   ```

2. **Get completed tasks for a user**:
   ```sql
   SELECT * FROM tasks WHERE user_id = $1 AND completed = TRUE;
   ```

3. **Create new task for a user**:
   ```sql
   INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *;
   ```

4. **Update task completion status**:
   ```sql
   UPDATE tasks SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3;
   ```

### Security Pattern
- Every query must include `WHERE user_id = $authenticated_user_id`
- Never allow direct task ID access without user verification
- Use parameterized queries to prevent SQL injection

## Performance Considerations

### Index Strategy
- Primary keys are automatically indexed
- Foreign key `user_id` is indexed for JOINs and filtering
- `completed` boolean field is indexed for common status queries

### Query Optimization
- Always filter by `user_id` first in WHERE clauses
- Use LIMIT clauses for pagination
- Consider composite indexes for complex queries if needed

### Partitioning
- Not required for initial implementation
- May consider user-based partitioning if scale increases significantly

## Migration Strategy

### Initial Migration
1. Create `users` table (handled by Better Auth)
2. Create `tasks` table with all indexes
3. Add foreign key constraint
4. Set up triggers for `updated_at` timestamp

### Future Extensions
- Add `category` field with index for task categorization
- Add `due_date` field with index for deadline filtering
- Add `priority` field for task prioritization

## Security Measures

### Data Isolation
- All queries must filter by authenticated user's ID
- Foreign key constraints prevent orphaned tasks
- Cascade delete ensures data cleanup on user removal

### Audit Trail
- `created_at` and `updated_at` timestamps on all records
- Potential for adding `deleted_at` for soft deletes in future

### Access Control
- Database-level constraints prevent direct access violations
- Application-level validation provides additional security layer