import asyncio

from app.core.database import (
    connect_to_mongodb,
    close_mongodb_connection,
    get_database,
)
from app.api.executions import execute_workflow, ExecuteRequest


workflow = {
    "workflow_id": "test_order_workflow",
    "name": "Test Order Workflow",
    "description": "Test inventory to order flow",
    "variables": {
        "product": "PROD001",
        "quantity": 2,
    },
    "start_step": "step_start",
    "steps": [
        {
            "id": "step_start",
            "name": "Start",
            "description": "Start workflow",
            "type": "start",
            "action": "workflow.start",
            "on_success": "step_inventory",
        },
        {
            "id": "step_inventory",
            "name": "Check Inventory",
            "description": "Check product inventory",
            "type": "action",
            "action": "inventory.check",
            "on_success": "step_order",
            "on_failure": "step_end",
        },
        {
            "id": "step_order",
            "name": "Create Order",
            "description": "Create customer order",
            "type": "action",
            "action": "order.create",
            "on_success": "step_end",
        },
        {
            "id": "step_end",
            "name": "End",
            "description": "End workflow",
            "type": "end",
            "action": "workflow.end",
        },
    ],
}


async def main():

    await connect_to_mongodb()

    try:
        result = await execute_workflow(
            ExecuteRequest(
                workflow=workflow,
                user_id="demo-user",
            )
        )

        print("\nRESULT:")
        print(result)

        database = get_database()

        order = await database.orders.find_one(
            {
                "product_id": "PROD001"
            },
            sort=[
                ("created_at", -1)
            ],
        )

        print("\nLATEST ORDER:")
        print(order)

        execution = await database.executions.find_one(
            {
                "workflow_id": "test_order_workflow"
            },
            sort=[
                ("created_at", -1)
            ],
        )

        print("\nEXECUTION HISTORY:")
        print(execution)

    finally:
        await close_mongodb_connection()


asyncio.run(main())