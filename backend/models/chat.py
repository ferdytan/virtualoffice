from typing import Optional
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'sherloc', 'watson', 'nara', 'velocia', or 'scout'")
    message: str = Field(..., description="Task brief or query message")

class CallRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'sherloc', 'watson', 'nara', 'velocia', or 'scout'")
    message: Optional[str] = Field(default="", description="Speech-to-text transcript or greeting")
    session_id: Optional[str] = Field(default=None, description="Optional call session ID")

class WhatsAppWebhookRequest(BaseModel):
    from_phone: Optional[str] = Field(None, alias="from", description="Customer WhatsApp phone number")
    phone: Optional[str] = Field(None, description="Alternative phone field")
    sender_name: Optional[str] = Field(default="Customer", description="Sender name")
    message: str = Field(..., description="Inbound text content")
    timestamp: Optional[str] = Field(default=None, description="Timestamp")

class ManagementReplyWebhookRequest(BaseModel):
    ticket_id: str = Field(..., description="Escalated ticket ID, e.g. TIK-481")
    reply_by: str = Field(default="Dimas (Lead Eng)", description="Name and title of the replying engineer")
    reply_text: str = Field(..., description="Technical resolution instruction")
