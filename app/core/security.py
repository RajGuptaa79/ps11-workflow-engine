import firebase_admin

from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings


if not firebase_admin._apps:

    private_key = settings.firebase_private_key.replace(
        "\\n",
        "\n"
    )

    credential = credentials.Certificate({
        "type": "service_account",
        "project_id": settings.firebase_project_id,
        "private_key": private_key,
        "client_email": settings.firebase_client_email,
        "token_uri": "https://oauth2.googleapis.com/token",
    })

    firebase_admin.initialize_app(credential)


security = HTTPBearer()


async def get_current_user(
    credentials_data: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials_data.credentials

    try:
        decoded_token = auth.verify_id_token(token)

        return decoded_token

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase authentication token.",
        )