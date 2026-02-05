from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Dict, Any
from ..db import get_session
from ..models import Conversation, Message
from ..auth import verify_jwt
from datetime import datetime
import uuid
import logging
import sys
from pathlib import Path
import importlib.util

router = APIRouter()
logger = logging.getLogger(__name__)

def _get_run_agent_turn():
    """Lazy load the run_agent_turn function with explicit path injection"""
    if hasattr(_get_run_agent_turn, '_run_agent_turn'):
        return _get_run_agent_turn._run_agent_turn

    # 1. Find the project root (where phase-3 lives)
    current_path = Path(__file__).resolve()
    root = current_path
    while root.parent != root:
        if (root / "phase-3").exists():
            break
        root = root.parent
    
    phase3_path = root / "phase-3"
    # IMPORTANT: We need the parent of the 'ai_agents' folder in sys.path
    if str(phase3_path) not in sys.path:
        sys.path.insert(0, str(phase3_path))
    
    runner_file = phase3_path / "ai_agents" / "runner.py"

    if not runner_file.exists():
        raise ImportError(f"Could not locate runner.py at {runner_file}")

    # 2. Manual import logic
    spec = importlib.util.spec_from_file_location("ai_agents.runner", str(runner_file))
    module = importlib.util.module_from_spec(spec)
    sys.modules["ai_agents.runner"] = module
    spec.loader.exec_module(module)

    _get_run_agent_turn._run_agent_turn = module.run_agent_turn
    return module.run_agent_turn

@router.post("/chat/{user_id}", response_model=Dict[str, Any])
async def chat_with_ai(
    user_id: str,
    request_data: Dict[str, Any],
    jwt_payload: dict = Depends(verify_jwt),
    session: Session = Depends(get_session)
):
    try:
        if jwt_payload.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        user_message = request_data.get("message", "")
        conversation_id = request_data.get("thread_id")

        if not conversation_id:
            conv = Conversation(user_id=user_id, title=f"Chat {datetime.now().strftime('%H:%M')}")
            session.add(conv)
            session.commit()
            session.refresh(conv)
            conversation_id = conv.id

        session.add(Message(user_id=user_id, conversation_id=conversation_id, role="user", content=user_message))
        session.commit()

        # Call the runner
        run_agent_turn = _get_run_agent_turn()
        result = await run_agent_turn(user_message, conversation_id, user_id)

        ai_response = result.get("response", "No response generated.")
        
        # Extract tool calls for Hackathon requirements
        tool_calls_info = []
        messages = result.get("messages", [])
        for m in messages:
            # Check for tool calls in the message object (OpenAI SDK style)
            if hasattr(m, 'tool_calls') and m.tool_calls:
                for tc in m.tool_calls:
                    tool_calls_info.append({
                        "tool": tc.function.name,
                        "parameters": tc.function.arguments
                    })

        # Save AI message to DB
        ai_msg = Message(user_id=user_id, conversation_id=conversation_id, role="assistant", content=ai_response)
        session.add(ai_msg)
        session.commit()

        return {
            "conversation_id": conversation_id,
            "response": ai_response,
            "tool_calls": tool_calls_info,
            "message_id": str(uuid.uuid4())
        }

    except Exception as e:
        logger.error(f"❌ Chat Error: {e}")
        # Explicitly log the traceback to help us see where it fails
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))