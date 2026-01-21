from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str
    better_auth_secret: str
    debug: bool = False
    db_echo: bool = False 
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        # This allows the app to stay running even if some env vars are missing
        extra = "ignore" 

def get_settings():
    return Settings()