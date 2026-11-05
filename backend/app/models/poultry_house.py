import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.farm import Farm


class PoultryHouse(Base):
    __tablename__ = "poultry_houses"

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
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    system: Mapped[str] = mapped_column(String(50), default="Deep litter", nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    water: Mapped[str] = mapped_column(String(50), default="Borehole", nullable=False)
    feed_storage: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ventilation: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="houses")

    __table_args__ = (
        UniqueConstraint("farm_id", "name", name="uq_farm_house_name"),
    )

    def __repr__(self) -> str:
        return f"<PoultryHouse {self.name} (farm_id={self.farm_id}, cap={self.capacity})>"

