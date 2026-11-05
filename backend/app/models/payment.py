import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.sale import Sale
    from app.models.expense import Expense


class FinancialPayment(Base):
    __tablename__ = "financial_payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    sale_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sales.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    expense_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("expenses.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    kind: Mapped[str] = mapped_column(String(20), nullable=False)  # "sale" (inflow) or "expense" (outflow)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    sale: Mapped[Optional["Sale"]] = relationship("Sale", back_populates="payments")
    expense: Mapped[Optional["Expense"]] = relationship("Expense", back_populates="payments")

    def __repr__(self) -> str:
        return f"<FinancialPayment {self.kind}: {self.amount} NGN on {self.date}>"

