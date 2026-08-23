import firebase_admin
from firebase_admin import credentials, auth

from app.core.config import settings


def initialize_firebase():
    if firebase_admin._apps:
        return

    private_key = settings.firebase_private_key.replace("\\n", "\n")

    credential = credentials.Certificate(
        {
            "type": "service_account",
            "project_id": settings.firebase_project_id,
            "private_key_id": "",
            "private_key": private_key,
            "client_email": settings.firebase_client_email,
            "client_id": "",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": (
                "https://www.googleapis.com/oauth2/v1/certs"
            ),
            "client_x509_cert_url": "",
        }
    )

    firebase_admin.initialize_app(credential)


def verify_token(id_token: str):
    initialize_firebase()

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token

    except Exception as exc:
        raise ValueError("Invalid or expired authentication token.") from exc