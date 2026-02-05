---
id: 1
title: Generate Tasks
stage: tasks
date: 2026-01-30
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-chatbot
branch: 001-ai-chatbot
user: user
command: /sp.tasks
labels: ["tasks","ai","chatbot","mcp","openai"]
links:
  spec: specs/001-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-chatbot/tasks.md
tests:
  - null
---

## Prompt

```text
# Tasks: Phase III - AI Todo Chatbot (Agentic Interface)

**Prerequisites**: plan.md, spec.md in `phase-3/specs/`
**Legend**: `[P]` Parallel, `[BE]` Backend, `[FE]` Frontend, `[AI]` Agentic Logic, `[MCP]` Tooling

---

## Phase 1: Research & Schema Evolution (8 tasks)

- [ ] **T401** [P] Create `phase-3/` directory structure: `agents/`, `mcp-server/`, `specs/`
- [ ] **T402** [AI] Use `context7` MCP to fetch latest documentation for `openai-agents` Python SDK
- [ ] **T403** [MCP] Use `context7` MCP to fetch latest documentation for `mcp` (FastMCP) Python SDK
- [ ] **T404** [FE] Use `context7` MCP to fetch latest documentation for `OpenAI ChatKit` React components
- [ ] **T405** [BE] Create `Conversation` model in `backend/src/models.py`:
  - `id: int` (PK), `user_id: str` (FK, indexed), `title: str | None`, `created_at: datetime`
- [ ] **T406** [BE] Create `Message` model in `backend/src/models.py`:
  - `id: int` (PK), `conversation_id: int` (FK), `role: str` (user/assistant), `content: str`, `created_at: datetime`
- [ ] **T407** [BE] Run database migrations/startup to initialize new tables in Neon PostgreSQL
- [ ] **T408** [P] Update `CLAUDE.md` with Phase 3 technical context (Agents, MCP, ChatKit)

**Validate**: `uv run mypy` passes on updated models; DB tables exist in Neon.

---

## Phase 2: MCP Tool Development (6 tasks)

- [ ] **T409** [MCP] Initialize FastMCP server in `phase-3/mcp-server/server.py`
- [ ] **T410** [MCP] Implement `add_task` tool:
  - Logic: Insert into `tasks` table; enforce `user_id` from argument
- [ ] **T411** [MCP] Implement `list_tasks` tool:
  - Logic: Filter by `user_id` and optional `status` (all/pending/completed)
- [ ] **T412** [MCP] Implement `update_task` / `complete_task` tools:
  - Logic: Update `tasks` table where `id` and `user_id` match
- [ ] **T413** [MCP] Implement `delete_task` tool:
  - Logic: Delete from `tasks` where `id` and `user_id` match
- [ ] **T414** [INT] Test MCP tools locally using the MCP Inspector or a test script

**Validate**: Tools correctly perform CRUD on DB and respect `user_id` isolation.

---

## Phase 3: AI Agent & Stateless Runner (7 tasks)

- [ ] **T415** [AI] Define `TodoAgent` in `phase-3/agents/todo_agent.py`:
  - Instructions: Friendly Todo Assistant, supports English/Urdu, uses tools.
- [ ] **T416** [AI] Implement tool registration: Link `TodoAgent` to MCP tools created in T409-T413.
- [ ] **T417** [AI] Create `HistoryManager` in `phase-3/agents/runner.py`:
  - Logic: Fetch last 10 messages from DB based on `conversation_id`.
- [ ] **T418** [AI] Create stateless `run_agent_turn` function:
  - Inputs: `user_message`, `conversation_id`, `user_id`.
  - Flow: Load History → Call Agent → Execute Tool → Save Response to DB.
- [ ] **T419** [BE] Implement `POST /api/{user_id}/chat` endpoint in `backend/src/routes/chat.py`
- [ ] **T420** [BE] Add JWT protection to the chat endpoint (verify token matches `user_id`).
- [ ] **T421** [BE] Register chat router in `backend/src/main.py`.

**Validate**: `curl` request to chat endpoint triggers agent and returns tool-aware response.

---

## Phase 4: Frontend Chat Interface (6 tasks)

- [ ] **T422** [FE] Install `@openai/chatkit-react` and related dependencies in `frontend/`
- [ ] **T423** [FE] Configure OpenAI Domain Allowlist key in `frontend/.env.local`
- [ ] **T424** [FE] Create `frontend/app/chat/page.tsx`:
  - Component: Initialize ChatKit UI.
- [ ] **T425** [FE] Connect ChatKit to `POST /api/{user_id}/chat`:
  - Logic: Pass the Better Auth JWT in the `Authorization` header.
- [ ] **T426** [FE] Implement "Conversation Sidebar" to switch between previous chat sessions.
- [ ] **T427** [FE] Add Urdu language toggle or auto-detection for the UI.

**Validate**: Chat UI renders, sends messages, and displays AI responses.

---

## Phase 5: Final Polish & Bonus Tasks (5 tasks)

- [ ] **T428** [AI] Refine Urdu Prompts: Ensure 90% accuracy in Urdu task commands (GIAIC Bonus).
- [ ] **T429** [INT] E2E Test: Create a task via Chat, verify it appears in the Phase 2 Dashboard.
- [ ] **T430** [BE] Stress Test: Verify st
```

## Response snapshot

Generated comprehensive tasks.md file for Phase III - AI Todo Chatbot (Agentic Interface) with 48 specific, actionable tasks organized across 10 phases. The tasks cover all aspects of the AI chatbot implementation including research, database schema evolution, MCP tool development, AI agent integration, frontend UI, and multilingual support.

Key highlights:
- Created 10 phases from setup to final polish
- Included proper dependencies and parallel execution opportunities
- Aligned tasks with user stories from the spec (US1-US5)
- Added proper file paths and technology labels ([BE], [FE], [AI], [MCP])
- Ensured security considerations (user isolation) are addressed
- Maintained consistency with the existing codebase structure

The generated tasks.md file is immediately executable with each task being specific enough for an LLM to complete without additional context.

## Outcome

- ✅ Impact: Created comprehensive task list for AI Todo Chatbot implementation with 48 specific tasks
- 🧪 Tests: No specific tests generated as not requested in spec
- 📁 Files: Generated specs/001-ai-chatbot/tasks.md with structured task breakdown
- 🔁 Next prompts: Ready for implementation of individual tasks
- 🧠 Reflection: Tasks are well-organized by phases with clear dependencies and parallel opportunities

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Begin implementation of Phase 1 tasks