from datetime import datetime, timezone

from app.core.database import get_database


async def create_workflow(
    workflow: dict,
    user_id: str,
):
    database = get_database()

    document = {
        "workflow_id": workflow.get("workflow_id"),
        "name": workflow.get("name"),
        "description": workflow.get("description"),
        "workflow": workflow,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await database.workflows.insert_one(document)

    return {
        "id": str(result.inserted_id),
        "workflow_id": document["workflow_id"],
        "user_id": user_id,
    }


async def get_workflows_by_user(
    user_id: str,
):
    database = get_database()

    cursor = database.workflows.find(
        {"user_id": user_id}
    ).sort(
        "created_at",
        -1,
    )

    workflows = []

    async for document in cursor:
        document["_id"] = str(document["_id"])
        workflows.append(document)

    return workflows