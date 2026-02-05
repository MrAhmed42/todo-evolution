---
id: 4
title: Fix Function Name Attribute Error
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "agents-sdk", "function-attributes", "tool-formatting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Function Name Attribute Error

## PROMPT_TEXT
```
Claude, we've moved past the event loop error! Now the error is: 'function' object has no attribute 'name'.

Please fix this in the AI logic:

In hackathon-todo/phase-3/ai_agents/todo_agent.py, check how the tools are passed to the Agent or AgentRunner.

Ensure each tool (like add_task, delete_task, etc.) is correctly defined. If the SDK requires it, wrap the functions using the Tool class or ensure they have proper docstrings.

Make sure you aren't passing the function call (e.g., get_tasks()) but the function reference (e.g., get_tasks).

Ensure the name attribute is explicitly set if the SDK version you're using doesn't extract it automatically from the function definition.
```

## RESPONSE_TEXT
Fixed the 'function' object has no attribute 'name' error by ensuring each tool function has the required 'name' attribute for the Agent SDK.

## OUTCOME_IMPACT
Resolved the function name attribute error by properly assigning the 'name' attribute to each tool function before passing to the Agent SDK.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Added attribute assignment to ensure functions have name attribute

## NEXT_PROMPTS
none

## REFLECTION_NOTE
The Agent SDK requires tool functions to have a 'name' attribute, which was missing from the MCP server functions. This was resolved by ensuring the attribute exists.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none