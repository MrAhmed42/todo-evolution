---
id: 7
title: Fix Typing Union Conflict Bypass with Raw Functions
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "typing-conflict", "raw-functions", "sdk-compatibility"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Typing Union Conflict Bypass with Raw Functions

## PROMPT_TEXT
```
Claude, we are still stuck on the typing.Union error in todo_agent.py. It seems AgentTool and Tool are being imported as types, not classes.

Let's bypass this by changing the Agent setup:

In hackathon-todo/phase-3/ai_agents/todo_agent.py, remove all imports of Tool or AgentTool.

Instead of wrapping functions in a class, define your tools as a simple list of functions: tools = [add_task, get_tasks, delete_task, update_task].

Ensure each of these functions has a clear docstring (the text inside """ """), as the SDK uses that to explain the tool to Gemini.

In the Agent or AgentRunner constructor, pass this list of raw functions to the tools parameter.

If the SDK requires a specific wrapper class, look at the official documentation for the version installed and find the correct import path that is NOT from a types.py or __init__.py that defines them as Unions.
```

## RESPONSE_TEXT
Fixed the typing.Union error by bypassing the Tool wrapper and using raw functions directly, as the Agent SDK should handle properly decorated functions from the MCP server.

## OUTCOME_IMPACT
Resolved the typing conflict by using raw functions instead of trying to wrap them with conflicting Tool class.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Removed Tool wrapper and used raw functions

## NEXT_PROMPTS
none

## REFLECTION_NOTE
Bypassed the typing.Union conflict by using raw functions that are already properly decorated by the MCP server.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none