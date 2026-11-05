import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.flock import Flock
    from app.models.payment import FinancialPayment


class Sale(Base):
    __tablename__ = "sales"

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
    flock_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("flocks.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    product: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="Units", nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    amount_received: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, nullable=False)
    outstanding: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Unpaid", nullable=False, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped[Optional["Flock"]] = relationship("Flock")
    payments: Mapped[List["FinancialPayment"]] = relationship(
        "FinancialPayment",
        back_populates="sale",
        cascade="all, delete-orphan",
        order_by="FinancialPayment.created_at.asc()"
    )

    def __repr__(self) -> str:
        return f"<Sale {self.product} ({self.total_amount} NGN, status={self.status})>"

