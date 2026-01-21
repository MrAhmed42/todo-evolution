# Frontend Development Guidelines

This document contains guidelines for working with the Next.js frontend of the todo application.

## Architecture

- Next.js 16+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Better Auth for authentication
- API client in `lib/api.ts` for all backend communication

## Component Structure

- `app/` - Next.js App Router pages
  - `(auth)/` - Authentication-related pages (signup, signin)
  - `dashboard/` - Main dashboard page
- `components/` - Reusable UI components
- `lib/` - Shared utilities and API client
- `types/` - TypeScript type definitions

## Development Patterns

### API Client Usage
- All backend communication should go through the ApiClient in `lib/api.ts`
- The client handles authentication token management automatically
- Error handling is built into each method

### State Management
- Use React hooks (useState, useEffect) for local component state
- Pass callbacks between components to manage state updates
- Avoid global state management for this application size

### Authentication Flow
- Check for authentication in page components using ApiClient.getUserInfo()
- Redirect unauthenticated users to signin page
- Store JWT token in localStorage (in production, consider httpOnly cookies)

### Component Design
- Keep components focused and reusable
- Use TypeScript interfaces for props
- Follow accessibility best practices
- Implement proper loading and error states