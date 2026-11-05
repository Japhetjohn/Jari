import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base
from app.shared.enums import FlockStatus

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.poultry_house import PoultryHouse
    from app.models.flock_movement import FlockMovement


class Flock(Base):
    __tablename__ = "flocks"

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
    house_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("poultry_houses.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="Broiler", nullable=False)
    breed: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    initial_birds: Mapped[int] = mapped_column(Integer, nullable=False)
    current_birds: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    acquisition_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    cycle_start: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    age_at_acquisition: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    age_unit: Mapped[Optional[str]] = mapped_column(String(20), default="Days", nullable=True)
    purchase_cost: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[FlockStatus] = mapped_column(
        SQLEnum(FlockStatus, name="flock_status", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=FlockStatus.ACTIVE,
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="flocks")
    house: Mapped["PoultryHouse"] = relationship("PoultryHouse", back_populates="flocks")
    movements: Mapped[List["FlockMovement"]] = relationship(
        "FlockMovement",
        back_populates="flock",
        cascade="all, delete-orphan",
        order_by="FlockMovement.created_at.asc()"
    )

    __table_args__ = (
        UniqueConstraint("farm_id", "name", name="uq_farm_flock_name"),
    )

    def __repr__(self) -> str:
        return f"<Flock {self.name} ({self.current_birds}/{self.initial_birds} birds, {self.status.value})>"

