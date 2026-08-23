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
        description="Step ID to execute when the condition is true."
    )

    on_false: str = Field(
        description="Step ID to execute when the condition is false."
    )


class Step(BaseModel):
    id: str = Field(
        description="Unique identifier for the workflow step."
    )

    name: str = Field(
        description="Human-readable name of the workflow step."
    )

    description: str = Field(
        description="Detailed explanation of what this step does."
    )

    type: StepType

    action: str = Field(
        description="Machine-readable action performed by this step."
    )

    input: dict[str, Any] = Field(
        default_factory=dict,
        description="Input variables required by this step."
    )

    on_success: str | None = Field(
        default=None,
        description="Next step ID when this step succeeds."
    )

    on_failure: str | None = Field(
        default=None,
        description="Next step ID when this step fails."
    )

    condition: Condition | None = None


class UniversalWorkflowIR(BaseModel):
    workflow_id: str

    name: str

    description: str

    steps: list[Step]

    variables: dict[str, Any] = Field(
        default_factory=dict,
        description="Variables available to the workflow."
    )

    start_step: str

    metadata: dict[str, Any] = Field(
        default_factory=dict
    )