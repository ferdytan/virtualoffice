from typing import Optional, List, Union
from pydantic import BaseModel, Field

class NaraFeedbackRequest(BaseModel):
    customer_id: int = Field(..., description="ID of the customer")
    wa_group_id: str = Field(..., description="WhatsApp group ID of the customer PRO group")
    sender_name: Optional[str] = Field(default="Customer", description="Name of the person replying in group")
    message: str = Field(..., description="Inbound text content in WhatsApp group")
    quoted_message: Optional[str] = Field(default=None, description="Original offline alert message quoted")

class NaraDispatchRequest(BaseModel):
    customer_ids: Optional[List[Union[int, str]]] = Field(default=None, description="Optional customer IDs to dispatch")
    force_audit: Optional[bool] = Field(default=False, description="Force Day 1 Full Audit mode")
    day_override: Optional[int] = Field(default=None, description="Override calendar day (1 for Full Audit, 2+ for Delta)")

class CustomerGroupMappingRequest(BaseModel):
    customer_id: Union[int, str] = Field(..., description="Customer Account ID (e.g. 30706, 'LNJ', etc.)")
    customer_name: Optional[str] = Field(default="", description="Customer Account Name (e.g. 'LNJ', 'PT RAMA')")
    wa_group_name: str = Field(..., description="WhatsApp Group Name (e.g. 'ONB LNJ')")
    wa_group_id: Optional[str] = Field(default=None, description="Optional WhatsApp Group JID")
    pic: Optional[str] = Field(default="PIC Operasional", description="Optional PIC name")
