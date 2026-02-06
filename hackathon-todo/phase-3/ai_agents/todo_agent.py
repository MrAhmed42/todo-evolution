# import os
# import sys
# from pathlib import Path
# from dotenv import load_dotenv
# from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel
# from agents.mcp import MCPServerStdio

# # Path Setup
# BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
# load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

# SERVER_SCRIPT = Path(__file__).resolve().parent.parent / "mcp_server" / "server.py"

# # Global server definition
# shared_mcp_server = MCPServerStdio(
#     name="todo-mcp-server",
#     params={
#         "command": sys.executable,
#         "args": [str(SERVER_SCRIPT)],
#         "env": {**os.environ, "PYTHONPATH": str(BASE_DIR)}
#     }
# )

# class TodoAgent:
#     def __init__(self):
#         self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
#         self.external_client = AsyncOpenAI(
#             api_key=self.api_key,
#             base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
#         )
#         # Using gemini-2.0-flash (Stable)
#         self.model = OpenAIChatCompletionsModel(
#             model="gemini-2.5-flash", 
#             openai_client=self.external_client
#         )

#     def get_agent(self):
#         """Returns the Agent instance configured with the shared MCP server."""
#         return Agent(
#             name="Todo Assistant",
#             instructions=(
#                 "You are a professional task manager. You have tools to add, list, update, complete, and delete tasks.\n\n"
#                 "CRITICAL RULES:\n"
#                 "1. ALWAYS use the provided CURRENT_USER_ID for every tool call.\n"
#                 "2. If a user asks to update, complete, or delete a task but doesn't provide an ID, "
#                 "use 'list_tasks' first to find the correct ID.\n"
#                 "3. When listing tasks, show them clearly to the user.\n"
#                 "4. If a tool call times out but you suspect it succeeded, tell the user to refresh their list."
#             ),
#             model=self.model,
#             mcp_servers=[shared_mcp_server]
#         )


# -------------

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel
from agents.mcp import MCPServerStdio

# Path Setup - Adjusted for Docker/HF Structure
# Usually in HF, the root is /app
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

# Explicitly locate the MCP server script
SERVER_SCRIPT = Path(__file__).resolve().parent.parent / "mcp_server" / "server.py"

# Global server definition
shared_mcp_server = MCPServerStdio(
    name="todo-mcp-server",
    params={
        "command": sys.executable, # Uses the exact python binary running the app
        "args": [str(SERVER_SCRIPT)],
        "env": {
            **os.environ, 
            "PYTHONPATH": str(BASE_DIR),
            "PYTHONUNBUFFERED": "1" # Force logs to show in HF Container logs
        }
    }
)

class TodoAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.external_client = AsyncOpenAI(
            api_key=self.api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        # Using gemini-2.0-flash (Stable)
        self.model = OpenAIChatCompletionsModel(
            model="gemini-2.0-flash", # Note: Changed 2.5 to 2.0 to avoid potential model errors
            openai_client=self.external_client
        )

    def get_agent(self):
        """Returns the Agent instance configured with the shared MCP server."""
        return Agent(
            name="Todo Assistant",
            instructions=(
                "You are a professional task manager. You have tools to add, list, update, complete, and delete tasks.\n\n"
                "CRITICAL RULES:\n"
                "1. ALWAYS use the provided CURRENT_USER_ID for every tool call.\n"
                "2. If a user asks to update, complete, or delete a task but doesn't provide an ID, "
                "use 'list_tasks' first to find the correct ID.\n"
                "3. When listing tasks, show them clearly to the user.\n"
                "4. If a tool call times out but you suspect it succeeded, tell the user to refresh their list."
            ),
            model=self.model,
            mcp_servers=[shared_mcp_server]
        )