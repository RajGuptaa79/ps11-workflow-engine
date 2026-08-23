from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1",
    tags=["Workflow Execution"],
)


class ExecuteRequest(BaseModel):
    workflow: dict


class ExecuteResponse(BaseModel):
    status: str
    message: str


@router.post(
    "/execute",
    response_model=ExecuteResponse,
)
async def execute_workflow(request: ExecuteRequest):
    workflow = request.workflow
    steps = workflow.get("steps", [])

    if not steps:
        return ExecuteResponse(
            status="failed",
            message="Workflow contains no steps.",
        )

    step_map = {
        step.get("id"): step
        for step in steps
    }

    current_step_id = workflow.get("start_step")

    if not current_step_id:
        return ExecuteResponse(
            status="failed",
            message="Workflow has no start_step.",
        )

    executed_steps = []

    print("Starting workflow execution...")

    while current_step_id:
        step = step_map.get(current_step_id)

        if not step:
            return ExecuteResponse(
                status="failed",
                message=f"Step not found: {current_step_id}",
            )

        step_id = step.get("id")
        step_name = step.get("name")

        print(
            f"Executing step: {step_id} - {step_name}"
        )

        executed_steps.append(step_id)

        # Condition step
        if step.get("type") == "condition":
            condition = step.get("condition") or {}

            # MVP simulation:
            # Inventory is considered available.
            inventory_available = True

            if inventory_available:
                next_step = condition.get("on_true")
                print(
                    f"Condition result: TRUE -> {next_step}"
                )
            else:
                next_step = condition.get("on_false")
                print(
                    f"Condition result: FALSE -> {next_step}"
                )

            current_step_id = next_step
            continue

        # Normal successful step
        current_step_id = step.get("on_success")

    print("Workflow execution completed.")

    return ExecuteResponse(
        status="success",
        message=(
            f"Workflow executed successfully. "
            f"{len(executed_steps)} steps processed."
        ),
    )