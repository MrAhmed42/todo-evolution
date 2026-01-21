"""CLI interface for the Todo application."""

from typing import Optional

from src.models import Task
from src.todo import TodoManager


def get_valid_title() -> str:
    """Get a valid task title from user input.

    Returns:
        A non-empty string between 1-200 characters.
    """
    while True:
        title = input("Enter task title: ").strip()
        if 1 <= len(title) <= 200:
            return title
        print("Title must be 1-200 characters. Please try again.")


def get_optional_description() -> str | None:
    """Get an optional task description from user input.

    Returns:
        A string up to 500 characters, or None if empty.
    """
    desc = input("Enter description (optional, press Enter to skip): ").strip()
    if not desc:
        return None
    if len(desc) > 500:
        print("Description truncated to 500 characters.")
        return desc[:500]
    return desc


def format_task(task: Task) -> str:
    """Format a task for display.

    Args:
        task: The Task to format.

    Returns:
        Formatted string representation.
    """
    status = "[✓]" if task.completed else "[ ]"
    lines = [f"{task.id}. {status} {task.title}"]
    if task.description:
        lines.append(f"   {task.description}")
    return "\n".join(lines)


def main() -> None:
    """Main CLI loop for the Todo application."""
    manager = TodoManager()

    while True:
        print("\n=== Todo Menu ===")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Update Task")
        print("4. Delete Task")
        print("5. Toggle Complete")
        print("6. Exit")

        choice = input("Choose an option: ").strip()

        if choice == "1":
            # Add Task
            title = get_valid_title()
            description = get_optional_description()
            task = manager.add_task(title, description)
            print(f"Task #{task.id} added")
        elif choice == "2":
            # View Tasks
            tasks = manager.list_tasks()
            if not tasks:
                print("No tasks found")
            else:
                for task in tasks:
                    print(format_task(task))
        elif choice == "3":
            # Update Task
            try:
                task_id = int(input("Enter task ID: "))
            except ValueError:
                print("Error: Invalid task ID")
                continue

            task_to_update: Optional[Task] = manager.get_task(task_id)
            if task_to_update is None:
                print(f"Error: Task #{task_id} not found")
                continue

            # Title update
            new_title_input = input(
                f"Enter new title (press Enter to keep '{task_to_update.title}'): "
            ).strip()
            new_title: Optional[str] = None if not new_title_input else new_title_input

            # Description update
            new_desc_input = input(
                "Enter new description (press Enter to keep): "
            ).strip()
            new_desc: Optional[str] = None if not new_desc_input else new_desc_input

            updated = manager.update_task(task_id, new_title, new_desc)
            if updated:
                print(f"Task #{task_id} updated")
        elif choice == "4":
            # Delete Task
            try:
                task_id = int(input("Enter task ID: "))
            except ValueError:
                print("Error: Invalid task ID")
                continue

            task_to_delete: Optional[Task] = manager.get_task(task_id)
            if task_to_delete is None:
                print(f"Error: Task #{task_id} not found")
                continue

            confirm = input("Are you sure? (y/n): ").strip().lower()
            if confirm == "y":
                if manager.delete_task(task_id):
                    print(f"Task #{task_id} deleted")
            else:
                print("Deletion cancelled")
        elif choice == "5":
            # Toggle Complete
            try:
                task_id = int(input("Enter task ID: "))
            except ValueError:
                print("Error: Invalid task ID")
                continue

            toggled_task: Optional[Task] = manager.toggle_task(task_id)
            if toggled_task is None:
                print(f"Error: Task #{task_id} not found")
            elif toggled_task.completed:
                print(f"Task #{task_id} marked as complete")
            else:
                print(f"Task #{task_id} marked as incomplete")
        elif choice == "6":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1-6.")


if __name__ == "__main__":
    main()
