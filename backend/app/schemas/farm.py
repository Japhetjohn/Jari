import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class FarmBase(BaseModel):
    farm_name: str = Field(..., min_length=2, max_length=255, description="Registered name of poultry farm")
    owner_name: str = Field(..., min_length=2, max_length=255, description="Full name of owner")
    phone: str = Field(..., min_length=10, max_length=32, description="Contact phone number")
    state: str = Field(default="Plateau", min_length=2, max_length=100)
    lga: str = Field(..., min_length=2, max_length=100, description="Local Government Area")
    community: str = Field(..., min_length=2, max_length=100, description="Village or community")
    establishment_date: Optional[str] = Field(default=None, description="Date or year established (YYYY-MM-DD or string)")
    operation_type: str = Field(default="Broiler", description="Broiler, Layer, or Breeder")
    production_system: str = Field(default="Deep litter", description="Deep litter, Battery cage, Free range, or Other")
    number_of_houses: int = Field(default=0, ge=0, description="Number of poultry houses")
    water_source: str = Field(default="Borehole", description="Borehole, Well, Municipal, etc.")
    number_of_workers: int = Field(default=0, ge=0, description="Number of farm workers")
    biosecurity: List[str] = Field(default_factory=list, description="List of biosecurity measures practiced")

    @field_validator("farm_name", "owner_name", "lga", "community")
    @classmethod
    def strip_text(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Field cannot be empty.")
        return val


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    farm_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    owner_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=32)
    state: Optional[str] = Field(default=None, min_length=2, max_length=100)
    lga: Optional[str] = Field(default=None, min_length=2, max_length=100)
    community: Optional[str] = Field(default=None, min_length=2, max_length=100)
    establishment_date: Optional[str] = None
    operation_type: Optional[str] = None
    production_system: Optional[str] = None
    number_of_houses: Optional[int] = Field(default=None, ge=0)
    water_source: Optional[str] = None
    number_of_workers: Optional[int] = Field(default=None, ge=0)
    biosecurity: Optional[List[str]] = None


class FarmResponse(FarmBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

