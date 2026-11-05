import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.flock import Flock


class HealthIncident(Base):
    __tablename__ = "health_incidents"

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
    symptoms: Mapped[str] = mapped_column(String(500), nullable=False)
    affected_birds: Mapped[int] = mapped_column(Integer, nullable=False)
    birds_lost: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    action: Mapped[str] = mapped_column(String(255), default="Monitoring", nullable=False)
    outcome: Mapped[Optional[str]] = mapped_column(String(100), default="Being monitored", nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped["Flock"] = relationship("Flock")

    def __repr__(self) -> str:
        return f"<HealthIncident {self.symptoms} on {self.date}: {self.affected_birds} affected, {self.birds_lost} lost>"

