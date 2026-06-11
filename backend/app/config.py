from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Meeting Assistant"
    debug: bool = False

    database_url: str = "postgresql://postgres:postgres@localhost:5432/meeting_assistant"

    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
