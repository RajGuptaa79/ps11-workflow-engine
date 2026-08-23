from app.repositories.inventory import get_product


async def check_inventory(product: str):
    product_document = await get_product(product)

    if not product_document:
        return {
            "available": False,
            "reason": "Product not found.",
            "product": product,
        }

    quantity = product_document.get("quantity", 0)

    return {
        "available": quantity > 0,
        "product_id": product_document.get("product_id"),
        "product_name": product_document.get("name"),
        "quantity": quantity,
        "reason": (
            "Product is available."
            if quantity > 0
            else "Product is out of stock."
        ),
    }