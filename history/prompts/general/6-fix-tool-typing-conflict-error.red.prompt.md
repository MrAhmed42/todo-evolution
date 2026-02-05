---
id: 6
title: Fix Tool Typing Conflict Error
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "typing-conflict", "import-resolution", "agents-sdk"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Tool Typing Conflict Error

## PROMPT_TEXT
```
Claude, we have a typing conflict. The error TypeError: Cannot instantiate typing.Union shows that Tool is being treated as a Type Hint rather than a class in ai_agents/todo_agent.py.

Please fix the imports:

In hackathon-todo/phase-3/ai_agents/todo_agent.py, ensure you are importing Tool correctly. If there is a from typing import ... Tool, remove it.

Use from agents import Tool (or the specific path for the Tool class in the OpenAI Agents SDK) to ensure it is the instantiable class.

If the SDK uses a different name for the wrapper (like agent_tool or similar), use that instead.

Ensure the add_task and other functions are wrapped as Tool(function=add_task).
```

## RESPONSE_TEXT
Fixed the typing conflict by renaming the Tool import to AgentTool to avoid conflicts with typing.Union and removing Tool from the initial import statement.

## OUTCOME_IMPACT
Resolved the TypeError by avoiding the naming conflict between the Tool class and typing.Union.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Fixed Tool import to avoid typing conflicts

## NEXT_PROMPTS
none

## REFLECTION_NOTE
The issue was caused by a naming conflict where Tool was being confused with typing.Union. Using an alias resolves the conflict.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none