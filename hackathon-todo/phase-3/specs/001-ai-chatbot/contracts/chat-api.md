# API Contract: Chat Endpoint

## POST /api/chat/{user_id}

### Description
Initiates or continues a conversation with the AI assistant for a specific user. Handles JWT authentication and routes the request to the OpenAI Agent.

### Authentication
- JWT Bearer token required in Authorization header
- Token's `user_id` must match the path parameter `user_id`

### Request Parameters

#### Path Parameters
- `user_id` (string, required): The ID of the user initiating the chat

#### Request Body
```json
{
  "message": "What tasks do I have?",
  "thread_id": "optional-thread-id-for-existing-conversations"
}
```

**Request Body Fields:**
- `message` (string, required): The user's message to the AI assistant
- `thread_id` (string, optional): Existing thread ID to continue conversation

### Response
```json
{
  "response": "You have 3 pending tasks...",
  "thread_id": "new-or-existing-thread-id",
  "message_id": "unique-message-id"
}
```

**Response Fields:**
- `response` (string): The AI assistant's response to the user
- `thread_id` (string): Thread ID for continuing the conversation
- `message_id` (string): Unique ID of the message for reference

### Error Responses

#### 401 Unauthorized
- When JWT token is missing or invalid
- When token has expired

#### 403 Forbidden
- When token's `user_id` doesn't match the path parameter

#### 422 Unprocessable Entity
- When request body is malformed
- When required fields are missing

#### 500 Internal Server Error
- When OpenAI API is unavailable
- When MCP server is unreachable

### Example Requests

```bash
curl -X POST \
  http://localhost:8000/api/chat/user123 \
  -H "Authorization: Bearer jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a task to buy groceries"
  }'
```

### Implementation Notes
- The endpoint must validate JWT token and extract user_id
- Conversation history must be loaded from database before sending to AI
- New messages must be saved to database after receiving response
- All MCP tool calls must include the authenticated user_id for isolation