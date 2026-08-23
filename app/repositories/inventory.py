from app.core.database import get_database


async def get_product(product: str):
    database = get_database()

    product_document = await database.inventory.find_one(
        {
            "$or": [
                {"product_id": product},
                {"name": product},
            ]
        }
    )

    if product_document:
        product_document["_id"] = str(product_document["_id"])

    return product_document