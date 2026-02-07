import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel
from agents.mcp import MCPServerStdio

# --- BULLETPROOF PATH SETUP ---
# Detect root directory regardless of environment (Local vs HF Docker)
def get_project_root():
    # Try the HF Home directory first
    hf_path = Path("/home/user/app")
    if hf_path.exists():
        return hf_path
    
    # Try the standard Docker /app
    docker_path = Path("/app")
    if docker_path.exists():
        return docker_path
    
    # Local Fallback: Move up from this file until we find the root
    return Path(__file__).resolve().parent.parent.parent.parent

BASE_DIR = get_project_root()
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

# --- LOCATE SERVER SCRIPT ---
# We use a search to be safe. It looks for server.py in common locations.
possibilities = [
    BASE_DIR / "phase-3" / "mcp_server" / "server.py",
    BASE_DIR / "mcp_server" / "server.py",
    BASE_DIR / "src" / "mcp_server" / "server.py"
]

SERVER_SCRIPT = next((p for p in possibilities if p.exists()), possibilities[0])

# Debugging logs for Hugging Face Console
print(f"🚀 PROJECT ROOT: {BASE_DIR}")
print(f"🚀 MCP SERVER PATH: {SERVER_SCRIPT}")
print(f"🚀 SERVER EXISTS: {SERVER_SCRIPT.exists()}")

# Global server definition
shared_mcp_server = MCPServerStdio(
    name="todo-mcp-server",
    params={
        "command": sys.executable, 
        "args": [str(SERVER_SCRIPT)],
        "env": {
            **os.environ, 
            "PYTHONPATH": str(BASE_DIR),
            "PYTHONUNBUFFERED": "1"
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
        
        self.model = OpenAIChatCompletionsModel(
            model="gemini-2.5-flash", 
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
                "4. If a tool call times out, tell the user the database is busy and to try again in a few seconds.\n"
                "5. If a tool fails, explain that you are connected but the specific command encountered an error."
            ),
            model=self.model,
            mcp_servers=[shared_mcp_server]
        )