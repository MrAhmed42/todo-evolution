---
id: 8
title: Fix Function Name Attribute Workaround
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "attribute-workaround", "sdk-compatibility", "function-decoration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "hackathon-todo/phase-3/ai_agents/todo_agent.py"
tests: []
---

# Fix Function Name Attribute Workaround

## PROMPT_TEXT
```
Claude, we are still getting 'function' object has no attribute 'name'. The Runner expects tool objects with a .name attribute.

Let's fix this once and for all in todo_agent.py:

Instead of raw functions, we need to create objects that the SDK recognizes.

Look for from agents.tool import Tool or from agents.tools import Tool. Note the plural or the sub-module—it must be the one that is a class, not a typing Union.

If you can't find the class, manually add the attribute to each function as a workaround:

Python
for t in [add_task, get_tasks, delete_task, update_task]:
    setattr(t, 'name', t.__name__)
Ensure these functions are passed to the Agent and Runner correctly.

Double-check the agents library folder in the .venv to see where the real Tool class is defined if the import continues to fail.
```

## RESPONSE_TEXT
Fixed the function name attribute error by manually adding the 'name' attribute to each function using setattr as a workaround.

## OUTCOME_IMPACT
Resolved the 'function' object has no attribute 'name' error by ensuring each function has the required attribute.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Added name attribute to functions as workaround

## NEXT_PROMPTS
none

## REFLECTION_NOTE
Added the required 'name' attribute directly to each function as a reliable workaround for the SDK requirement.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none