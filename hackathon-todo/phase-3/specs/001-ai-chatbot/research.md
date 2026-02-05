# Research Findings: AI Todo Chatbot Implementation

## Phase 0: Research (T-301)

### 1. OpenAI Agents SDK Documentation

#### Decision: OpenAI Python SDK Class Signatures
- **Rationale**: Researched the exact class signatures needed for implementing the OpenAI Agents functionality
- **Findings**:
  - Use `from openai.types.beta import Thread` for thread management
  - Use `from openai.types.beta.threads import Run, RunStatus` for run management
  - Create threads with `client.beta.threads.create(**params) -> Thread`
  - Create runs with `client.beta.threads.runs.create(thread_id, **params) -> Run`

#### Alternatives Considered:
- LangChain (forbidden by constitution)
- LlamaIndex (forbidden by constitution)

### 2. Model Context Protocol (MCP) Server

#### Decision: FastMCP Server Implementation
- **Rationale**: Researched the exact implementation patterns for creating an MCP server in Python
- **Findings**:
  - Use `from mcp_use.server import MCPServer` for creating the server
  - Initialize with `MCPServer(name, version, instructions, debug=True)`
  - Define tools using the `@server.tool()` decorator
  - Run with `server.run(transport="stdio", host="0.0.0.0", port=8000)`

#### Example Pattern:
```python
from mcp_use.server import MCPServer

server = MCPServer(
    name="todo-mcp-server",
    version="1.0.0",
    instructions="MCP server for todo management tools",
    debug=True,
)

@server.tool()
def add_task(title: str, user_id: str) -> dict:
    """Add a new task for the specified user."""
    # Implementation here
    pass

server.run(transport="stdio", port=8000)
```

#### Alternatives Considered:
- Custom HTTP endpoints (less standardized)
- Direct API calls without MCP (doesn't meet requirements)

### 3. OpenAI ChatKit Integration

#### Decision: Next.js ChatKit Integration Pattern
- **Rationale**: Researched how to integrate ChatKit with the existing Next.js application
- **Findings**:
  - Install with `npm install @openai/chatkit-react`
  - Use `useChatKit` hook to manage the chat control
  - Fetch client secret from backend API endpoint (`/api/chat/session`)
  - Render with `<ChatKit control={control} />` component

#### Example Pattern:
```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export function TodoChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // Refresh logic
        }

        const res = await fetch('/api/chat/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-full" />;
}
```

#### Alternatives Considered:
- Building custom chat interface (more work, less polished)
- Third-party chat components (not aligned with requirements)

### 4. Integration Architecture Summary

Based on the research, the implementation will follow this architecture:

1. **Backend**:
   - MCP server using `mcp_use.server.MCPServer` for tool execution
   - FastAPI endpoint `/api/chat` that handles JWT authentication and integrates with OpenAI
   - SQLModel entities for Conversation and Message persistence

2. **Frontend**:
   - Next.js page at `/app/chat/page.tsx`
   - ChatKit component with proper session management
   - JWT token passing for authentication

3. **Security**:
   - All MCP tools will accept and validate `user_id` parameter
   - JWT validation on the `/api/chat` endpoint
   - User isolation enforced at the database level

### 5. Key Dependencies Identified

- `openai` - for OpenAI Agents SDK
- `mcp_use` - for MCP server implementation
- `@openai/chatkit-react` - for frontend chat component
- Existing dependencies: `sqlmodel`, `better-auth`, `fastapi`

This research resolves all "NEEDS CLARIFICATION" items from the technical context section of the plan.