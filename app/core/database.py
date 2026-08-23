from motor.motor_asyncio import AsyncIOMotorClient
import certifi

from app.core.config import settings


class MongoDB:
    client = None
    database = None


mongodb = MongoDB()


async def connect_to_mongodb():
    mongodb.client = AsyncIOMotorClient(
        settings.mongodb_uri,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=20000,
    )

    await mongodb.client.admin.command("ping")

    mongodb.database = mongodb.client[settings.mongodb_database]

    print(
        f"MongoDB connected successfully: "
        f"{settings.mongodb_database}"
    )


async def close_mongodb_connection():
    if mongodb.client:
        mongodb.client.close()
        print("MongoDB connection closed.")


def get_database():
    if mongodb.database is None:
        raise RuntimeError("MongoDB is not connected.")

    return mongodb.database