import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.shared.enums import FlockStatus, FlockMovementType, MovementDirection


class FlockBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Flock or batch name")
    type: str = Field(default="Broiler", max_length=50, description="Poultry type (Broiler, Layer, Breeder)")
    house_id: uuid.UUID = Field(..., description="ID of assigned poultry house")
    breed: Optional[str] = Field(default=None, max_length=100, description="Breed or strain (e.g. Ross 308)")
    initial_birds: int = Field(..., gt=0, description="Opening number of birds (must be > 0)")
    acquisition_date: Optional[str] = Field(default=None, description="Date birds acquired (YYYY-MM-DD)")
    cycle_start: Optional[str] = Field(default=None, description="Date production cycle started")
    source: Optional[str] = Field(default=None, max_length=255, description="Hatchery or bird source")
    age_at_acquisition: Optional[int] = Field(default=None, ge=0, description="Age at acquisition")
    age_unit: Optional[str] = Field(default="Days", max_length=20, description="Unit of age (Days, Weeks)")
    purchase_cost: float = Field(default=0.0, ge=0.0, description="Total purchase cost")

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Flock name cannot be empty.")
        return val


class FlockCreate(FlockBase):
    pass


class FlockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    house_id: uuid.UUID
    house_name: Optional[str] = None
    name: str
    type: str
    breed: Optional[str] = None
    initial_birds: int
    current_birds: int
    acquisition_date: Optional[str] = None
    cycle_start: Optional[str] = None
    source: Optional[str] = None
    age_at_acquisition: Optional[int] = None
    age_unit: Optional[str] = None
    purchase_cost: float
    status: FlockStatus
    created_at: datetime
    updated_at: datetime


class FlockMovementCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Target flock ID")
    type: FlockMovementType = Field(..., description="Movement reason type")
    quantity: int = Field(..., gt=0, description="Number of birds changed (must be > 0)")
    date: str = Field(..., description="Date of change (YYYY-MM-DD)")
    reason: str = Field(..., min_length=2, max_length=255, description="Explanation for bird change")
    notes: Optional[str] = Field(default=None, description="Extra context or observations")

    @field_validator("reason")
    @classmethod
    def strip_reason(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Reason cannot be empty.")
        return val


class FlockMovementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    type: FlockMovementType
    direction: MovementDirection
    quantity: int
    date: str
    reason: str
    notes: Optional[str] = None
    source_house: Optional[str] = None
    destination_house: Optional[str] = None
    created_at: datetime


class FlockTransferCreate(BaseModel):
    source_flock_id: uuid.UUID = Field(..., description="Origin flock ID (must have enough birds)")
    destination_flock_id: uuid.UUID = Field(..., description="Target destination flock ID")
    quantity: int = Field(..., gt=0, description="Number of birds to transfer")
    date: str = Field(..., description="Date of transfer (YYYY-MM-DD)")
    reason: str = Field(..., min_length=2, max_length=255, description="Reason for transfer")
    notes: Optional[str] = Field(default=None, description="Additional transfer details")

    @field_validator("reason")
    @classmethod
    def strip_reason(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Reason cannot be empty.")
        return val


class FlockTransferResponse(BaseModel):
    reference: str
    source_flock: FlockResponse
    destination_flock: FlockResponse
    movements: List[FlockMovementResponse]


class FlockDetailResponse(FlockResponse):
    total_inflows: int = 0
    total_outflows: int = 0
    movements: List[FlockMovementResponse] = []

