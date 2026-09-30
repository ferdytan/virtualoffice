from typing import Optional, List
from pydantic import BaseModel, Field

class TaskUpdateRequest(BaseModel):
    id: str
    status: str = Field(..., description="SCHEDULED, ON HOLD, IN PROGRESS, or DONE")

class SafeBroadcastRequest(BaseModel):
    groups: Optional[List[str]] = Field(default=None, description="List of technician WhatsApp group names")
    message: Optional[str] = Field(default="Peringatan unit telemetri offline terdeteksi.", description="Broadcast message text")

class AnalyticsTriggerRequest(BaseModel):
    timeframe: Optional[str] = Field(default="last_7_days", description="Timeframe for analytics extraction")
