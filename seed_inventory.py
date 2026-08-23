import asyncio

from app.core.database import connect_to_mongodb, close_mongodb_connection
from app.core.database import get_database


async def seed_inventory():
    await connect_to_mongodb()

    database = get_database()

    products = [
        {
            "product_id": "PROD001",
            "name": "Wireless Headphones",
            "quantity": 10,
            "price": 2999,
        },
        {
            "product_id": "PROD002",
            "name": "Mechanical Keyboard",
            "quantity": 0,
            "price": 4999,
        },
        {
            "product_id": "PROD003",
            "name": "USB-C Hub",
            "quantity": 5,
            "price": 1499,
        },
    ]

    for product in products:
        await database.inventory.update_one(
            {"product_id": product["product_id"]},
            {"$set": product},
            upsert=True,
        )

    print("Inventory seeded successfully.")

    await close_mongodb_connection()


if __name__ == "__main__":
    asyncio.run(seed_inventory())