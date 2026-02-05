import sys
import os
from pathlib import Path
from fastmcp import FastMCP

# Path setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

mcp = FastMCP("Todo-Server")

@mcp.tool()
async def add_new_task(user_id: str, title: str, description: str = "Added via AI") -> str:
    """Add a new task. Requires user_id and title."""
    from sqlmodel import Session
    from backend.src.models import Task
    from backend.src.db import engine
    try:
        with Session(engine) as session:
            task = Task(user_id=user_id, title=title, description=description, completed=False)
            session.add(task)
            session.commit()
            return f"Success: '{title}' added."
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
async def list_tasks(user_id: str) -> str:
    """List all tasks for a specific user. Shows ID, Status, and Title."""
    from sqlmodel import Session, select
    from backend.src.models import Task
    from backend.src.db import engine
    try:
        with Session(engine) as session:
            statement = select(Task).where(Task.user_id == user_id)
            tasks = session.exec(statement).all()
            if not tasks: return "No tasks found."
            return "\n".join([f"ID: {t.id} | [{'X' if t.completed else ' '}] {t.title}" for t in tasks])
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
async def mark_task_complete(user_id: str, task_id: int) -> str:
    """Mark a task as completed. Requires user_id and task_id."""
    from sqlmodel import Session, select
    from backend.src.models import Task
    from backend.src.db import engine
    try:
        with Session(engine) as session:
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = session.exec(statement).first()
            if not task: return f"Task with ID {task_id} not found for this user."
            task.completed = True
            session.add(task)
            session.commit()
            return f"Success: Task '{task.title}' marked as complete."
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
async def delete_task(user_id: str, task_id: int) -> str:
    """Permanently delete a task. Requires user_id and task_id."""
    from sqlmodel import Session, select
    from backend.src.models import Task
    from backend.src.db import engine
    try:
        with Session(engine) as session:
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = session.exec(statement).first()
            if not task: return f"Task with ID {task_id} not found."
            session.delete(task)
            session.commit()
            return f"Success: Task '{task.title}' has been deleted."
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
async def update_task_title(user_id: str, task_id: int, new_title: str) -> str:
    """Update the title of an existing task."""
    from sqlmodel import Session, select
    from backend.src.models import Task
    from backend.src.db import engine
    try:
        with Session(engine) as session:
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = session.exec(statement).first()
            if not task: return f"Task with ID {task_id} not found."
            old_title = task.title
            task.title = new_title
            session.add(task)
            session.commit()
            return f"Success: Updated task '{old_title}' to '{new_title}'."
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    mcp.run()