import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.flock import (
    FlockCreate,
    FlockResponse,
    FlockDetailResponse,
    FlockMovementCreate,
    FlockMovementResponse,
    FlockTransferCreate,
    FlockTransferResponse,
)
from app.services.farm import FarmService
from app.services.flock import FlockService
from app.shared.enums import UserRole, FlockStatus, MovementDirection

router = APIRouter(prefix="/flocks", tags=["Flocks & Bird Population"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing bird groups."
        )
    return farm


@router.get(
    "",
    response_model=List[FlockResponse],
    summary="List bird groups",
    description="Retrieve all flocks belonging to the authenticated farmer with optional status filtering."
)
def list_flocks(
    status_filter: Optional[FlockStatus] = Query(None, alias="status", description="Filter by Active or Completed"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return []
    flocks = FlockService.get_flocks_by_farm(db, farm.id, status=status_filter)

    responses = []
    for f in flocks:
        resp = FlockResponse.model_validate(f)
        resp.house_name = f.house.name if f.house else None
        responses.append(resp)
    return responses


@router.post(
    "",
    response_model=FlockResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new bird group",
    description="Register a new flock under an active poultry house. Automatically records initial stocking."
)
def create_flock(
    data: FlockCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        flock = FlockService.create_flock(db, farm=farm, user=current_user, data=data)
        resp = FlockResponse.model_validate(flock)
        resp.house_name = flock.house.name if flock.house else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{id}",
    response_model=FlockDetailResponse,
    summary="Get flock details & ledger history",
    description="Retrieve flock specs along with full population movement ledger history."
)
def get_flock_detail(
    id: uuid.UUID,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    flock = FlockService.get_flock_by_id(db, id)
    if not flock or flock.farm_id != farm.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flock not found or does not belong to your farm."
        )

    # Reconcile movements
    total_inflows = sum(m.quantity for m in flock.movements if m.direction == MovementDirection.INFLOW)
    total_outflows = sum(m.quantity for m in flock.movements if m.direction == MovementDirection.OUTFLOW)

    movement_responses = []
    for m in flock.movements:
        m_resp = FlockMovementResponse.model_validate(m)
        m_resp.flock_name = flock.name
        movement_responses.append(m_resp)

    resp = FlockDetailResponse.model_validate(flock)
    resp.house_name = flock.house.name if flock.house else None
    resp.total_inflows = total_inflows
    resp.total_outflows = total_outflows
    resp.movements = movement_responses
    return resp


@router.post(
    "/movement",
    response_model=FlockMovementResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record bird count change",
    description="Record a population adjustment (acquisition, mortality, sale) inside an atomic transaction."
)
def record_flock_movement(
    data: FlockMovementCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        movement = FlockService.record_movement(db, farm=farm, user=current_user, data=data)
        resp = FlockMovementResponse.model_validate(movement)
        resp.flock_name = movement.flock.name if movement.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/transfer",
    response_model=FlockTransferResponse,
    summary="Transfer birds between flocks/houses",
    description="Transfer birds between two active flocks with destination house capacity validation."
)
def transfer_flock_birds(
    data: FlockTransferCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        result = FlockService.transfer_birds(db, farm=farm, user=current_user, data=data)

        source_resp = FlockResponse.model_validate(result["source_flock"])
        source_resp.house_name = result["source_flock"].house.name

        dest_resp = FlockResponse.model_validate(result["destination_flock"])
        dest_resp.house_name = result["destination_flock"].house.name

        movements = [
            FlockMovementResponse.model_validate(m) for m in result["movements"]
        ]

        return FlockTransferResponse(
            reference=result["reference"],
            source_flock=source_resp,
            destination_flock=dest_resp,
            movements=movements
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

