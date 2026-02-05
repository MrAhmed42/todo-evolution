# Quickstart Guide: AI Todo Chatbot

## Overview
This guide walks you through setting up the AI Todo Chatbot that allows users to manage tasks through natural language.

## Prerequisites
- Python 3.13+
- Node.js 18+
- OpenAI API key
- Existing Phase I & II setup (SQLModel, Better Auth)

## Setup Steps

### 1. Install Dependencies

```bash
# Backend dependencies
pip install openai mcp-use

# Frontend dependencies
cd frontend
npm install @openai/chatkit-react
```

### 2. Create MCP Server

Create `mcp_server/server.py`:

```python
from mcp_use.server import MCPServer
from sqlmodel import Session, select
from backend.src.models import Task, engine
import json

server = MCPServer(
    name="todo-mcp-server",
    version="1.0.0",
    instructions="MCP server for todo management tools",
    debug=True,
)

@server.tool()
def add_task(title: str, user_id: str) -> dict:
    """Add a new task for the specified user."""
    with Session(engine) as session:
        task = Task(title=title, user_id=user_id)
        session.add(task)
        session.commit()
        session.refresh(task)
        return {"success": True, "task_id": task.id, "title": task.title}

@server.tool()
def list_tasks(user_id: str, status: str = "all") -> list:
    """List tasks for the specified user."""
    with Session(engine) as session:
        query = select(Task).where(Task.user_id == user_id)
        if status != "all":
            query = query.where(Task.completed == (status == "completed"))
        tasks = session.exec(query).all()
        return [{"id": t.id, "title": t.title, "completed": t.completed} for t in tasks]

@server.tool()
def update_task(task_id: int, user_id: str, title: str = None, completed: bool = None) -> dict:
    """Update a task for the specified user."""
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            return {"success": False, "error": "Task not found or access denied"}

        if title is not None:
            task.title = title
        if completed is not None:
            task.completed = completed

        session.add(task)
        session.commit()
        return {"success": True, "task_id": task.id}

@server.tool()
def delete_task(task_id: int, user_id: str) -> dict:
    """Delete a task for the specified user."""
    with Session(engine) as session:
        task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == user_id)).first()
        if not task:
            return {"success": False, "error": "Task not found or access denied"}

        session.delete(task)
        session.commit()
        return {"success": True, "task_id": task_id}

if __name__ == "__main__":
    server.run(transport="stdio", port=8000)
```

### 3. Update Database Models

Update `backend/src/models.py` to include Conversation and Message models:

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from .models import Task

class Conversation(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    title: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", index=True)
    role: str = Field(regex="^(user|assistant)$")  # Either "user" or "assistant"
    content: str
    tool_calls: Optional[str] = None  # JSON string of tool calls
    tool_responses: Optional[str] = None  # JSON string of tool responses
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    completed: bool = Field(default=False)
    user_id: str = Field(index=True)
```

### 4. Create Chat Endpoint

Create `backend/src/routes/chat.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from better_abc import get_current_user
from sqlmodel import Session, select
from ..models import Conversation, Message, engine
from pydantic import BaseModel
import openai
import os
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    thread_id: str = None

class ChatResponse(BaseModel):
    response: str
    thread_id: str
    message_id: str

@router.post("/api/chat/{user_id}", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    # Verify user_id matches authenticated user
    if current_user["user"]["id"] != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    # Initialize OpenAI client
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Create or retrieve conversation
    with Session(engine) as session:
        if not request.thread_id:
            # Create new conversation
            conversation = Conversation(user_id=user_id, title=request.message[:50])
            session.add(conversation)
            session.commit()
            thread_id = conversation.id
        else:
            # Verify conversation belongs to user
            conversation = session.exec(
                select(Conversation).where(Conversation.id == request.thread_id).where(Conversation.user_id == user_id)
            ).first()
            if not conversation:
                raise HTTPException(status_code=403, detail="Access forbidden")
            thread_id = conversation.id

        # Add user message to database
        user_message = Message(
            conversation_id=thread_id,
            role="user",
            content=request.message
        )
        session.add(user_message)
        session.commit()
        session.refresh(user_message)

        # Get conversation history for context
        messages = session.exec(
            select(Message).where(Message.conversation_id == thread_id).order_by(Message.created_at)
        ).all()

        # Prepare messages for OpenAI
        openai_messages = []
        for msg in messages[:-1]:  # Exclude the message we just added
            openai_messages.append({"role": msg.role, "content": msg.content})

        # Add the current user message
        openai_messages.append({"role": "user", "content": request.message})

        # Call OpenAI API
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that helps users manage their tasks. Use the provided tools to add, list, update, or delete tasks. Respond naturally in English or Urdu as appropriate."},
                    *openai_messages
                ],
                tools=[...]  # Define tools here
            )

            ai_response = response.choices[0].message.content

            # Save AI response to database
            ai_message = Message(
                conversation_id=thread_id,
                role="assistant",
                content=ai_response
            )
            session.add(ai_message)
            session.commit()

            return ChatResponse(
                response=ai_response,
                thread_id=thread_id,
                message_id=str(ai_message.id)
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
```

### 5. Create Frontend Component

Create `frontend/app/chat/page.tsx`:

```tsx
"use client";

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useEffect } from 'react';
import { useAuth } from 'better-auth/react';

export default function ChatPage() {
  const { session } = useAuth();

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // Refresh logic if needed
        }

        const res = await fetch('/api/chat/session', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user.id
          })
        });

        const { client_secret } = await res.json();
        return client_secret;
      },
    },
    theme: 'light',
    locale: 'en-US',
    onError: ({ error }) => {
      console.error('ChatKit error:', error);
    },
    onThreadChange: ({ threadId }) => {
      if (threadId) {
        localStorage.setItem('lastChatThreadId', threadId);
      }
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Todo Assistant</h1>
      <div className="border rounded-lg overflow-hidden">
        <ChatKit control={control} className="h-[600px] w-full" />
      </div>
    </div>
  );
}
```

### 6. Run the Application

1. Start the MCP server:
```bash
python mcp_server/server.py
```

2. Update the backend to include the new route:
```python
# In main backend app file
from backend.src.routes import chat
app.include_router(chat.router)
```

3. Run the full application stack:
```bash
# Start backend
uvicorn main:app --reload

# In another terminal, start frontend
cd frontend && npm run dev
```

## Testing

Verify the implementation with these tests:
1. User can add tasks via chat: "Add a task to buy milk"
2. User can list tasks: "What do I have to do?"
3. Conversation history persists across page refreshes
4. User cannot access another user's conversation history