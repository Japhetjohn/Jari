from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    farm,
    poultry_house,
    flock,
    feed,
    production,
    health,
    sales,
    expenses,
    financial,
    kyc,
    documents,
    admin,
    institution,
)

api_router = APIRouter()


@api_router.get("/")
def api_root():
    return {
        "name": "JARI Backend API",
        "version": "0.1.0",
        "status": "online",
        "docs": "/docs",
        "openapi": "/api/v1/openapi.json",
        "health": "/health",
    }


api_router.include_router(auth.router)
api_router.include_router(farm.router)
api_router.include_router(poultry_house.router)
api_router.include_router(flock.router)
api_router.include_router(feed.router)
api_router.include_router(production.router)
api_router.include_router(health.router)
api_router.include_router(sales.router)
api_router.include_router(expenses.router)
api_router.include_router(financial.router)
api_router.include_router(kyc.router)
api_router.include_router(documents.router)
api_router.include_router(admin.router)
api_router.include_router(institution.router)
