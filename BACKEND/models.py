from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

class TriggerEvent(BaseModel):
    type: Literal["formCreate", "formUpdate", "webhook", "schedule", "manual"]
    schema_name: Optional[str] = Field(default=None, alias="schema")

class Condition(BaseModel):
    field: str
    operator: Literal["eq", "neq", "gt", "lt", "contains"]
    value: str | int | float | bool

class WorkflowStep(BaseModel):
    stepId: str
    name: str
    actionType: Literal["function", "apiCall", "conditionalGateway", "parallelFork", "loop"]
    endpoint: Optional[str] = None
    inputMapping: Dict[str, Any] = Field(default_factory=dict)
    condition: Optional[Condition] = None
    onSuccess: Optional[List[str]] = None
    onFailure: Literal["abort", "skip"]

class UniversalWorkflowIR(BaseModel):
    workflowId: str
    workflowName: str
    triggerEvent: TriggerEvent
    steps: List[WorkflowStep]

class DetectRequest(BaseModel):
    requirement: str
    projectName: str = "DefaultProject"

class TriggerRequest(BaseModel):
    workflowId: str
    triggerPayload: Dict[str, Any]