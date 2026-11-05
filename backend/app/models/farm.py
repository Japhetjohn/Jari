import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, Date, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.poultry_house import PoultryHouse


class Farm(Base):
    __tablename__ = "farms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,  # Exactly one primary farm per farmer
        nullable=False,
        index=True
    )
    farm_name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    state: Mapped[str] = mapped_column(String(100), default="Plateau", nullable=False)
    lga: Mapped[str] = mapped_column(String(100), nullable=False)
    community: Mapped[str] = mapped_column(String(100), nullable=False)
    establishment_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    operation_type: Mapped[str] = mapped_column(String(50), default="Broiler", nullable=False)
    production_system: Mapped[str] = mapped_column(String(50), default="Deep litter", nullable=False)
    number_of_houses: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    water_source: Mapped[str] = mapped_column(String(50), default="Borehole", nullable=False)
    number_of_workers: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    biosecurity: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="farm")
    houses: Mapped[List["PoultryHouse"]] = relationship(
        "PoultryHouse",
        back_populates="farm",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Farm {self.farm_name} (owner_id={self.user_id})>"

