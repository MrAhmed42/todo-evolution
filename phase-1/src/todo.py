"""TodoManager for in-memory task CRUD operations."""

from typing import Optional

from src.models import Task


class TodoManager:
    """Manages a collection of tasks in memory."""

    def __init__(self) -> None:
        """Initialize the TodoManager with empty task list."""
        self.tasks: list[Task] = []
        self.next_id: int = 1

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Add a new task with the given title and optional description.

        Args:
            title: The task title (non-empty, 1-200 chars).
            description: Optional task description (max 500 chars).

        Returns:
            The newly created Task.
        """
        task = Task(
            id=self.next_id,
            title=title,
            description=description,
        )
        self.tasks.append(task)
        self.next_id += 1
        return task

    def list_tasks(self) -> list[Task]:
        """Return all tasks in the list.

        Returns:
            List of all tasks.
        """
        return self.tasks.copy()

    def get_task(self, id: int) -> Optional[Task]:
        """Get a task by its ID.

        Args:
            id: The task ID to find.

        Returns:
            The Task if found, None otherwise.
        """
        for task in self.tasks:
            if task.id == id:
                return task
        return None

    def update_task(
        self,
        id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Optional[Task]:
        """Update an existing task's title and/or description.

        Args:
            id: The task ID to update.
            title: New title (if provided).
            description: New description (if provided).

        Returns:
            The updated Task if found, None otherwise.
        """
        task = self.get_task(id)
        if task is None:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        return task

    def delete_task(self, id: int) -> bool:
        """Delete a task by its ID.

        Args:
            id: The task ID to delete.

        Returns:
            True if task was deleted, False if not found.
        """
        for i, task in enumerate(self.tasks):
            if task.id == id:
                del self.tasks[i]
                return True
        return False

    def toggle_task(self, id: int) -> Optional[Task]:
        """Toggle a task's completed status.

        Args:
            id: The task ID to toggle.

        Returns:
            The toggled Task if found, None otherwise.
        """
        task = self.get_task(id)
        if task is None:
            return None
        task.completed = not task.completed
        return task
