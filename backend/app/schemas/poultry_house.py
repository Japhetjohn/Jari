import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class PoultryHouseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="House reference or name (e.g. House A)")
    system: str = Field(default="Deep litter", max_length=50, description="Housing type/system")
    capacity: int = Field(..., gt=0, description="Maximum bird capacity (must be greater than 0)")
    water: str = Field(default="Borehole", max_length=50, description="Water source")
    feed_storage: bool = Field(default=True, description="Whether feed storage is available in the house")
    ventilation: Optional[str] = Field(default=None, max_length=100, description="Ventilation type")
    notes: Optional[str] = Field(default=None, description="Additional house observations")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("House name cannot be empty.")
        return val


class PoultryHouseCreate(PoultryHouseBase):
    pass


class PoultryHouseUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    system: Optional[str] = Field(default=None, max_length=50)
    capacity: Optional[int] = Field(default=None, gt=0)
    water: Optional[str] = Field(default=None, max_length=50)
    feed_storage: Optional[bool] = None
    ventilation: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            val = v.strip()
            if not val:
                raise ValueError("House name cannot be empty.")
            return val
        return v


class PoultryHouseResponse(PoultryHouseBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    is_archived: bool
    current_birds: Optional[int] = Field(
        default=0,
        description="Current active bird population (to be connected in Phase 3)"
    )
    available_capacity: Optional[int] = Field(
        default=None,
        description="Calculated available space (capacity - current_birds)"
    )
    created_at: datetime
    updated_at: datetime

