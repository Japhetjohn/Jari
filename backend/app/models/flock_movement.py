import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base
from app.shared.enums import FlockMovementType, MovementDirection

if TYPE_CHECKING:
    from app.models.flock import Flock
    from app.models.farm import Farm
    from app.models.user import User


class FlockMovement(Base):
    __tablename__ = "flock_movements"

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
    flock_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("flocks.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    type: Mapped[FlockMovementType] = mapped_column(
        SQLEnum(FlockMovementType, name="flock_movement_type", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        index=True
    )
    direction: Mapped[MovementDirection] = mapped_column(
        SQLEnum(MovementDirection, name="movement_direction", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        index=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_house: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    destination_house: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    flock: Mapped["Flock"] = relationship("Flock", back_populates="movements")

    def __repr__(self) -> str:
        return f"<FlockMovement {self.type.value}: {self.direction.value} {self.quantity} birds ({self.date})>"

