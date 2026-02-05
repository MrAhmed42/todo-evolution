---
id: 1
title: Fix RunConfig Tools Parameter Issue
stage: red
date: "2026-02-02"
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-chatbot
user: user
command: manual-fix
labels: ["bug-fix", "configuration", "agents-sdk", "mcp-tools"]
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

# Fix RunConfig Tools Parameter Issue

## PROMPT_TEXT
```
Claude, we've reached the backend, but the agent is crashing with: RunConfig.__init__() got an unexpected keyword argument 'tools'.

Open hackathon-todo/phase-3/ai_agents/runner.py.

Look for where RunConfig is being created. Remove the tools=[...] argument from RunConfig.

Instead, ensure the tools are passed directly to the Agent constructor in todo_agent.py or provided as a list when calling the agent's run method.

While you are there, check hackathon-todo/phase-3/ai_agents/todo_agent.py to make sure the TodoAgent is correctly registered with its tools.
```

## RESPONSE_TEXT
Fixed the RunConfig initialization issue by removing the 'tools' parameter from RunConfig and instead adding the tools to the Agent constructor in todo_agent.py.

## OUTCOME_IMPACT
Resolved the crash caused by passing 'tools' to RunConfig which doesn't accept this parameter. Tools are now properly registered with the Agent instance.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- Modified hackathon-todo/phase-3/ai_agents/runner.py: Removed tools parameter from RunConfig
- Modified hackathon-todo/phase-3/ai_agents/todo_agent.py: Added tools to Agent constructor

## NEXT_PROMPTS
none

## REFLECTION_NOTE
The issue was that RunConfig and Agent have different interfaces - RunConfig doesn't accept tools parameter but Agent does. Moving tools to the right place fixed the initialization error.

## FAILURE MODES OBSERVED
none

## NEXT EXPERIMENT TO IMPROVE PROMPT QUALITY
none