from pydantic import BaseModel, Field

class AvatarTypeRequest(BaseModel):
    avatar_type: str = Field(..., description="Avatar type: 'default', 'boxhead', or 'custom'")

class AgentColorRequest(BaseModel):
    color: str = Field(..., description="Hex color code, e.g. #f59e0b")
