import uuid
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from app.models.sale import Sale
from app.models.expense import Expense
from app.models.payment import FinancialPayment
from app.models.feed_purchase import FeedPurchase
from app.schemas.financial import FinancialOverviewResponse, FinancialTransactionItem
from app.services.sales import SalesService
from app.services.expenses import ExpenseService
from app.services.feed import FeedService


class FinancialLedgerService:
    @staticmethod
    def get_overview(
        db: Session,
        farm_id: uuid.UUID,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> FinancialOverviewResponse:
        sales = SalesService.get_sales(db, farm_id)
        expenses = ExpenseService.get_expenses(db, farm_id)
        feed_purchases = FeedService.get_purchases(db, farm_id)

        # Apply date filtering if provided
        if start_date:
            sales = [s for s in sales if s.date >= start_date]
            expenses = [e for e in expenses if e.date >= start_date]
            feed_purchases = [fp for fp in feed_purchases if fp.date >= start_date]
        if end_date:
            sales = [s for s in sales if s.date <= end_date]
            expenses = [e for e in expenses if e.date <= end_date]
            feed_purchases = [fp for fp in feed_purchases if fp.date <= end_date]

        total_sales = sum(Decimal(str(s.total_amount)) for s in sales)
        cash_received = sum(Decimal(str(s.amount_received)) for s in sales)
        outstanding_receivables = sum(Decimal(str(s.outstanding)) for s in sales)

        # Operational expenses (excluding general "Feed" category if farmer logged feed purchases separately,
        # but here we aggregate standard operating expenses + feed purchases without double counting).
        # We explicitly separate general operating expenses from direct feed purchases.
        other_expenses = [e for e in expenses if e.category.lower() != "feed"]
        expenses_feed_category = [e for e in expenses if e.category.lower() == "feed"]

        # If farmer entered feed purchases in feed module, prioritize FeedPurchase table
        if feed_purchases:
            feed_costs = sum(Decimal(str(fp.amount)) for fp in feed_purchases)
            feed_paid = sum(Decimal(str(fp.amount_paid)) for fp in feed_purchases)
            total_expenses = sum(Decimal(str(e.amount)) for e in other_expenses) + feed_costs
            cash_paid_out = sum(Decimal(str(e.amount_paid)) for e in other_expenses) + feed_paid
        else:
            feed_costs = sum(Decimal(str(e.amount)) for e in expenses_feed_category)
            feed_paid = sum(Decimal(str(e.amount_paid)) for e in expenses_feed_category)
            total_expenses = sum(Decimal(str(e.amount)) for e in expenses)
            cash_paid_out = sum(Decimal(str(e.amount_paid)) for e in expenses)

        outstanding_payables = max(Decimal("0.00"), total_expenses - cash_paid_out)
        net_cash_flow = cash_received - cash_paid_out
        operating_result = total_sales - total_expenses

        return FinancialOverviewResponse(
            total_sales=total_sales,
            cash_received=cash_received,
            outstanding_receivables=outstanding_receivables,
            total_expenses=total_expenses,
            feed_costs=feed_costs,
            cash_paid_out=cash_paid_out,
            outstanding_payables=outstanding_payables,
            net_cash_flow=net_cash_flow,
            operating_result=operating_result
        )

    @staticmethod
    def get_transactions(
        db: Session,
        farm_id: uuid.UUID,
        limit: int = 50
    ) -> List[FinancialTransactionItem]:
        sales = SalesService.get_sales(db, farm_id)
        expenses = ExpenseService.get_expenses(db, farm_id)
        feed_purchases = FeedService.get_purchases(db, farm_id)

        items: List[FinancialTransactionItem] = []

        # 1. Sales
        for s in sales:
            items.append(FinancialTransactionItem(
                id=s.id,
                date=s.date,
                type="Sale",
                description=f"Sale of {s.quantity} {s.unit} of {s.product}",
                category_or_product=s.product,
                amount=Decimal(str(s.total_amount)),
                direction="inflow",
                flock_name=s.flock.name if s.flock else None
            ))

        # 2. Operating Expenses (non-feed)
        for e in expenses:
            items.append(FinancialTransactionItem(
                id=e.id,
                date=e.date,
                type="Expense",
                description=f"Operating expense: {e.category}" + (f" ({e.note})" if e.note else ""),
                category_or_product=e.category,
                amount=Decimal(str(e.amount)),
                direction="outflow",
                flock_name=e.flock.name if e.flock else None
            ))

        # 3. Feed Purchases
        for fp in feed_purchases:
            items.append(FinancialTransactionItem(
                id=fp.id,
                date=fp.date,
                type="Feed Purchase",
                description=f"Purchase of {fp.quantity} {fp.unit} {fp.feed_type} feed ({fp.brand})",
                category_or_product=f"Feed: {fp.feed_type}",
                amount=Decimal(str(fp.amount)),
                direction="outflow",
                flock_name=fp.flock.name if fp.flock else None
            ))

        # Sort descending by date
        items.sort(key=lambda x: x.date, reverse=True)
        return items[:limit]

