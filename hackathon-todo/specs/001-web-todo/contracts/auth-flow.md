# Authentication Flow: Phase II - Full-Stack Web Todo Application

**Feature**: 001-web-todo | **Date**: 2026-01-12 | **Spec**: [spec.md](../spec.md)

## Overview

This document outlines the authentication flow using Better Auth with JWT tokens for the multi-user todo application. The flow ensures secure user authentication and maintains user isolation through JWT token validation.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Better Auth   │    │    Backend      │
│   (Next.js)     │    │   (JWT)         │    │   (FastAPI)     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ 1. User enters  │───▶│ 2. Validate     │───▶│ 3. Issue JWT    │
│ credentials     │    │ credentials     │    │ with user_id    │
│                 │◀───│ 4. Return JWT   │◀───│                 │
│                 │    │                 │    │                 │
│ 5. Store JWT in │    │                 │    │                 │
│ httpOnly cookie │    │                 │    │                 │
│                 │    │                 │    │                 │
│ 6. Include JWT  │───▶│ 7. Validate     │    │ 8. Extract      │
│ in requests     │    │ JWT signature   │    │ user_id from    │
│                 │    │                 │───▶│ token           │
│                 │    │                 │    │                 │
│                 │    │                 │    │ 9. Verify       │
│                 │    │                 │    │ user_id matches │
│                 │    │                 │    │ URL parameter   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Detailed Flow

### 1. User Registration (Signup)

```
Frontend → Better Auth
├── User navigates to /signup
├── User enters email, password, name
├── POST /auth/signup with user data
├── Better Auth validates input
├── Better Auth creates user record
├── Better Auth sets httpOnly cookie with JWT
└── Redirects to /signin
```

**Request**:
```
POST /api/auth/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```
HTTP/1.1 201 Created
Set-Cookie: auth_token=<jwt_token>; HttpOnly; Secure; SameSite=Lax
{
  "success": true,
  "redirect": "/signin"
}
```

### 2. User Authentication (Signin)

```
Frontend → Better Auth
├── User navigates to /signin
├── User enters email, password
├── POST /auth/signin with credentials
├── Better Auth validates credentials
├── Better Auth generates JWT with user_id
├── Better Auth sets httpOnly cookie with JWT
└── Redirects to /dashboard
```

**Request**:
```
POST /api/auth/signin
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```
HTTP/1.1 200 OK
Set-Cookie: auth_token=<jwt_token>; HttpOnly; Secure; SameSite=Lax
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 3. Protected Route Access

```
Frontend → Next.js Middleware → Better Auth
├── User navigates to /dashboard
├── Next.js middleware checks auth cookie
├── Middleware calls Better Auth verify
├── Better Auth validates JWT signature
├── Better Auth extracts user_id from token
├── If valid, allow access to /dashboard
└── If invalid, redirect to /signin
```

**Middleware Logic**:
```javascript
// middleware.ts
import { betterAuth } from '@/lib/auth';

export default betterAuth().middleware;

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
```

### 4. API Request with Authentication

```
Frontend → Backend → JWT Validation → User Verification
├── Frontend makes API request to /api/users/{user_id}/tasks
├── Request includes auth cookie with JWT
├── Backend extracts JWT from cookie
├── Backend validates JWT signature using BETTER_AUTH_SECRET
├── Backend decodes JWT to get user_id
├── Backend compares decoded user_id with URL user_id
├── If match, proceed with request
├── If mismatch, return 403 Forbidden
└── Execute database query with user_id filter
```

**Request Flow**:
```
GET /api/users/a1b2c3d4-e5f6-7890-abcd-ef1234567890/tasks
Cookie: auth_token=<jwt_token>

↓

JWT Validation Middleware:
- Verify signature with BETTER_AUTH_SECRET
- Decode payload: { user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", ... }
- Compare with URL: user_id in URL matches token user_id ✓
- Attach user_id to request context

↓

Route Handler:
- Query: SELECT * FROM tasks WHERE user_id = $1
- Execute with validated user_id
```

## JWT Token Structure

### Payload
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "name": "John Doe",
  "exp": 1703846400,
  "iat": 1703842800,
  "jti": "unique-token-id"
}
```

### Claims
- `user_id`: UUID of authenticated user (required for isolation)
- `email`: User's email address
- `name`: User's display name
- `exp`: Expiration timestamp (7 days from issue)
- `iat`: Issued at timestamp
- `jti`: Unique token identifier for potential revocation

## Security Measures

### Token Security
- **Algorithm**: RS256 (RSA Signature with SHA-256)
- **Secret**: Shared `BETTER_AUTH_SECRET` between frontend and backend
- **Expiry**: 7 days (604800 seconds)
- **Refresh**: Tokens are refreshed automatically by Better Auth

### Cookie Security
- **HttpOnly**: Prevents XSS access to token
- **Secure**: Only transmitted over HTTPS
- **SameSite**: Prevents CSRF attacks (Lax mode)
- **Domain**: Limited to application domain

### Validation Checks
1. **Signature Validation**: Verify JWT signature with shared secret
2. **Expiration Check**: Ensure token hasn't expired
3. **User ID Match**: Verify token user_id matches URL user_id
4. **User Existence**: Confirm user still exists in database

## Error Handling

### Authentication Errors

| Scenario | HTTP Status | Response | Action |
|----------|-------------|----------|---------|
| Missing token | 401 Unauthorized | `{"detail": "Missing authentication"}` | Redirect to /signin |
| Invalid token | 401 Unauthorized | `{"detail": "Invalid token"}` | Redirect to /signin |
| Expired token | 401 Unauthorized | `{"detail": "Token expired"}` | Redirect to /signin |
| User ID mismatch | 403 Forbidden | `{"detail": "Access denied"}` | Show error, stay on page |
| User deleted | 401 Unauthorized | `{"detail": "Account no longer exists"}` | Redirect to /signin |

### Session Management

#### Automatic Renewal
- Better Auth automatically renews tokens near expiration
- Renewal happens transparently during API requests
- Frontend doesn't need to handle renewal explicitly

#### Logout Process
```
Frontend → Better Auth → Backend
├── User clicks logout button
├── POST /auth/signout request
├── Better Auth invalidates session
├── Better Auth clears auth cookie
├── Redirect to /signin
└── Backend session invalidated
```

## Implementation Details

### Frontend Integration
- Use Better Auth React hooks: `useSession`, `signIn`, `signOut`
- Leverage Next.js middleware for route protection
- Automatic cookie handling by Better Auth client

### Backend Integration
- JWT middleware to validate tokens
- User ID extraction and comparison
- Database query filtering by validated user_id
- Proper error responses for auth failures

### Environment Variables
```bash
# Shared secret between frontend and backend
BETTER_AUTH_SECRET="your-super-secret-key-here"

# Development overrides
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
```

## Compliance with Constitution

This authentication flow satisfies the following constitutional requirements:

✅ **User Isolation**: JWT user_id verified against URL user_id
✅ **Stateless Architecture**: No server-side session storage
✅ **Security Requirements**: HttpOnly cookies, proper validation
✅ **Modern Standards**: JWT with RS256 algorithm
✅ **Type Safety**: TypeScript interfaces for auth data