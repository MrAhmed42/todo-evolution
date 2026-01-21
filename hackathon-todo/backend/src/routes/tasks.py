from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from ..db import get_session
from ..models import Task, TaskCreate, TaskUpdate, User
from ..auth import verify_jwt

router = APIRouter()


@router.get("/users/{user_id}/tasks", response_model=List[Task])
def get_tasks(
    user_id: str,
    status_param: Optional[str] = None,  # "all", "pending", "completed"
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Get all tasks for a specific user"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Build query based on status parameter
    query = select(Task).where(Task.user_id == user_id)

    if status_param == "pending":
        query = query.where(Task.completed == False)
    elif status_param == "completed":
        query = query.where(Task.completed == True)

    tasks = session.exec(query).all()
    return tasks


@router.post("/users/{user_id}/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_create: TaskCreate,
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Create a new task for a specific user"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Verify that the user exists
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create task
    task = Task(
        user_id=user_id,
        title=task_create.title,
        description=task_create.description,
        completed=False  # Default to not completed
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/users/{user_id}/tasks/{id}", response_model=Task)
def get_task(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Get a specific task for a user"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Get task
    task = session.exec(
        select(Task).where(Task.id == id).where(Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/users/{user_id}/tasks/{id}", response_model=Task)
def update_task(
    user_id: str,
    id: int,
    task_update: TaskUpdate,
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Update a specific task for a user"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Get task
    task = session.exec(
        select(Task).where(Task.id == id).where(Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update task fields that are provided
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    # Update the updated_at timestamp
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.patch("/users/{user_id}/tasks/{id}/complete", response_model=Task)
def toggle_task_completion(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Toggle the completion status of a specific task"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Get task
    task = session.exec(
        select(Task).where(Task.id == id).where(Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/users/{user_id}/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    id: int,
    current_user: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    """Delete a specific task for a user"""
    # Verify that the token user_id matches the URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    # Get task
    task = session.exec(
        select(Task).where(Task.id == id).where(Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Delete task
    session.delete(task)
    session.commit()

    # Return 204 No Content
    return