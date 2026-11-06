import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.flock import Flock


class FeedPurchase(Base):
    __tablename__ = "feed_purchases"

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
    feed_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    brand: Mapped[str] = mapped_column(String(100), nullable=False)
    supplier: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), default="bags", nullable=False)
    bag_weight_kg: Mapped[float] = mapped_column(Float, default=25.0, nullable=False)
    total_quantity_kg: Mapped[float] = mapped_column(Float, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    amount_paid: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped[Optional["Flock"]] = relationship("Flock")

    def __repr__(self) -> str:
        return f"<FeedPurchase {self.feed_type}: {self.quantity} {self.unit} ({self.total_quantity_kg} kg)>"

