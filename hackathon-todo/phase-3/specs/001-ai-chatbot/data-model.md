# Data Model: AI Todo Chatbot

## Entities

### Conversation
Represents a chat session between a user and the AI assistant.

**Fields:**
- `id` (UUID, Primary Key) - Unique identifier for the conversation
- `user_id` (String, Required) - ID of the user who owns this conversation
- `title` (String, Optional) - Auto-generated title based on first message
- `created_at` (DateTime, Required) - Timestamp when conversation was created
- `updated_at` (DateTime, Required) - Timestamp when conversation was last updated

**Relationships:**
- One-to-Many: Conversation -> Messages (conversation.messages)

### Message
Individual entries in a conversation representing user inputs or AI responses.

**Fields:**
- `id` (UUID, Primary Key) - Unique identifier for the message
- `conversation_id` (UUID, Required) - Foreign key to Conversation
- `role` (String, Required) - Either "user" or "assistant"
- `content` (Text, Required) - The text content of the message
- `tool_calls` (JSON, Optional) - JSON representation of any tool calls made
- `tool_responses` (JSON, Optional) - JSON representation of tool call results
- `created_at` (DateTime, Required) - Timestamp when message was created

**Relationships:**
- Many-to-One: Message -> Conversation (message.conversation)

## Validation Rules

### Conversation
- `user_id` must be a valid UUID string
- `created_at` must be set automatically on creation
- `updated_at` must be updated automatically on modification

### Message
- `role` must be one of ["user", "assistant"]
- `conversation_id` must reference an existing Conversation
- `content` must not be empty
- `tool_calls` and `tool_responses` must be valid JSON when present

## State Transitions

None applicable - these are immutable entities with timestamps for ordering.

## Indexes

### Conversation
- Index on `user_id` for efficient user-based queries
- Index on `created_at` for chronological ordering

### Message
- Index on `conversation_id` for efficient conversation-based queries
- Index on `created_at` for chronological ordering within conversations