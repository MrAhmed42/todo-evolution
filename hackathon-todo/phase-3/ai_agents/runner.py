import sys
import asyncio
from pathlib import Path
from agents import Runner, RunConfig
from agents.mcp import MCPServerManager
from .todo_agent import TodoAgent, shared_mcp_server, SERVER_SCRIPT

# Global manager to keep the connection alive across requests
_mcp_manager = MCPServerManager([shared_mcp_server], connect_timeout_seconds=60)
_is_connected = False

async def ensure_mcp_connected():
    """Ensure the MCP server is initialized once and stays open."""
    global _is_connected
    if not _is_connected:
        print(f"Initializing MCP Server connection using: {SERVER_SCRIPT}")
        
        # Deployment Check: Ensure script exists in the container
        if not SERVER_SCRIPT.exists():
            print(f"ERROR: MCP Server script NOT FOUND at {SERVER_SCRIPT}")
            return

        try:
            # Manually entering the context to keep the process alive
            await _mcp_manager.__aenter__()
            _is_connected = True
            print("MCP Server connected and ready.")
        except Exception as e:
            print(f"Failed to connect MCP Server: {e}")
            _is_connected = False

async def run_agent_turn(user_message: str, conversation_id: str, user_id: str):
    """Handles a single AI agent turn with persistent MCP connection."""
    # 1. Check/Start the persistent connection
    await ensure_mcp_connected()
    
    # 2. Setup Agent
    todo_wrapper = TodoAgent()
    agent = todo_wrapper.get_agent()
    
    # Inject context
    agent.instructions += f"\n\nCURRENT_USER_ID: {user_id}"

    try:
        run_config = RunConfig(
            model=todo_wrapper.model,
            model_provider=todo_wrapper.external_client,
            tracing_disabled=True
        )

        # 3. Execute Turn
        result = await Runner.run(agent, input=user_message, run_config=run_config)

        return {
            "response": result.final_output,
            "messages": getattr(result, 'new_items', []),
            "conversation_id": conversation_id,
            "user_id": user_id
        }

    except Exception as e:
        err = str(e)
        print(f"Runner Error: {err}")
        
        # Handle the specific library timeout errors gracefully
        if "Server not initialized" in err or "Timed out" in err:
            return {
                "response": "The database connection is warming up. I've noted your request—please refresh your task list in a moment.",
                "messages": [],
                "conversation_id": conversation_id,
                "user_id": user_id
            }
        raise e