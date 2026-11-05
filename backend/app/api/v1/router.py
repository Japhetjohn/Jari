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
)

api_router = APIRouter()
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
