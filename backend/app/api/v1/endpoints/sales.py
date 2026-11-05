import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.financial import (
    SaleCreate,
    SaleResponse,
    PaymentCreateRequest,
    PaymentEntryResponse,
)
from app.services.farm import FarmService
from app.services.sales import SalesService
from app.shared.enums import UserRole

router = APIRouter(prefix="/sales", tags=["Sales & Revenue"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing sales records."
        )
    return farm


@router.get(
    "",
    response_model=List[SaleResponse],
    summary="List sales records",
    description="Retrieve all sales records with payment status and history for the authenticated farmer."
)
def list_sales(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    product: Optional[str] = Query(None, description="Filter by product name"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return []
    sales = SalesService.get_sales(db, farm.id, flock_id=flock_id, product=product)

    responses = []
    for s in sales:
        resp = SaleResponse.model_validate(s)
        resp.flock_name = s.flock.name if s.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in s.payments]
        responses.append(resp)
    return responses


@router.post(
    "",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record a sale",
    description="Record a product or bird sale. Live bird sales automatically decrement the flock population in an atomic transaction."
)
def create_sale(
    data: SaleCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        sale = SalesService.create_sale(db, farm=farm, user=current_user, data=data)
        resp = SaleResponse.model_validate(sale)
        resp.flock_name = sale.flock.name if sale.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in sale.payments]
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/{id}/payments",
    response_model=SaleResponse,
    summary="Record payment received for a sale",
    description="Record a full or partial customer payment against an outstanding sale balance."
)
def record_sale_payment(
    id: uuid.UUID,
    data: PaymentCreateRequest,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        sale = SalesService.record_payment(db, farm=farm, sale_id=id, data=data)
        resp = SaleResponse.model_validate(sale)
        resp.flock_name = sale.flock.name if sale.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in sale.payments]
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

