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


class ProductionRecord(Base):
    __tablename__ = "production_records"

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
    date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    live_birds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    eggs_collected: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    good_eggs: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    damaged_eggs: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    birds_weighed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    average_weight: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    birds_ready: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped["Flock"] = relationship("Flock")

    def __repr__(self) -> str:
        return f"<ProductionRecord {self.type} on {self.date}: {self.eggs_collected} eggs, {self.birds_ready} ready>"

