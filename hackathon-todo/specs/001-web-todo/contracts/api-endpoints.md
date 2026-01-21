# API Endpoints Contract: Phase II - Full-Stack Web Todo Application

**Feature**: 001-web-todo | **Date**: 2026-01-12 | **Spec**: [spec.md](../spec.md)

## Overview

This document defines the REST API contracts for the multi-user todo application. All endpoints require JWT authentication in the Authorization header, with the exception of authentication endpoints themselves. User isolation is enforced by validating that the authenticated user's ID matches the user ID in the URL path.

## Authentication Requirements

### JWT Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Validation
- All protected endpoints validate JWT signature using `BETTER_AUTH_SECRET`
- Token must contain valid `user_id`, `email`, and `exp` (expiry)
- `user_id` in token must match `user_id` in URL path
- Invalid/missing tokens return 401 Unauthorized

## Base URL
```
http://localhost:8000/api (development)
https://your-domain.com/api (production)
```

## Authentication Endpoints

### POST /auth/signup
**Description**: Create a new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
- `201 Created`: Account created successfully
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

**Headers**:
- Content-Type: application/json

### POST /auth/signin
**Description**: Authenticate user and return JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
- `200 OK`: Authentication successful
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials

**Headers**:
- Content-Type: application/json

### POST /auth/signout
**Description**: Invalidate current session

**Request**:
- Headers: Authorization: Bearer <token>

**Response**:
- `200 OK`: Successfully logged out
- `401 Unauthorized`: Invalid/missing token

### GET /auth/me
**Description**: Get current authenticated user info

**Request**:
- Headers: Authorization: Bearer <token>

**Response**:
- `200 OK`: User info retrieved
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "John Doe"
}
```
- `401 Unauthorized`: Invalid/missing token

## Task Endpoints

All task endpoints require authentication and enforce user isolation by validating that the authenticated user's ID matches the user ID in the URL.

### GET /users/{user_id}/tasks
**Description**: Get all tasks for a specific user

**Path Parameters**:
- `user_id`: UUID of the user whose tasks to retrieve

**Request**:
- Headers: Authorization: Bearer <token>

**Response**:
- `200 OK`: Tasks retrieved successfully
```json
[
  {
    "id": 1,
    "user_id": "uuid-string",
    "title": "Sample Task",
    "description": "Task description here",
    "completed": false,
    "created_at": "2025-12-29T10:00:00Z",
    "updated_at": "2025-12-29T10:00:00Z"
  }
]
```
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: User doesn't exist

### POST /users/{user_id}/tasks
**Description**: Create a new task for a specific user

**Path Parameters**:
- `user_id`: UUID of the user to create task for

**Request**:
- Headers: Authorization: Bearer <token>
- Body: application/json
```json
{
  "title": "New Task Title",
  "description": "Optional task description"
}
```

**Response**:
- `201 Created`: Task created successfully
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "New Task Title",
  "description": "Optional task description",
  "completed": false,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T10:00:00Z"
}
```
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: User doesn't exist
- `422 Unprocessable Entity`: Validation error

### GET /users/{user_id}/tasks/{id}
**Description**: Get a specific task for a user

**Path Parameters**:
- `user_id`: UUID of the user who owns the task
- `id`: Integer ID of the task to retrieve

**Request**:
- Headers: Authorization: Bearer <token>

**Response**:
- `200 OK`: Task retrieved successfully
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Sample Task",
  "description": "Task description here",
  "completed": false,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T10:00:00Z"
}
```
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: Task or user doesn't exist

### PUT /users/{user_id}/tasks/{id}
**Description**: Update a specific task for a user

**Path Parameters**:
- `user_id`: UUID of the user who owns the task
- `id`: Integer ID of the task to update

**Request**:
- Headers: Authorization: Bearer <token>
- Body: application/json
```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "completed": true
}
```

**Response**:
- `200 OK`: Task updated successfully
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Updated Task Title",
  "description": "Updated task description",
  "completed": true,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T11:00:00Z"
}
```
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: Task or user doesn't exist
- `422 Unprocessable Entity`: Validation error

### PATCH /users/{user_id}/tasks/{id}/complete
**Description**: Toggle the completion status of a specific task

**Path Parameters**:
- `user_id`: UUID of the user who owns the task
- `id`: Integer ID of the task to update

**Request**:
- Headers: Authorization: Bearer <token>
- Body: application/json
```json
{
  "completed": true
}
```

**Response**:
- `200 OK`: Task completion status updated
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Sample Task",
  "description": "Task description here",
  "completed": true,
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T11:00:00Z"
}
```
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: Task or user doesn't exist
- `422 Unprocessable Entity`: Validation error

### DELETE /users/{user_id}/tasks/{id}
**Description**: Delete a specific task for a user

**Path Parameters**:
- `user_id`: UUID of the user who owns the task
- `id`: Integer ID of the task to delete

**Request**:
- Headers: Authorization: Bearer <token>

**Response**:
- `204 No Content`: Task deleted successfully
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Token user_id doesn't match URL user_id
- `404 Not Found`: Task or user doesn't exist

## Error Responses

All error responses follow this format:
```json
{
  "detail": "Error message describing the issue"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request format or parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have permission to access resource
- `404 Not Found`: Requested resource doesn't exist
- `409 Conflict`: Request conflicts with current state (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation error in request body
- `500 Internal Server Error`: Server-side error occurred

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- Task endpoints: 100 requests per minute per authenticated user
- Burst allowance: 2x rate limit for short periods

## Security Headers

All responses include:
- Strict-Transport-Security: max-age=31536000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block