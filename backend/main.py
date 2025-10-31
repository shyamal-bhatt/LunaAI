import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local imports
from routes.auth import router as auth_router
from routes.users import router as users_router


def configure_logging() -> None:
    """Configure application-wide logging with rotation.

    - Level is controlled by LOG_LEVEL env (default INFO)
    - Logs go to stdout and to backend/logs/app.log
    """
    logs_dir = Path(__file__).resolve().parent / "logs"
    logs_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger()
    # Resolve log level from env; fallback to INFO
    log_level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, log_level_name, logging.INFO)
    logger.setLevel(level)

    # Console handler
    ch = logging.StreamHandler()
    ch.setLevel(level)
    ch.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))

    # Rotating file handler
    fh = RotatingFileHandler(logs_dir / "app.log", maxBytes=2_000_000, backupCount=3)
    fh.setLevel(level)
    fh.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))

    logger.addHandler(ch)
    logger.addHandler(fh)
    logging.getLogger(__name__).info("Logging configured | level=%s", log_level_name)


def create_app() -> FastAPI:
    """Application factory.

    - Initializes logging
    - Creates FastAPI app
    - Configures permissive CORS for development
    - Includes feature routers
    """
    configure_logging()
    app = FastAPI(title="LunaAI API", version="0.1.0")
    logging.getLogger(__name__).debug("FastAPI instance created")

    # In dev we allow all origins to simplify RN device/emulator testing.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logging.getLogger(__name__).info("CORS configured | origins=* methods=* headers=*")

    # Routers
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(users_router, prefix="/users", tags=["users"])
    logging.getLogger(__name__).info("Router included | prefix=/auth tags=['auth']")
    logging.getLogger(__name__).info("Router included | prefix=/users tags=['users']")

    # Health check endpoint
    @app.get("/")
    def root():
        return {"status": "ok", "message": "LunaAI API is running"}

    @app.get("/health")
    def health():
        return {"status": "healthy", "service": "LunaAI API"}

    logging.getLogger(__name__).info("FastAPI application created")
    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)