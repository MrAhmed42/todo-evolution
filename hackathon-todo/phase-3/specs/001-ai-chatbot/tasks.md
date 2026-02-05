# Tasks: Phase III - AI Todo Chatbot (Agentic Interface)

**Prerequisites**: plan.md, spec.md in `specs/001-ai-chatbot/`
**Legend**: `[P]` Parallel, `[BE]` Backend, `[FE]` Frontend, `[AI]` Agentic Logic, `[MCP]` Tooling
**Dependencies**: Phase I (SQLModel), Phase II (Better Auth)

---

## Phase 1: Research & Setup (10 tasks)

- [ ] **T301** [P] Create `mcp_server/` directory structure with `server.py` file
- [ ] **T302** [P] Create `backend/src/routes/chat.py` for chat endpoint
- [ ] **T303** [P] Create `frontend/app/chat/page.tsx` for ChatKit UI
- [ ] **T304** [AI] Use `context7` MCP to fetch latest documentation for `openai-agents` Python SDK
- [ ] **T305** [MCP] Use `context7` MCP to fetch latest documentation for `mcp` (FastMCP) Python SDK
- [ ] **T306** [FE] Use `context7` MCP to fetch latest documentation for `OpenAI ChatKit` React components
- [ ] **T307** [BE] Install backend dependencies: `pip install openai mcp-use`
- [ ] **T308** [FE] Install frontend dependencies: `npm install @openai/chatkit-react`
- [ ] **T309** [P] Update `CLAUDE.md` with Phase 3 technical context (Agents, MCP, ChatKit)
- [ ] **T310** [P] Create `specs/001-ai-chatbot/` directory structure with all required docs

**Validate**: All dependencies installed successfully; directory structure created.

---

## Phase 2: Database Schema Evolution (4 tasks)

- [ ] **T311** [BE] Update `backend/src/models.py` with `Conversation` model:
  - `id: str` (UUID PK), `user_id: str` (indexed FK), `title: str | None`, `created_at: datetime`, `updated_at: datetime`
- [ ] **T312** [BE] Update `backend/src/models.py` with `Message` model:
  - `id: str` (UUID PK), `conversation_id: str` (FK, indexed), `role: str` (user/assistant), `content: str`, `tool_calls: str | None`, `tool_responses: str | None`, `created_at: datetime`
- [ ] **T313** [BE] Update `backend/src/models.py` to add proper relationships between Conversation and Message models
- [ ] **T314** [BE] Run database migrations to initialize new tables in Neon PostgreSQL

**Validate**: `uv run mypy` passes on updated models; DB tables exist in Neon; proper relationships established.

---

## Phase 3: MCP Tool Development (6 tasks)

- [ ] **T315** [MCP] Initialize FastMCP server in `mcp_server/server.py` with proper configuration
- [ ] **T316** [MCP] Implement `add_task` tool in `mcp_server/server.py`:
  - Logic: Insert into `tasks` table; enforce `user_id` validation from argument
- [ ] **T317** [MCP] Implement `list_tasks` tool in `mcp_server/server.py`:
  - Logic: Filter by `user_id` and optional `status` (all/pending/completed)
- [ ] **T318** [MCP] Implement `update_task` / `complete_task` tools in `mcp_server/server.py`:
  - Logic: Update `tasks` table where `id` and `user_id` match
- [ ] **T319** [MCP] Implement `delete_task` tool in `mcp_server/server.py`:
  - Logic: Delete from `tasks` where `id` and `user_id` match
- [ ] **T320** [INT] Test MCP tools locally using the MCP Inspector or a test script

**Validate**: Tools correctly perform CRUD on DB and respect `user_id` isolation.

---

## Phase 4: User Story 1 - Natural Language Task Creation (4 tasks)

- [ ] **T321** [P] [US1] Define `TodoAgent` in `mcp_server/server.py`:
  - Instructions: Friendly Todo Assistant, supports English, uses tools for task management
- [ ] **T322** [P] [US1] Create stateless `run_agent_turn` function in `backend/src/routes/chat.py`:
  - Inputs: `user_message`, `conversation_id`, `user_id`
  - Flow: Load History → Call Agent → Execute Tool → Save Response to DB
- [ ] **T323** [US1] Implement `POST /api/{user_id}/chat` endpoint in `backend/src/routes/chat.py`
- [ ] **T324** [US1] Add JWT protection to the chat endpoint (verify token matches `user_id`)

**Validate**: User can type "Add a task to buy groceries" and see it created in the database with proper response.

---

## Phase 5: User Story 2 - Conversational Task Retrieval (3 tasks)

- [ ] **T325** [US2] Enhance agent instructions to handle task listing queries like "What do I have left to do?"
- [ ] **T326** [US2] Update chat endpoint to properly route list queries to the `list_tasks` MCP tool
- [ ] **T327** [US2] Handle edge case where no tasks exist and provide appropriate response

**Validate**: Asking "What do I have left to do?" returns only pending tasks with proper AI response.

---

## Phase 6: User Story 3 - Stateless Context & History (4 tasks)

- [ ] **T328** [US3] Create `HistoryManager` class in `backend/src/routes/chat.py`:
  - Logic: Fetch last N messages from DB based on `conversation_id` for context
- [ ] **T329** [US3] Implement conversation persistence in the chat endpoint
- [ ] **T330** [US3] Ensure history is passed to the AI model for contextual responses
- [ ] **T331** [US3] Test history persistence across server/browser restarts

**Validate**: Previous messages appear in chat window after refreshing browser and server restarts.

---

## Phase 7: User Story 4 - Multi-User Privacy in Tools (3 tasks)

- [ ] **T332** [US4] Implement strict `user_id` validation in all MCP tools to prevent cross-user access
- [ ] **T333** [US4] Add comprehensive error handling for unauthorized access attempts
- [ ] **T334** [US4] Test that user cannot access another user's tasks via AI commands

**Validate**: Attempts to access another user's data return proper 403 errors and are blocked.

---

## Phase 8: Frontend Chat Interface (6 tasks)

- [ ] **T335** [FE] Configure OpenAI Domain Allowlist key in `frontend/.env.local`
- [ ] **T336** [FE] Create `frontend/app/chat/page.tsx` with ChatKit UI component
- [ ] **T337** [FE] Connect ChatKit to `POST /api/{user_id}/chat` endpoint
  - Logic: Pass the Better Auth JWT in the `Authorization` header
- [ ] **T338** [FE] Implement "Conversation Sidebar" to switch between previous chat sessions
- [ ] **T339** [FE] Add conversation history loading functionality
- [ ] **T340** [FE] Style the chat interface to match existing application design

**Validate**: Chat UI renders, sends messages, and displays AI responses properly.

---

## Phase 9: User Story 5 - Multilingual Support: Urdu (Bonus) (3 tasks)

- [ ] **T341** [P] [US5] Update agent instructions to support Urdu language commands
- [ ] **T342** [US5] Test Urdu command interpretation accuracy
- [ ] **T343** [US5] Ensure Urdu responses are properly formatted and accurate

**Validate**: Urdu commands like "ایک کام شامل کریں: دودھ خریدنا" create tasks correctly with 90% accuracy.

---

## Phase 10: Integration & Polish (5 tasks)

- [ ] **T344** [INT] Register chat router in `backend/src/main.py`
- [ ] **T345** [INT] Complete end-to-end test: Create task via Chat, verify it appears in Phase II Dashboard
- [ ] **T346** [INT] Performance test: Verify response times under 2 seconds for 90% of requests
- [ ] **T347** [DOC] Update API documentation with new chat endpoint
- [ ] **T348** [TEST] Add integration tests for the entire chat workflow

**Validate**: Full chat workflow works from frontend to AI to MCP tools to database.

---

## Dependencies

- User Story 4 (Privacy) blocks User Story 1, 2, 3, 5 (All tools must respect user isolation)
- Database Schema Evolution (Phase 2) blocks MCP Tool Development (Phase 3)
- MCP Tool Development (Phase 3) blocks all AI/Agent phases (4, 5, 6, 7, 9)
- User Story 1 (Basic functionality) should be completed before advanced features (2, 3, 5)

---

## Parallel Opportunities

- T301-T303: Directory and file creation can happen in parallel
- T304-T306: Research tasks can happen in parallel
- T307-T308: Dependency installations can happen in parallel
- T321-T322: Agent definition and runner function can be developed in parallel
- T335-T337: Frontend implementation can happen in parallel

---

## Implementation Strategy

**MVP Scope**: User Story 1 (Natural Language Task Creation) with basic chat functionality
- T301-T310: Setup and dependencies
- T311-T314: Database schema
- T315-T320: MCP tools
- T321-T324: Basic chat functionality
- T335-T340: Frontend chat UI

**Incremental Delivery**:
1. MVP: Basic task creation via chat
2. Enhancement: Task retrieval and management
3. Advanced: History persistence and privacy
4. Bonus: Multilingual support