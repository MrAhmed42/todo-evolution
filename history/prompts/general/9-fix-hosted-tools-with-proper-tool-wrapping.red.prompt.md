---
id: 9
title: Fix Hosted Tools with Proper Tool Wrapping
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "tool-wrapping", "sdk-compatibility", "proper-attributes"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Hosted Tools with Proper Tool Wrapping

## PROMPT_TEXT
```
Claude, we are stuck in a loop with the agents SDK. Raw functions are being misidentified as 'Hosted tools'.

Please apply this specific fix in hackathon-todo/phase-3/ai_agents/todo_agent.py:

Import the Tool class specifically from the core logic: from agents import Tool.

For every tool (add_task, get_tasks, etc.), wrap it exactly like this:

Python
Tool(
    function=add_task,
    name="add_task",
    description="Add a new task to the todo list"
)
Do not use AgentTool or any other alias.

Ensure the Agent is initialized with this list of Tool objects.

In runner.py, make sure Runner.run receives these same Tool objects.

If the error persists, Claude, check the .venv/Lib/site-packages/agents/ folder to find the tool.py file and see the exact class definition for local function execution.
```

## RESPONSE_TEXT
Fixed the hosted tools error by importing Tool from agents and properly wrapping each function with name and description attributes.

## OUTCOME_IMPACT
Resolved the 'Hosted tools' identification error by using proper Tool wrapper with required attributes.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Imported Tool and wrapped functions properly

## NEXT_PROMPTS
none

## REFLECTION_NOTE
Properly wrapped functions with Tool class including name and description attributes to satisfy the SDK requirements.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none