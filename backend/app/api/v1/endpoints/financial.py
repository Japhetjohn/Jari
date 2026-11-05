from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.financial import (
    FinancialOverviewResponse,
    FinancialTransactionItem,
)
from app.services.farm import FarmService
from app.services.financial import FinancialLedgerService
from app.shared.enums import UserRole

router = APIRouter(prefix="/financial", tags=["Financial Ledgers & Overview"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before viewing financial ledgers."
        )
    return farm


@router.get(
    "/overview",
    response_model=FinancialOverviewResponse,
    summary="Get farm financial overview",
    description="Calculate total sales revenue, cash received, receivables, expenses, feed costs, cash paid, and net cash flow."
)
def get_financial_overview(
    start_date: Optional[str] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date filter (YYYY-MM-DD)"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return FinancialOverviewResponse(
            total_sales=Decimal("0.0"),
            cash_received=Decimal("0.0"),
            outstanding_receivables=Decimal("0.0"),
            total_expenses=Decimal("0.0"),
            feed_costs=Decimal("0.0"),
            cash_paid_out=Decimal("0.0"),
            outstanding_payables=Decimal("0.0"),
            net_cash_flow=Decimal("0.0"),
            operating_result=Decimal("0.0"),
        )
    return FinancialLedgerService.get_overview(
        db,
        farm.id,
        start_date=start_date,
        end_date=end_date
    )


@router.get(
    "/transactions",
    response_model=List[FinancialTransactionItem],
    summary="List chronological financial transactions",
    description="Unified chronological feed of sales, expenses, and feed purchases."
)
def get_financial_transactions(
    limit: int = Query(50, ge=1, le=200, description="Number of transactions to return"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = FarmService.get_farm_by_user(db, current_user.id)
    if not farm:
        return []
    return FinancialLedgerService.get_transactions(db, farm.id, limit=limit)

