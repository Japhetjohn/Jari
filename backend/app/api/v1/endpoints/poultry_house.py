import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.poultry_house import (
    PoultryHouseCreate,
    PoultryHouseUpdate,
    PoultryHouseResponse,
)
from app.services.farm import FarmService
from app.services.poultry_house import PoultryHouseService
from app.shared.enums import UserRole

router = APIRouter(prefix="/houses", tags=["Poultry Houses"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing poultry houses."
        )
    return farm


@router.get(
    "",
    response_model=List[PoultryHouseResponse],
    summary="List poultry houses",
    description="List all poultry houses for the authenticated farmer's farm with live flock utilization. Archived houses are excluded by default."
)
def list_houses(
    include_archived: bool = Query(False, description="Set to true to include archived houses"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    houses = PoultryHouseService.get_houses_by_farm(db, farm.id, include_archived=include_archived)

    responses = []
    for h in houses:
        current_birds = PoultryHouseService.get_house_current_birds(db, h.id)
        available_capacity = max(0, h.capacity - current_birds)
        resp = PoultryHouseResponse.model_validate(h)
        resp.current_birds = current_birds
        resp.available_capacity = available_capacity
        responses.append(resp)
    return responses


@router.post(
    "",
    response_model=PoultryHouseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new poultry house",
    description="Create a new poultry house under the farmer's registered farm."
)
def create_house(
    data: PoultryHouseCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        house = PoultryHouseService.create_house(db, farm=farm, data=data)
        resp = PoultryHouseResponse.model_validate(house)
        resp.current_birds = 0
        resp.available_capacity = house.capacity
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put(
    "/{id}",
    response_model=PoultryHouseResponse,
    summary="Update poultry house",
    description="Update poultry house specifications such as name, capacity, or ventilation."
)
def update_house(
    id: uuid.UUID,
    data: PoultryHouseUpdate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        house = PoultryHouseService.update_house(db, farm=farm, house_id=id, data=data)
        current_birds = PoultryHouseService.get_house_current_birds(db, house.id)
        resp = PoultryHouseResponse.model_validate(house)
        resp.current_birds = current_birds
        resp.available_capacity = max(0, house.capacity - current_birds)
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/{id}",
    response_model=PoultryHouseResponse,
    summary="Archive poultry house",
    description="Soft-archive a poultry house. House cannot be archived if it contains active birds."
)
def archive_house(
    id: uuid.UUID,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        archived_house = PoultryHouseService.archive_house(db, farm=farm, house_id=id)
        current_birds = PoultryHouseService.get_house_current_birds(db, archived_house.id)
        resp = PoultryHouseResponse.model_validate(archived_house)
        resp.current_birds = current_birds
        resp.available_capacity = max(0, archived_house.capacity - current_birds)
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
