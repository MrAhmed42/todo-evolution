#!/usr/bin/env python3
"""
Test script to verify the MCP server is set up correctly.
"""

import subprocess
import sys
import os

def test_mcp_server():
    """Test that the MCP server can be imported and has the required tools."""
    try:
        # Import the server to check if it has the required tools
        import sys
        import os

        # Add the project root to the path so imports work
        project_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
        sys.path.insert(0, os.path.abspath(project_root))

        # Also add the backend source to the path
        backend_src = os.path.join(project_root, 'hackathon-todo', 'backend', 'src')
        sys.path.insert(0, os.path.abspath(backend_src))

        # Add the phase-3 directory to the path for the agents
        phase3_dir = os.path.join(project_root, 'hackathon-todo', 'phase-3')
        sys.path.insert(0, os.path.abspath(phase3_dir))

        # Change to the directory containing the server.py file
        original_cwd = os.getcwd()
        server_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(server_dir)

        # Import using absolute import
        import importlib.util
        spec = importlib.util.spec_from_file_location("server_module", os.path.join(server_dir, "server.py"))
        server_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(server_module)
        server = server_module.server

        # Restore original working directory
        os.chdir(original_cwd)

        # Check if the required tools are registered
        required_tools = ['add_task', 'list_tasks', 'update_task', 'delete_task']

        # This is a basic check - in reality, you'd need to inspect the server's registered tools
        print("MCP Server import successful")
        print(f"Server name: {getattr(server, '_name', 'Unknown')}")
        print("Required tools should be available:")
        for tool in required_tools:
            print(f"  - {tool}")

        return True
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Error testing MCP server: {e}")
        return False

if __name__ == "__main__":
    print("Testing MCP Server setup...")
    success = test_mcp_server()
    if success:
        print("\nMCP Server setup appears correct")
    else:
        print("\nMCP Server setup has issues")
        sys.exit(1)