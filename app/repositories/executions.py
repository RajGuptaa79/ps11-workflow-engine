from datetime import datetime, timezone

from bson import ObjectId

from app.core.database import get_database


async def create_execution(
    workflow_id: str,
    user_id: str,
):
    database = get_database()

    now = datetime.now(timezone.utc)

    document = {
        "workflow_id": workflow_id,
        "user_id": user_id,
        "status": "running",
        "steps": {},
        "result": None,
        "created_at": now,
        "updated_at": now,
    }

    result = await database.executions.insert_one(document)

    return {
        "id": str(result.inserted_id),
        "workflow_id": workflow_id,
        "user_id": user_id,
        "status": "running",
    }


async def update_execution(
    execution_id,
    status: str,
    steps: dict | None = None,
    result: dict | None = None,
):
    database = get_database()

    update_data = {
        "status": status,
        "updated_at": datetime.now(timezone.utc),
    }

    if steps is not None:
        update_data["steps"] = steps

    if result is not None:
        update_data["result"] = result

    await database.executions.update_one(
        {"_id": ObjectId(execution_id)},
        {"$set": update_data},
    )


async def get_executions_by_user(
    user_id: str,
):
    database = get_database()

    cursor = database.executions.find(
        {"user_id": user_id}
    ).sort(
        "created_at",
        -1,
    )

    executions = []

    async for document in cursor:
        document["_id"] = str(document["_id"])

        # Convert nested MongoDB ObjectIds
        # inside steps/result as well.
        def convert_objectids(value):
            if isinstance(value, ObjectId):
                return str(value)

            if isinstance(value, dict):
                return {
                    key: convert_objectids(item)
                    for key, item in value.items()
                }

            if isinstance(value, list):
                return [
                    convert_objectids(item)
                    for item in value
                ]

            return value

        document = convert_objectids(document)

        executions.append(document)

    return executions