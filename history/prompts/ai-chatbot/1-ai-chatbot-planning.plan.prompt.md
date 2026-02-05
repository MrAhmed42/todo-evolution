---
id: 1
title: "AI Chatbot Planning"
stage: "plan"
date_iso: "2026-01-30"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "ai-chatbot"
branch: "001-ai-chatbot"
user: "user"
command: "/sp.plan"
labels: ["planning", "ai", "chatbot", "mcp", "openai"]
links:
  spec: "./spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-ai-chatbot/plan.md"
  - "specs/001-ai-chatbot/research.md"
  - "specs/001-ai-chatbot/data-model.md"
  - "specs/001-ai-chatbot/quickstart.md"
  - "specs/001-ai-chatbot/contracts/chat-api.md"
  - "specs/001-ai-chatbot/contracts/mcp-tools.md"
tests_yaml:
  - "T-301: Research OpenAI/MCP documentation"
  - "T-302: Design Conversation/Message data models"
  - "T-303: Define MCP tool contracts"
  - "T-304: Plan agent orchestration"
  - "T-305: Design frontend integration"
outcome: "Completed Phase 0-1 planning for AI Todo Chatbot"
evaluation: "Successfully researched required technologies, defined data models, API contracts, and implementation approach"
---

# Implementation Plan: Phase III - AI Todo Chatbot (Agentic Interface)

**Branch**: `001-ai-chatbot` | **Date**: 2026-01-30 | **Spec**: [01-ai-chatbot-spec.md](./spec.md)
**Tooling**: Claude Code + Context7 MCP (Documentation Guard)

## 1. Summary
Evolve the Todo application into an AI-native platform. This phase adds a conversational interface that allows users to manage their tasks through natural language. We utilize the **OpenAI Agents SDK** for orchestration, **FastMCP** for tool execution, and **OpenAI ChatKit** for a premium UI. All interactions remain stateless at the server level but are made persistent via the Neon PostgreSQL database.

## 2. Technical Context & Constraints

- **AI Engine**: OpenAI Agents SDK (Python) - Using `openai.types.beta.Thread` and `openai.types.beta.threads.Run`
- **Tool Protocol**: Model Context Protocol (MCP) using `mcp_use.server.MCPServer`
- **UI Framework**: OpenAI ChatKit (React Components) - Using `@openai/chatkit-react` with `useChatKit` hook
- **Persistence Layer**: SQLModel with `Conversation` and `Message` tables
- **Doc Verification**: Completed via context7 MCP research (see research.md)
- **Security**: Mandatory JWT verification on `/api/chat` with strict `user_id` filtering in MCP tools

## 3. Constitution Check

| Principle | Requirement | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **SDD Compliance** | Use T-300 series Task IDs | ✅ Required | Used T-301 (Research), T-302 (Data Model), T-303 (MCP Tools), T-304 (Agent), T-305 (Integration) |
| **Stateless Cloud-Native** | History persisted in DB, not in-memory | ✅ Required | SQLModel entities for Conversation/Message in data-model.md |
| **User Isolation** | MCP tools must accept and validate `user_id` | ✅ Required | All tools in contracts and quickstart accept user_id parameter |
| **Modern Python** | Python 3.13+ with strict type hints | ✅ Required | Following constitution guidelines in all implementations |
| **Reusable Intelligence** | Tools built as reusable MCP Skills | ✅ Required | MCP tools designed as reusable skills in quickstart guide |

## 4. Proposed File Structure

```text
hackathon-todo/
├── specs/
│   ├── 001-ai-chatbot/
│   │   ├── spec.md                 # Feature Specification
│   │   ├── plan.md                 # This file
│   │   ├── data-model.md           # Data model design
│   │   ├── research.md             # Research findings
│   │   └── contracts/              # API contracts
│   └── ...
├── mcp-server/
│   └── server.py                   # FastMCP Server defining Task tools
├── backend/
│   └── src/
│       ├── models.py               # Updated with Conversation & Message models
│       └── routes/
│           └── chat.py             # New chat endpoint with JWT protection
└── frontend/
    └── app/
        └── chat/
            └── page.tsx            # ChatKit integration page
```

## 5. Implementation Roadmap

### Phase 0: Research (T-301)
**Goal**: Use context7 MCP to resolve documentation for openai-agents and mcp.

**Action**: Verify the exact class signatures for Agent, Runner, and FastMCP to prevent version mismatch errors.

**Success Criteria**: Research.md with API signatures, integration patterns, and best practices documented.

### Phase 1: Database & Memory (T-302)
**Goal**: Enable the "Stateless" history requirement.

**Action**: Implement Conversation and Message SQLModel classes.

**Outcome**: A persistent thread for every user chat session.

**Success Criteria**: SQLModel entities created with proper relationships and validation.

### Phase 2: MCP Tool Development (T-303)
**Goal**: Give the AI "hands" to manipulate the database.

**Action**: Create tools: add_task, list_tasks, update_task, delete_task.

**Constraint**: Tools must perform direct DB operations filtered by the user's authenticated ID.

**Success Criteria**: MCP server with 4 task management tools that enforce user isolation.

### Phase 3: Agent Orchestration (T-304)
**Goal**: Create the "Brain" of the chatbot.

**Action**: Configure the OpenAI Agent with the system prompt and register the MCP tools.

**Urdu Support**: Add explicit instructions for bilingual (English/Urdu) intent handling.

**Success Criteria**: Agent that can process natural language and call appropriate tools.

### Phase 4: Integration & UI (T-305)
**Goal**: Connect the backend to the user.

**Action**: Create the /api/chat FastAPI route and build the ChatKit UI in Next.js.

**Auth**: Pass JWT tokens from ChatKit to ensure secure agentic sessions.

**Success Criteria**: Working chat interface that maintains conversation history.

## 6. Success Criteria Validation

**SC-301**: User can say "I need to buy milk" and see the task appear in the Phase II dashboard.

**SC-302**: Response time under 2 seconds for 90% of requests.

**SC-303**: Conversation history persists after browser refresh/server restart.

**SC-304**: Cross-user data access attempts are properly blocked.

**SC-305**: Frontend passes security checks for OpenAI platform.

**SC-306**: Code passes `uv` and `mypy` checks without errors.

**SC-307**: 95% of user intents correctly interpreted.

**SC-308**: Urdu language requests processed with 90% accuracy.

## 7. Risk Analysis

**Risk 1**: OpenAI Agents SDK version incompatibility
- **Mitigation**: Research phase will verify exact versions and signatures
- **Impact**: High - could cause integration failures

**Risk 2**: Performance issues with AI response times
- **Mitigation**: Proper caching and async processing
- **Impact**: Medium - affects user experience

**Risk 3**: Security vulnerabilities in MCP tools
- **Mitigation**: Strict user_id validation on all tools
- **Impact**: High - could allow cross-user data access

## 8. Dependencies

- OpenAI Python SDK
- FastMCP server
- SQLModel
- Better Auth (JWT)
- OpenAI ChatKit
- Neon PostgreSQL

---

## PROMPT_TEXT

```text
# Implementation Plan: Phase III - AI Todo Chatbot (Agentic Interface)

**Branch**: `003-ai-chatbot` | **Date**: 2026-01-30 | **Spec**: [01-ai-chatbot-spec.md](./01-ai-chatbot-spec.md)
**Tooling**: Claude Code + Context7 MCP (Documentation Guard)

## 1. Summary
Evolve the Todo application into an AI-native platform. This phase adds a conversational interface that allows users to manage their tasks through natural language. We utilize the **OpenAI Agents SDK** for orchestration, **FastMCP** for tool execution, and **OpenAI ChatKit** for a premium UI. All interactions remain stateless at the server level but are made persistent via the Neon PostgreSQL database.

## 2. Technical Context & Constraints
- **AI Engine**: OpenAI Agents SDK (Python)
- **Tool Protocol**: Model Context Protocol (MCP) using `FastMCP`
- **UI Framework**: OpenAI ChatKit (React Components)
- **Persistence Layer**: SQLModel with `Conversation` and `Message` tables
- **Doc Verification**: Use `context7` MCP to fetch latest SDK schemas for Agents and ChatKit
- **Security**: Mandatory JWT verification on `/api/chat` with strict `user_id` filtering in MCP tools

## 3. Constitution Check

| Principle | Requirement | Status |
| :--- | :--- | :--- |
| **SDD Compliance** | Use T-300 series Task IDs | ✅ Required |
| **Stateless Cloud-Native** | History persisted in DB, not in-memory | ✅ Required |
| **User Isolation** | MCP tools must accept and validate `user_id` | ✅ Required |
| **Modern Python** | Python 3.13+ with strict type hints | ✅ Required |
| **Reusable Intelligence** | Tools built as reusable MCP Skills | ✅ Required |

## 4. Proposed File Structure

```text
hackathon-todo/
├── phase-3/
│   ├── specs/
│   │   ├── 01-ai-chatbot-spec.md   # Feature Specification
│   │   └── 02-plan.md             # This file
│   ├── agents/
│   │   ├── todo_agent.py          # OpenAI Agent personality & logic
│   │   └── runner.py              # Stateless execution loop
│   └── mcp-server/
│       └── server.py              # FastMCP Server defining Task tools
├── backend/
│   └── src/
│       ├── models.py              # Updated with Conversation & Message models
│       └── routes/
│           └── chat.py            # New chat endpoint with JWT protection
└── frontend/
    └── app/
        └── chat/
            └── page.tsx           # ChatKit integration page
5. Implementation Roadmap
Phase 0: Research (T-301)
Goal: Use context7 MCP to resolve documentation for openai-agents and mcp.

Action: Verify the exact class signatures for Agent, Runner, and FastMCP to prevent version mismatch errors.

Phase 1: Database & Memory (T-302)
Goal: Enable the "Stateless" history requirement.

Action: Implement Conversation and Message SQLModel classes.

Outcome: A persistent thread for every user chat session.

Phase 2: MCP Tool Development (T-303)
Goal: Give the AI "hands" to manipulate the database.

Action: Create tools: add_task, list_tasks, update_task, delete_task.

Constraint: Tools must perform direct DB operations filtered by the user's authenticated ID.

Phase 3: Agent Orchestration (T-304)
Goal: Create the "Brain" of the chatbot.

Action: Configure the OpenAI Agent with the system prompt and register the MCP tools.

Urdu Support: Add explicit instructions for bilingual (English/Urdu) intent handling.

Phase 4: Integration & UI (T-305 - T-306)
Goal: Connect the backend to the user.

Action: Create the /api/chat FastAPI route and build the ChatKit UI in Next.js.

Auth: Pass JWT tokens from ChatKit to ensure secure agentic sessions.

6. Success Criteria Validation
SC-301: User can say "I need to buy milk" and see the task appear in the Phase II dashboard.

SC-302: Respons
```

## RESPONSE_TEXT

I'll help you execute the planning process for the AI Todo Chatbot feature. Let me start by setting up the planning environment and gathering the necessary context.

...

[Planning process completed with creation of plan.md, research.md, data-model.md, quickstart.md, and contract documents]