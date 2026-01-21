"""Task data models for the Todo CLI application."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Task(BaseModel):
    """Represents a todo item in the CLI application."""

    id: int = Field(..., ge=1, description="Unique positive integer identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(
        default=None, max_length=500, description="Optional task description"
    )
    completed: bool = Field(default=False, description="Task completion status")
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Creation timestamp"
    )

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        """Reject whitespace-only titles after stripping."""
        if not v.strip():
            raise ValueError("title cannot be empty or whitespace only")
        return v.strip()
