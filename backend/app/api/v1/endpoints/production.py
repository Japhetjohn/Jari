import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.operations import (
    ProductionRecordCreate,
    ProductionRecordResponse,
    ProductionSummary,
)
from app.services.farm import FarmService
from app.services.production import ProductionService
from app.shared.enums import UserRole

router = APIRouter(prefix="/production", tags=["Production Operations"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing production records."
        )
    return farm


@router.get(
    "",
    response_model=List[ProductionRecordResponse],
    summary="List production records",
    description="Retrieve production records (eggs, broiler weights, ready birds) for the authenticated farmer."
)
def list_production_records(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return []
    records = ProductionService.get_records(db, farm.id, flock_id=flock_id)
    responses = []
    for r in records:
        resp = ProductionRecordResponse.model_validate(r)
        resp.flock_name = r.flock.name if r.flock else None
        responses.append(resp)
    return responses


@router.post(
    "",
    response_model=ProductionRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add production record",
    description="Log daily layer or broiler production observations with egg integrity validation."
)
def create_production_record(
    data: ProductionRecordCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        record = ProductionService.create_record(db, farm=farm, data=data)
        resp = ProductionRecordResponse.model_validate(record)
        resp.flock_name = record.flock.name if record.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/summary",
    response_model=ProductionSummary,
    summary="Get production aggregate summary",
    description="Return real aggregated production statistics from persisted records."
)
def get_production_summary(
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return ProductionSummary(
            total_records=0,
            total_eggs_collected=0,
            total_good_eggs=0,
            total_damaged_eggs=0,
            total_birds_ready=0,
            overall_average_weight=0.0
        )
    return ProductionService.get_summary(db, farm.id)

