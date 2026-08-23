from fastapi import APIRouter
from pydantic import BaseModel

from app.connectors.inventory import check_inventory
from app.connectors.orders import create_order_action
from app.repositories.executions import (
    create_execution,
    update_execution,
    get_executions_by_user,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["Workflow Execution"],
)


class ExecuteRequest(BaseModel):
    workflow: dict
    user_id: str = "demo-user"


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

    variables = workflow.get("variables", {})
    execution_context = {}
    executed_steps = []
    step_history = {}

    execution = await create_execution(
        workflow_id=workflow.get(
            "workflow_id",
            "unknown-workflow",
        ),
        user_id=request.user_id,
    )

    execution_id = execution["id"]

    print("Starting workflow execution...")

    try:
        while current_step_id:

            step = step_map.get(current_step_id)

            if not step:
                await update_execution(
                    execution_id,
                    "failed",
                    step_history,
                    {
                        "error": (
                            f"Step not found: "
                            f"{current_step_id}"
                        )
                    },
                )

                return ExecuteResponse(
                    status="failed",
                    message=(
                        f"Step not found: "
                        f"{current_step_id}"
                    ),
                )

            step_id = step.get("id")
            step_name = step.get("name")
            action = step.get("action")

            print(
                f"Executing step: "
                f"{step_id} - {step_name}"
            )

            executed_steps.append(step_id)

            step_history[step_id] = {
                "name": step_name,
                "status": "running",
            }

            # -----------------------------------------
            # INVENTORY
            # -----------------------------------------

            if action == "inventory.check":

                product = variables.get("product")

                if not product:
                    error_message = (
                        "Inventory check requires "
                        "'variables.product'."
                    )

                    await update_execution(
                        execution_id,
                        "failed",
                        step_history,
                        {"error": error_message},
                    )

                    return ExecuteResponse(
                        status="failed",
                        message=error_message,
                    )

                inventory_result = await check_inventory(
                    product
                )

                execution_context["inventory"] = (
                    inventory_result
                )

                print(
                    f"Inventory result: "
                    f"{inventory_result}"
                )

                step_history[step_id] = {
                    "name": step_name,
                    "status": "success",
                    "result": inventory_result,
                }

                await update_execution(
                    execution_id,
                    "running",
                    step_history,
                )

                if inventory_result.get("available"):
                    current_step_id = step.get(
                        "on_success"
                    )
                else:
                    current_step_id = step.get(
                        "on_failure"
                    )

                continue

            # -----------------------------------------
            # ORDER
            # -----------------------------------------

            if action == "order.create":

                inventory_result = (
                    execution_context.get(
                        "inventory",
                        {},
                    )
                )

                if not inventory_result.get("available"):
                    error_message = (
                        "Cannot create order: "
                        "product unavailable."
                    )

                    await update_execution(
                        execution_id,
                        "failed",
                        step_history,
                        {"error": error_message},
                    )

                    return ExecuteResponse(
                        status="failed",
                        message=error_message,
                    )

                quantity = variables.get(
                    "quantity",
                    1,
                )

                order = await create_order_action(
                    product_id=inventory_result.get(
                        "product_id"
                    ),
                    product_name=inventory_result.get(
                        "product_name"
                    ),
                    quantity=quantity,
                )

                execution_context["order"] = order

                print(
                    f"Order created: "
                    f"{order.get('order_id')}"
                )

                step_history[step_id] = {
                    "name": step_name,
                    "status": "success",
                    "result": order,
                }

                await update_execution(
                    execution_id,
                    "running",
                    step_history,
                )

                current_step_id = step.get(
                    "on_success"
                )

                continue

            # -----------------------------------------
            # CONDITION
            # -----------------------------------------

            if step.get("type") == "condition":

                condition = (
                    step.get("condition") or {}
                )

                inventory_result = (
                    execution_context.get(
                        "inventory",
                        {},
                    )
                )

                available = inventory_result.get(
                    "available",
                    False,
                )

                if available:
                    next_step = condition.get(
                        "on_true"
                    )

                    print(
                        f"Condition result: "
                        f"TRUE -> {next_step}"
                    )
                else:
                    next_step = condition.get(
                        "on_false"
                    )

                    print(
                        f"Condition result: "
                        f"FALSE -> {next_step}"
                    )

                step_history[step_id] = {
                    "name": step_name,
                    "status": "success",
                    "result": {
                        "available": available,
                        "next_step": next_step,
                    },
                }

                await update_execution(
                    execution_id,
                    "running",
                    step_history,
                )

                current_step_id = next_step
                continue

            # -----------------------------------------
            # NORMAL STEP
            # -----------------------------------------

            step_history[step_id] = {
                "name": step_name,
                "status": "success",
            }

            await update_execution(
                execution_id,
                "running",
                step_history,
            )

            current_step_id = step.get(
                "on_success"
            )

        # -----------------------------------------
        # COMPLETE
        # -----------------------------------------

        final_result = {
            "executed_steps": executed_steps,
            "step_count": len(executed_steps),
            "inventory": execution_context.get(
                "inventory"
            ),
            "order": execution_context.get(
                "order"
            ),
        }

        await update_execution(
            execution_id,
            "success",
            step_history,
            final_result,
        )

        print("Workflow execution completed.")

        return ExecuteResponse(
            status="success",
            message=(
                f"Workflow executed successfully. "
                f"{len(executed_steps)} steps processed."
            ),
        )

    except Exception as exc:

        print(
            f"Workflow execution failed: {exc}"
        )

        await update_execution(
            execution_id,
            "failed",
            step_history,
            {"error": str(exc)},
        )

        return ExecuteResponse(
            status="failed",
            message=(
                f"Workflow execution failed: {exc}"
            ),
        )


# -----------------------------------------
# EXECUTION HISTORY
# -----------------------------------------

@router.get("/executions")
async def get_execution_history(
    user_id: str = "demo-user",
):
    executions = await get_executions_by_user(
        user_id
    )

    return {
        "status": "success",
        "count": len(executions),
        "executions": executions,
    }