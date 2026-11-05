import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


# --- FEED SCHEMAS ---

class FeedPurchaseCreate(BaseModel):
    date: str = Field(..., description="Purchase date (YYYY-MM-DD)")
    feed_type: str = Field(..., min_length=2, max_length=50, description="Starter, Grower, Finisher, Layer, Breeder, etc.")
    brand: str = Field(..., min_length=1, max_length=100, description="Brand name")
    supplier: Optional[str] = Field(default=None, max_length=255, description="Supplier name/depot")
    quantity: float = Field(..., gt=0, description="Quantity purchased")
    unit: str = Field(default="bags", description="'bags' or 'kg'")
    bag_weight_kg: float = Field(default=25.0, gt=0, description="Weight per bag in kg if unit is bags")
    amount: float = Field(..., ge=0, description="Total purchase cost")
    amount_paid: float = Field(default=0.0, ge=0, description="Amount paid so far")
    flock_id: Optional[uuid.UUID] = Field(default=None, description="Optional linked flock ID")
    notes: Optional[str] = Field(default=None, description="Extra purchase notes")

    @field_validator("feed_type", "brand")
    @classmethod
    def strip_text(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Field cannot be empty.")
        return val


class FeedPurchaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: Optional[uuid.UUID] = None
    flock_name: Optional[str] = None
    date: str
    feed_type: str
    brand: str
    supplier: Optional[str] = None
    quantity: float
    unit: str
    bag_weight_kg: float
    total_quantity_kg: float
    amount: float
    amount_paid: float
    notes: Optional[str] = None
    created_at: datetime


class FeedConsumptionCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Target flock using feed")
    date: str = Field(..., description="Consumption date (YYYY-MM-DD)")
    feed_type: str = Field(..., min_length=2, max_length=50, description="Feed type used")
    quantity_kg: float = Field(..., gt=0, description="Quantity consumed in kilograms")
    notes: Optional[str] = Field(default=None, description="Usage notes")

    @field_validator("feed_type")
    @classmethod
    def strip_feed_type(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Feed type cannot be empty.")
        return val


class FeedConsumptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    date: str
    feed_type: str
    quantity_kg: float
    notes: Optional[str] = None
    created_at: datetime


class FeedInventoryItem(BaseModel):
    feed_type: str
    bought_kg: float
    used_kg: float
    available_kg: float


class FeedInventorySummary(BaseModel):
    total_bought_kg: float
    total_used_kg: float
    total_available_kg: float
    total_spent: float
    items: List[FeedInventoryItem]


# --- PRODUCTION SCHEMAS ---

class ProductionRecordCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Flock being logged")
    date: str = Field(..., description="Date of log (YYYY-MM-DD)")
    type: str = Field(default="Broiler", description="Broiler, Layer, Breeder")
    live_birds: int = Field(default=0, ge=0, description="Current live birds observed")
    eggs_collected: int = Field(default=0, ge=0, description="Total eggs collected")
    good_eggs: int = Field(default=0, ge=0, description="Good quality eggs")
    damaged_eggs: int = Field(default=0, ge=0, description="Cracked / broken eggs")
    birds_weighed: int = Field(default=0, ge=0, description="Sample size of weighed birds")
    average_weight: float = Field(default=0.0, ge=0.0, description="Average weight in kg")
    birds_ready: int = Field(default=0, ge=0, description="Birds ready for harvest/sale")
    notes: Optional[str] = Field(default=None, description="Observation notes")


class ProductionRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    date: str
    type: str
    live_birds: int
    eggs_collected: int
    good_eggs: int
    damaged_eggs: int
    birds_weighed: int
    average_weight: float
    birds_ready: int
    notes: Optional[str] = None
    created_at: datetime


class ProductionSummary(BaseModel):
    total_records: int
    total_eggs_collected: int
    total_good_eggs: int
    total_damaged_eggs: int
    total_birds_ready: int
    overall_average_weight: float


# --- HEALTH SCHEMAS ---

class HealthIncidentCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Flock affected")
    date: str = Field(..., description="Incident date (YYYY-MM-DD)")
    symptoms: str = Field(..., min_length=2, max_length=500, description="Symptoms observed")
    affected_birds: int = Field(..., gt=0, description="Number of birds showing symptoms")
    birds_lost: int = Field(default=0, ge=0, description="Mortality count (if any)")
    action: str = Field(default="Monitoring", max_length=255, description="Action taken")
    outcome: Optional[str] = Field(default="Being monitored", max_length=100, description="Outcome status")
    notes: Optional[str] = Field(default=None, description="Additional incident notes")


class HealthIncidentUpdate(BaseModel):
    date: Optional[str] = None
    symptoms: Optional[str] = Field(default=None, min_length=2, max_length=500)
    affected_birds: Optional[int] = Field(default=None, gt=0)
    action: Optional[str] = Field(default=None, max_length=255)
    outcome: Optional[str] = Field(default=None, max_length=100)
    notes: Optional[str] = None


class HealthIncidentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    date: str
    symptoms: str
    affected_birds: int
    birds_lost: int
    action: str
    outcome: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime


class VaccinationRecordCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Flock vaccinated")
    vaccine: str = Field(..., min_length=2, max_length=160, description="Vaccine name")
    date: str = Field(..., description="Date administered (YYYY-MM-DD)")
    birds: int = Field(..., gt=0, description="Number of birds covered")
    next_date: Optional[str] = Field(default=None, description="Next scheduled date (YYYY-MM-DD)")
    given_by: Optional[str] = Field(default=None, max_length=100, description="Administrator name or role")
    notes: Optional[str] = Field(default=None, description="Extra notes")


class VaccinationRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    vaccine: str
    date: str
    birds: int
    next_date: Optional[str] = None
    given_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime


class TreatmentRecordCreate(BaseModel):
    flock_id: uuid.UUID = Field(..., description="Flock treated")
    treatment: str = Field(..., min_length=2, max_length=160, description="Care or treatment given")
    medicine: Optional[str] = Field(default=None, max_length=120, description="Medicine used")
    date: str = Field(..., description="Date given (YYYY-MM-DD)")
    birds_treated: int = Field(..., gt=0, description="Number of birds treated")
    given_by: Optional[str] = Field(default=None, max_length=100, description="Administered by")
    notes: Optional[str] = Field(default=None, description="Treatment notes")


class TreatmentRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: uuid.UUID
    flock_name: Optional[str] = None
    treatment: str
    medicine: Optional[str] = None
    date: str
    birds_treated: int
    given_by: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime


class HealthOverviewSummary(BaseModel):
    total_incidents: int
    total_birds_affected: int
    total_birds_lost: int
    total_vaccinations: int
    total_treatments: int

