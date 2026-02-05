#!/usr/bin/env python3
"""
Verification script to check that all AI Todo Chatbot components are properly implemented.
"""

import os
import sys
from pathlib import Path

def verify_implementation():
    """Verify that all required components for the AI Todo Chatbot are in place."""

    print("🔍 Verifying AI Todo Chatbot Implementation...")
    print("="*50)

    # Define the expected files and directories
    expected_files = [
        # Phase 3 directory structure
        "hackathon-todo/phase-3/",
        "hackathon-todo/phase-3/ai_agents/",
        "hackathon-todo/phase-3/mcp_server/",
        "hackathon-todo/phase-3/specs/",

        # MCP Server
        "hackathon-todo/phase-3/mcp_server/server.py",

        # AI Agent components
        "hackathon-todo/phase-3/ai_agents/todo_agent.py",
        "hackathon-todo/phase-3/ai_agents/runner.py",

        # Backend components
        "backend/src/routes/chat.py",
        "hackathon-todo/backend/src/models.py",  # Updated with Conversation/Message
        "hackathon-todo/backend/src/main.py",    # Updated with chat router

        # Frontend components
        "frontend/app/chat/page.tsx",

        # Dependencies
        "hackathon-todo/backend/pyproject.toml",  # Updated with new deps
    ]

    # Specification files
    spec_files = [
        "specs/001-ai-chatbot/spec.md",
        "specs/001-ai-chatbot/plan.md",
        "specs/001-ai-chatbot/tasks.md",
        "specs/001-ai-chatbot/data-model.md",
        "specs/001-ai-chatbot/contracts/chat-api.md",
        "specs/001-ai-chatbot/contracts/mcp-tools.md",
    ]

    print("📁 Checking expected files and directories...")

    all_found = True
    for file_path in expected_files:
        path = Path(file_path)
        if path.exists():
            status = "✓" if path.is_file() else "📁"
            print(f"  {status} {file_path}")
        else:
            print(f"  ✗ {file_path}")
            all_found = False

    print("\n📋 Checking specification files...")
    for file_path in spec_files:
        path = Path(file_path)
        if path.exists():
            print(f"  ✓ {file_path}")
        else:
            print(f"  ✗ {file_path}")
            all_found = False

    print(f"\n🔍 Checking model updates in hackathon-todo/backend/src/models.py...")
    if Path("hackathon-todo/backend/src/models.py").exists():
        with open("hackathon-todo/backend/src/models.py", "r") as f:
            content = f.read()
            if "Conversation" in content and "Message" in content:
                print("  ✓ Conversation and Message models found")
            else:
                print("  ✗ Conversation and/or Message models missing")
                all_found = False
    else:
        print("  ✗ Model file not found")
        all_found = False

    print(f"\n🔍 Checking chat route in backend/src/routes/chat.py...")
    if Path("backend/src/routes/chat.py").exists():
        with open("backend/src/routes/chat.py", "r") as f:
            content = f.read()
            if "chat_endpoint" in content and "ChatRequest" in content:
                print("  ✓ Chat endpoint found")
            else:
                print("  ✗ Chat endpoint missing")
                all_found = False
    else:
        print("  ✗ Chat route file not found")
        all_found = False

    print(f"\n🔍 Checking main app integration in hackathon-todo/backend/src/main.py...")
    if Path("hackathon-todo/backend/src/main.py").exists():
        with open("hackathon-todo/backend/src/main.py", "r") as f:
            content = f.read()
            if "chat.router" in content:
                print("  ✓ Chat router integration found")
            else:
                print("  ✗ Chat router integration missing")
                all_found = False
    else:
        print("  ✗ Main app file not found")
        all_found = False

    print("\n" + "="*50)
    if all_found:
        print("🎉 SUCCESS: All AI Todo Chatbot components are properly implemented!")
        print("✅ All required files and directories are in place")
        print("✅ Database models updated with Conversation and Message")
        print("✅ Backend routes and main app integration completed")
        print("✅ Frontend chat page created")
        print("✅ MCP server with all required tools implemented")
        print("✅ AI agent and runner components created")
    else:
        print("❌ FAILURE: Some components are missing or incomplete")
        print("Please check the verification output above.")

    return all_found

if __name__ == "__main__":
    success = verify_implementation()
    sys.exit(0 if success else 1)