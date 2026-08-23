from enum import Enum

from pydantic import BaseModel, Field


class StepType(str, Enum):
    START = "start"
    ACTION = "action"
    CONDITION = "condition"
    NOTIFICATION = "notification"
    AI = "ai"
    END = "end"


class StepStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


class WorkflowInput(BaseModel):
    key: str
    value: str


class Condition(BaseModel):
    expression: str

    on_true: str

    on_false: str


class Step(BaseModel):
    id: str

    name: str

    description: str

    type: StepType

    action: str

    inputs: list[WorkflowInput] = Field(
        default_factory=list
    )

    on_success: str | None = None

    on_failure: str | None = None

    condition: Condition | None = None


class WorkflowVariable(BaseModel):
    key: str

    description: str

    value: str | None = None


class UniversalWorkflowIR(BaseModel):
    workflow_id: str

    name: str

    description: str

    steps: list[Step]

    variables: list[WorkflowVariable] = Field(
        default_factory=list
    )

    start_step: str

    metadata: list[WorkflowInput] = Field(
        default_factory=list
    )