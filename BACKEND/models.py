from typing import List, Dict, Any, Optional, Literal, Union
from pydantic import BaseModel, Field

class TriggerEvent(BaseModel):
    type: Literal["formCreate", "formUpdate", "formDelete", "manual", "webhook"]
    schema_name: Optional[str] = Field(default=None, alias="schema")

class Condition(BaseModel):
    field: str
    operator: Literal["eq", "neq", "gt", "lt", "contains"]
    value: Union[str, int, float, bool]

class WorkflowStep(BaseModel):
    stepId: str
    name: str
    order: Optional[int] = 1
    # actionType updated to match the PS11 automation operations
    actionType: Literal["function", "formCreate", "formUpdate", "formDelete", "operation"]
    functionName: Optional[str] = None
    schema_name: Optional[str] = Field(default=None, alias="schema")
    formId: Optional[str] = None
    buttonId: Optional[str] = None
    inputMapping: Dict[str, Any] = Field(default_factory=dict)
    condition: Optional[Condition] = None
    # onSuccess changed from List[str] to just str to fix the array validation error
    onSuccess: Optional[str] = None
    onFailure: Union[Literal["abort", "skip"], str] = "abort"

class UniversalWorkflowIR(BaseModel):
    workflowId: str
    workflowName: str
    triggerEvent: TriggerEvent
    steps: List[WorkflowStep]

class DetectRequest(BaseModel):
    requirement: str
    projectName: str = "sample-flow"

class TriggerRequest(BaseModel):
    workflowId: str
    triggerPayload: Dict[str, Any]