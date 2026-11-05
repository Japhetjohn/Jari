from fastapi import APIRouter
from app.api.v1.endpoints import auth, farm, poultry_house

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(farm.router)
api_router.include_router(poultry_house.router)
