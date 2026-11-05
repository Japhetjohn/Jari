import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.institution import InstitutionProfile
    from app.models.farm import Farm


class InstitutionFarmAccess(Base):
    __tablename__ = "institution_farm_access"
    __table_args__ = (
        UniqueConstraint("institution_id", "farm_id", name="uq_institution_farm_access"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("institution_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    access_status: Mapped[str] = mapped_column(String(50), default="active", nullable=False, index=True)
    granted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    institution: Mapped["InstitutionProfile"] = relationship("InstitutionProfile")
    farm: Mapped["Farm"] = relationship("Farm")

