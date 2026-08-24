from enum import Enum
from typing import Any

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


class Condition(BaseModel):
    expression: str = Field(
        description="Boolean expression used to determine the next workflow path."
    )

    on_true: str = Field(
        description="Step ID to execute when condition is true."
    )

    on_false: str = Field(
        description="Step ID to execute when condition is false."
    )


class Step(BaseModel):
    id: str
    name: str
    description: str

    type: StepType

    action: str = Field(
        description="Machine-readable action performed by this step."
    )

    input: dict[str, Any] = Field(
        default_factory=dict
    )

    on_success: str | None = None
    on_failure: str | None = None

    condition: Condition | None = None


class UniversalWorkflowIR(BaseModel):
    workflow_id: str

    name: str

    description: str

    steps: list[Step]

    variables: dict[str, Any] = Field(
        default_factory=dict
    )

    start_step: str

    metadata: dict[str, Any] = Field(
        default_factory=dict
    )