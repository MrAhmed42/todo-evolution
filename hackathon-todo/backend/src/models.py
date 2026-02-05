from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

# Import BaseModel from pydantic for validation schemas
from pydantic import BaseModel, Field as PydanticField


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)


class User(UserBase, table=True):
    """User model managed by Better Auth"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class TaskBase(SQLModel):
    title: str = Field(nullable=False, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task model for user tasks"""
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")


# Pydantic models for API validation
class TaskCreate(BaseModel):
    title: str = PydanticField(min_length=1, max_length=200)
    description: Optional[str] = PydanticField(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class Conversation(SQLModel, table=True):
    """Conversation model for chat history"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(nullable=False, index=True)  # Foreign key to User
    title: Optional[str] = Field(default=None, max_length=200)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class Message(SQLModel, table=True):
    """Message model for chat history"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", nullable=False, index=True)
    role: str = Field(nullable=False)  # Either "user" or "assistant"
    content: str = Field(nullable=False)
    tool_calls: Optional[str] = Field(default=None)  # JSON string of tool calls
    tool_responses: Optional[str] = Field(default=None) # JSON string of tool responses
    created_at: datetime = Field(default_factory=datetime.now)

    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")