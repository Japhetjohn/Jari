from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.services.farm import FarmService
from app.shared.enums import UserRole

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.get(
    "/me",
    response_model=Optional[FarmResponse],
    summary="Get current farmer's primary farm",
    description="Retrieve the primary farm associated with the authenticated farmer."
)
def get_my_farm(
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return None
    return farm


@router.post(
    "",
    response_model=FarmResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new farm",
    description="Register a primary poultry farm for the authenticated farmer. Only one farm allowed per farmer."
)
def create_farm(
    data: FarmCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    try:
        farm = FarmService.create_farm(db, user=current_user, data=data)
        return farm
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put(
    "/me",
    response_model=FarmResponse,
    summary="Update current farmer's farm",
    description="Update the farm profile details for the authenticated farmer."
)
def update_my_farm(
    data: FarmUpdate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    try:
        farm = FarmService.update_farm(db, user=current_user, data=data)
        return farm
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

