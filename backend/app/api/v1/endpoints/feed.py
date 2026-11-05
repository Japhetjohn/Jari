import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.operations import (
    FeedPurchaseCreate,
    FeedPurchaseResponse,
    FeedConsumptionCreate,
    FeedConsumptionResponse,
    FeedInventorySummary,
)
from app.services.farm import FarmService
from app.services.feed import FeedService
from app.shared.enums import UserRole

router = APIRouter(prefix="/feed", tags=["Feed Inventory"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing feed supplies."
        )
    return farm


@router.get(
    "/purchases",
    response_model=List[FeedPurchaseResponse],
    summary="List feed purchases",
    description="Retrieve all feed purchases for the authenticated farmer with optional feed type filtering."
)
def list_feed_purchases(
    feed_type: Optional[str] = Query(None, description="Filter by feed type"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    purchases = FeedService.get_purchases(db, farm.id, feed_type=feed_type)
    responses = []
    for p in purchases:
        resp = FeedPurchaseResponse.model_validate(p)
        resp.flock_name = p.flock.name if p.flock else None
        responses.append(resp)
    return responses


@router.post(
    "/purchases",
    response_model=FeedPurchaseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record feed purchase",
    description="Record a new feed purchase and automatically normalize bags into kilograms."
)
def create_feed_purchase(
    data: FeedPurchaseCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        purchase = FeedService.create_purchase(db, farm=farm, data=data)
        resp = FeedPurchaseResponse.model_validate(purchase)
        resp.flock_name = purchase.flock.name if purchase.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/consumption",
    response_model=List[FeedConsumptionResponse],
    summary="List feed consumption logs",
    description="Retrieve feed consumption history for the farmer's bird groups."
)
def list_feed_consumption(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    consumptions = FeedService.get_consumptions(db, farm.id, flock_id=flock_id)
    responses = []
    for c in consumptions:
        resp = FeedConsumptionResponse.model_validate(c)
        resp.flock_name = c.flock.name if c.flock else None
        responses.append(resp)
    return responses


@router.post(
    "/consumption",
    response_model=FeedConsumptionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log daily feed use",
    description="Record feed consumption against available stock with inventory validation."
)
def record_feed_consumption(
    data: FeedConsumptionCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        consumption = FeedService.record_consumption(db, farm=farm, data=data)
        resp = FeedConsumptionResponse.model_validate(consumption)
        resp.flock_name = consumption.flock.name if consumption.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/inventory",
    response_model=FeedInventorySummary,
    summary="Get feed inventory balance",
    description="Return real available stock in kg broken down by feed type, plus totals."
)
def get_feed_inventory(
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    return FeedService.get_inventory_summary(db, farm.id)

