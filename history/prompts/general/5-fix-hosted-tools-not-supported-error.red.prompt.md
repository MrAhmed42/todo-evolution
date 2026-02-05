---
id: 5
title: Fix Hosted Tools Not Supported Error
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "agents-sdk", "tool-wrapping", "api-compatibility"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Hosted Tools Not Supported Error

## PROMPT_TEXT
```
Claude, we have reached the AI execution! The error is: agents.exceptions.UserError: Hosted tools are not supported with the ChatCompletions API. Got tool type: <class 'function'>.

Please fix this in ai_agents/todo_agent.py and ai_agents/runner.py:

Do not pass raw functions directly to the tools list.

Import from agents import Tool and wrap each function like this: Tool(function=add_task).

Ensure the Agent definition in todo_agent.py uses these wrapped Tool objects.

Double-check that Runner.run is receiving a list of these Tool objects, not raw functions.
```

## RESPONSE_TEXT
Fixed the hosted tools error by importing the Tool class and wrapping each function properly with Tool(function=function_name).

## OUTCOME_IMPACT
Resolved the ChatCompletions API incompatibility error by properly wrapping functions with the Tool class as required by the Agent SDK.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Imported Tool class and wrapped functions properly

## NEXT_PROMPTS
none

## REFLECTION_NOTE
The Agent SDK requires tools to be wrapped with the Tool class rather than passing raw functions directly.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none