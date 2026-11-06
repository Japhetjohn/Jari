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


class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"

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
    vaccine: Mapped[str] = mapped_column(String(160), nullable=False)
    date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    birds: Mapped[int] = mapped_column(Integer, nullable=False)
    next_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    given_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped["Flock"] = relationship("Flock")

    def __repr__(self) -> str:
        return f"<VaccinationRecord {self.vaccine} on {self.date}: {self.birds} birds>"

