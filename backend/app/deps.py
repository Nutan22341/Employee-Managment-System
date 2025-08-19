from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "leave_mgmt"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()

# Parse comma-separated origins

def cors_origins() -> List[str]:
    return [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]