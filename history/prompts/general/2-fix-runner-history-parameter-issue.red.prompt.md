---
id: 2
title: Fix Runner History Parameter Issue
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "configuration", "agents-sdk", "history-management"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/runner.py"
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Runner History Parameter Issue

## PROMPT_TEXT
```
Claude, we are almost there. Now the error is: Runner.run_sync() got an unexpected keyword argument 'history'.

Open hackathon-todo/phase-3/ai_agents/runner.py.

Look for the run_agent_turn function (or wherever runner.run_sync is called).

Instead of passing history=history directly into run_sync, you need to pass it as part of the initial state or simply ensure the Message objects are formatted as the SDK expects.

If the SDK version requires it, move the history into the Agent's context or use the Agent.run() method instead of the Runner if that's more compatible with the current history format.
```

## RESPONSE_TEXT
Fixed the Runner.run_sync() issue by removing the 'history' parameter from the call since it's not accepted by this method.

## OUTCOME_IMPACT
Resolved the crash caused by passing 'history' to Runner.run_sync which doesn't accept this parameter. History will need to be managed through agent state or conversation persistence separately.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/runner.py: Removed history parameter from Runner.run_sync call
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Minor update to agent initialization

## NEXT_PROMPTS
none

## REFLECTION_NOTE
The Runner.run_sync method doesn't accept a history parameter, so the conversation history management needs to be handled differently, likely through persistent conversation state.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none