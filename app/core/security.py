from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.firebase import verify_token


security = HTTPBearer()


async def get_current_user(
    credentials_data: HTTPAuthorizationCredentials = Depends(security),
):

    try:

        decoded_token = verify_token(
            credentials_data.credentials
        )

        return decoded_token

    except ValueError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase authentication token.",
        )