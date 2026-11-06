import uuid
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.expense import Expense
from app.models.payment import FinancialPayment
from app.schemas.financial import ExpenseCreate, PaymentCreateRequest
from app.services.flock import FlockService


class ExpenseService:
    @staticmethod
    def get_expenses(
        db: Session,
        farm_id: uuid.UUID,
        category: Optional[str] = None
    ) -> List[Expense]:
        stmt = select(Expense).where(Expense.farm_id == farm_id)
        if category:
            stmt = stmt.where(Expense.category.ilike(category.strip()))
        stmt = stmt.order_by(Expense.date.desc(), Expense.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_expense_by_id(db: Session, expense_id: uuid.UUID) -> Optional[Expense]:
        stmt = select(Expense).where(Expense.id == expense_id)
        return db.scalar(stmt)

    @staticmethod
    def create_expense(
        db: Session,
        farm: Farm,
        data: ExpenseCreate
    ) -> Expense:
        if data.amount_paid > data.amount:
            raise ValueError(
                f"Amount paid (₦{data.amount_paid}) cannot exceed total expense amount (₦{data.amount})."
            )

        flock: Optional[Flock] = None
        if data.flock_id:
            flock = FlockService.get_flock_by_id(db, data.flock_id)
            if not flock or flock.farm_id != farm.id:
                raise ValueError("The linked flock does not exist on your farm.")

        outstanding = data.amount - data.amount_paid
        status = "Paid" if outstanding == 0 else ("Part paid" if data.amount_paid > 0 else "Unpaid")

        expense = Expense(
            farm_id=farm.id,
            flock_id=flock.id if flock else None,
            date=data.date,
            category=data.category.strip(),
            amount=data.amount,
            amount_paid=data.amount_paid,
            outstanding=outstanding,
            status=status,
            note=data.note,
        )
        db.add(expense)
        db.flush()

        if data.amount_paid > 0:
            payment = FinancialPayment(
                farm_id=farm.id,
                expense_id=expense.id,
                kind="expense",
                amount=data.amount_paid,
                date=data.date,
                note="Payment made when expense was recorded",
            )
            db.add(payment)

        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def record_payment(
        db: Session,
        farm: Farm,
        expense_id: uuid.UUID,
        data: PaymentCreateRequest
    ) -> Expense:
        expense = ExpenseService.get_expense_by_id(db, expense_id)
        if not expense or expense.farm_id != farm.id:
            raise ValueError("Expense record not found or does not belong to your farm.")

        if expense.outstanding <= 0:
            raise ValueError(f"Expense '{expense.category}' is already fully paid.")

        if data.amount > expense.outstanding:
            raise ValueError(
                f"Payment amount (₦{data.amount}) cannot exceed outstanding bill balance (₦{expense.outstanding})."
            )

        payment = FinancialPayment(
            farm_id=farm.id,
            expense_id=expense.id,
            kind="expense",
            amount=data.amount,
            date=data.date,
            note=data.note,
        )
        db.add(payment)

        # Update expense balances
        expense.amount_paid += data.amount
        expense.outstanding -= data.amount
        expense.status = "Paid" if expense.outstanding == 0 else "Part paid"

        db.commit()
        db.refresh(expense)
        return expense

