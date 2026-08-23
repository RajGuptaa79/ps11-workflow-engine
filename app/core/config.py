from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Autonomous Business Workflow Engine"

    # Gemini
    gemini_api_key: str

    # Firebase
    firebase_project_id: str
    firebase_private_key: str
    firebase_client_email: str

    # MongoDB Atlas
    mongodb_uri: str
    mongodb_database: str = "workflow_engine"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()