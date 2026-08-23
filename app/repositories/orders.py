from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import get_database


async def create_order(
    product_id: str,
    product_name: str,
    quantity: int,
):
    database = get_database()

    order_id = f"ORD-{uuid4().hex[:8].upper()}"

    document = {
        "order_id": order_id,
        "product_id": product_id,
        "product_name": product_name,
        "quantity": quantity,
        "status": "created",
        "created_at": datetime.now(timezone.utc),
    }

    await database.orders.insert_one(document)

    return document