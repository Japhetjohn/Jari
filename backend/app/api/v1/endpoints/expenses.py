import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.financial import (
    ExpenseCreate,
    ExpenseResponse,
    PaymentCreateRequest,
    PaymentEntryResponse,
)
from app.services.farm import FarmService
from app.services.expenses import ExpenseService
from app.shared.enums import UserRole

router = APIRouter(prefix="/expenses", tags=["Operating Expenses"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing expense records."
        )
    return farm


@router.get(
    "",
    response_model=List[ExpenseResponse],
    summary="List operating expenses",
    description="Retrieve all operational expenses for the authenticated farmer with optional category filtering."
)
def list_expenses(
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return []
    expenses = ExpenseService.get_expenses(db, farm.id, category=category)

    responses = []
    for e in expenses:
        resp = ExpenseResponse.model_validate(e)
        resp.flock_name = e.flock.name if e.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in e.payments]
        responses.append(resp)
    return responses


@router.post(
    "",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record an operating expense",
    description="Record farm expenditure with upfront payment tracking and balance calculation."
)
def create_expense(
    data: ExpenseCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        expense = ExpenseService.create_expense(db, farm=farm, data=data)
        resp = ExpenseResponse.model_validate(expense)
        resp.flock_name = expense.flock.name if expense.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in expense.payments]
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/{id}/payments",
    response_model=ExpenseResponse,
    summary="Record payment made for a bill",
    description="Record cash paid out against an outstanding operating expense balance."
)
def record_expense_payment(
    id: uuid.UUID,
    data: PaymentCreateRequest,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        expense = ExpenseService.record_payment(db, farm=farm, expense_id=id, data=data)
        resp = ExpenseResponse.model_validate(expense)
        resp.flock_name = expense.flock.name if expense.flock else None
        resp.payments = [PaymentEntryResponse.model_validate(p) for p in expense.payments]
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

