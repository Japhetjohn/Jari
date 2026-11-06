import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class InstitutionProfile(Base):
    __tablename__ = "institution_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    organisation_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    organisation_type: Mapped[str] = mapped_column(String(100), nullable=False)
    cac_registration_number: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    year_established: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    official_email: Mapped[str] = mapped_column(String(255), nullable=False)
    official_phone: Mapped[str] = mapped_column(String(50), nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    office_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    lga: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Categories of support (Lending Institution, Insurance Provider, Grant Provider)
    categories: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    # Service terms and product configuration per category
    services: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    # Official representative details (fullName, jobTitle, email, phone)
    representative: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    # Uploaded verification documents metadata
    documents: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False, index=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reviewed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    review_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    reviewer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewed_by])

