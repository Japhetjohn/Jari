from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
@app.get(settings.API_V1_STR)
@app.get(f"{settings.API_V1_STR}/")
def root_info():
    return {
        "message": "JARI Backend API is running",
        "status": "online",
        "version": "0.1.0",
        "docs_url": "/docs",
        "health_url": "/health",
        "api_v1_prefix": settings.API_V1_STR,
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
