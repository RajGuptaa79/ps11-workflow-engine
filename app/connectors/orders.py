from app.repositories.orders import create_order


async def create_order_action(
    product_id: str,
    product_name: str,
    quantity: int,
):
    return await create_order(
        product_id=product_id,
        product_name=product_name,
        quantity=quantity,
    )