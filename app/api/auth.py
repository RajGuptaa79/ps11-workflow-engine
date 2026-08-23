from fastapi import APIRouter, Header, HTTPException

from app.core.firebase import verify_token


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.get("/me")
async def get_current_user(
    authorization: str | None = Header(default=None),
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required.",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format.",
        )

    token = authorization.replace("Bearer ", "", 1).strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is missing.",
        )

    try:
        decoded_token = verify_token(token)

        return {
            "authenticated": True,
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )