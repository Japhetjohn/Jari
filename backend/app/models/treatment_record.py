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


class TreatmentRecord(Base):
    __tablename__ = "treatment_records"

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
    treatment: Mapped[str] = mapped_column(String(160), nullable=False)
    medicine: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    birds_treated: Mapped[int] = mapped_column(Integer, nullable=False)
    given_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm")
    flock: Mapped["Flock"] = relationship("Flock")

    def __repr__(self) -> str:
        return f"<TreatmentRecord {self.treatment} ({self.medicine}) on {self.date}: {self.birds_treated} birds>"

