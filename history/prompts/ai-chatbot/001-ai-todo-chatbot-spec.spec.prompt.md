---
id: 1
title: ai-todo-chatbot-spec
stage: spec
date: 2026-01-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-chatbot
branch: 001-ai-chatbot
user: unknown
command: /sp.specify
labels: ["ai", "chatbot", "todo", "specification", "natural-language"]
links:
  spec: ../specs/001-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-ai-chatbot/spec.md
 - specs/001-ai-chatbot/checklists/requirements.md
tests:
 - none
---

## Prompt

# Feature Specification: Phase III - AI Todo Chatbot (Agentic Interface)

**Feature Branch**: `003-ai-chatbot`
**Created**: 2026-01-30
**Status**: Draft
**Input**: Integrate OpenAI Agents SDK and MCP Server to allow natural language task management.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Task Creation (Priority: P0)

Users can add tasks by simply typing a sentence to the chatbot.

**Why this priority**: This is the primary "AI-Native" way to interact with the app.

**Independent Test**: Type "Remind me to call the client tomorrow" and verify a new task is created in the database with that title.

**Acceptance Scenarios**:
1. **Given** the user is in the chat interface, **When** they type "Add a task to buy groceries," **Then** the Agent calls `add_task` and responds "✅ I've added 'Buy groceries' to your list."
2. **Given** a multi-part request like "I need to wash the car and fix the sink," **When** submitted, **Then** the Agent creates two separate tasks using the tool.
3. **Given** an incomplete request, **When** the user says "Add a task," **Then** the Agent asks for the task title before proceeding.

---

### User Story 2 - Conversational Task Retrieval (Priority: P1)

Users can query their task list using natural language filters.

**Why this priority**: Allows users to find information quickly without manual scrolling.

**Independent Test**: Ask "What do I have left to do?" and verify the AI lists only pending tasks.

**Acceptance Scenarios**:
1. **Given** the user has 5 tasks, **When** they ask "Show me all my tasks," **Then** the Agent calls `list_tasks(status='all')` and displays them in the chat.
2. **Given** a specific status query like "What have I finished?", **When** asked, **Then** the Agent calls `list_tasks(status='completed')`.
3. **Given** no tasks exist, **When** the user asks for a list, **Then** the Agent responds "Your list is currently empty. Would you like to add something?"

---

### User Story 3 - Stateless Context & History (Priority: P1)

Users can maintain a conversation across sessions because history is persisted in the DB.

**Why this priority**: Ensures the "Stateless Server" requirement is met while maintaining a "Stateful Experience" for the user.

**Independent Test**: Send a message, refresh the browser, and verify the previous messages still appear in the chat window.

**Acceptance Scenarios**:
1. **Given** an existing conversation, **When** the user sends a new message, **Then** the system fetches previous messages from the `Message` table to provide context to the LLM.
2. **Given** the server restarts, **When** the user sends a message, **Then** the AI still remembers previous context (e.g., "What did I just add?") because history is in PostgreSQL.

---

### User Story 4 - Multi-User Privacy in Tools (Priority: P0)

The AI Agent and MCP Tools strictly respect user boundaries.

**Why this priority**: Prevents a user from using the chatbot to view or delete another user's tasks.

**Independent Test**: Attempt to ask the AI to "Delete task 99" (where 99 belongs to another user) and verify the tool returns an error or 403.

**Acceptance Scenarios**:
1. **Given** User A is authenticated, **When** they ask the bot to list tasks, **Then** the MCP tool must automatically inject `user_id` from the JWT to ensure only User A's data is returned.
2. **Given** a direct tool call attempt with a fake `user_id`, **When** processed, **Then** the system returns a validation error.

---

### User Story 5 - Multilingual Support: Urdu (Priority: P2 - Bonus)

Users can manage their tasks using Urdu language commands.

**Why this priority**: Meets the +100 bonus point requirement for GIAIC.

**Independent Test**: Type "ایک کام شامل کریں: دودھ خریدنا" and verify a task is created.

**Acceptance Scenarios**:
1. **Given** the user speaks in Urdu, **When** they request a task, **Then** the Agent interprets the intent correctly and calls the underlying tool.
2. **Given** an Urdu query, **When** the task is created, **Then** the Agent responds with confirmation in Urdu.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-301**: System MUST implement an **MCP Server** using the official Python SDK to expose Task CRUD as tools.
- **FR-302**: System MUST use **OpenAI Agents SDK** to orchestrate the "Agent" that decides which tool to call.
- **FR-303**: System MUST store `Conversation` and `Message` entities in the Neon database to maintain stateless history.
- **FR-304**: System MUST provide a `POST /api/{user_id}/chat` endpoint that integrates the Agent Runner.
- **FR-305**: System MUST integrate **OpenAI ChatKit** into a new `frontend/app/chat` route.
- **FR-306**: MCP tools MUST receive `user_id` as a required parameter for every call to ensure data isolation.
- **FR-307**: AI responses MUST be streamed or returned as JSON containing both text and `tool_calls` metadata.

### Key Entities

- **Conversation**: Represents a chat session
  - `id`: Unique identifier
  - `user_id`: Owner of the chat
  - `created_at`: Timestamp

- **Message**: Individual entries in a conversation
  - `id`: Unique identifier
  - `conversation_id`: FK to Conversation
  - `role`: "user" or "assistant"
  - `content`: The text of the message
  - `created_at`: Timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-301**: 100% of Basic CRUD operations are reachable via natural language chat.
- **SC-302**: Chat response time (including AI processing) < 2s for 90% of requests.
- **SC-303**: 100% of chat history persists after server/browser restart.
- **SC-304**: 0% success rate for Agent attempts to access cross-user data (Security audit).
- **SC-305**: Frontend passes Domain Allowlist security checks on OpenAI Platform.
- **SC-306**: Code passes `uv` and `mypy` checks without AI SDK typing errors.

## Assumptions

- **Logic**: The Agent uses `gpt-4o` or `gpt-4o-mini` for tool calling.
- **Auth**: The `user_id` from Phase II Better Auth session is used to scope the chat.
- **Tools**: The MCP Server runs as a sub-process or integrated module

## Response snapshot

Created comprehensive feature specification for AI Todo Chatbot with agentic interface. The specification includes user stories for natural language task creation, conversational task retrieval, stateless context, privacy controls, and multilingual support. Defined functional requirements, key entities, and measurable success criteria.

## Outcome

- ✅ Impact: Complete feature specification created for AI Todo Chatbot with OpenAI Agents SDK integration
- 🧪 Tests: none
- 📁 Files: specs/001-ai-chatbot/spec.md, specs/001-ai-chatbot/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create implementation plan, /sp.tasks to generate tasks
- 🧠 Reflection: Specification covers all required user scenarios with testable acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All validation checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation planning phase