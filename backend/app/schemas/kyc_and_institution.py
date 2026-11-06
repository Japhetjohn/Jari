import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr


# ==========================================
# Farmer KYC Schemas
# ==========================================

class KycSubmitRequest(BaseModel):
    farm_name: str = Field(..., min_length=2, max_length=120)
    location: str = Field(..., min_length=3, max_length=180)
    phone: str = Field(..., min_length=7, max_length=50)


class KycReviewRequest(BaseModel):
    status: str = Field(..., pattern="^(approved|needs_changes|rejected)$")
    review_note: Optional[str] = Field(None, max_length=500)


class KycResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    farm_id: Optional[uuid.UUID] = None
    farm_name: str
    location: str
    phone: str
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[uuid.UUID] = None
    review_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Document Schemas
# ==========================================

class DocumentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    document_type: str = Field(..., max_length=100)
    file_size: int = Field(..., gt=0, le=2_500_000)  # max ~2.5 MB (matching demo <= 1.5MB - 2MB)
    file_url: str = Field(...)  # Base64 dataUrl or storage URL


class DocumentResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    farm_id: Optional[uuid.UUID] = None
    name: str
    document_type: str
    file_size: int
    file_url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Institution Schemas
# ==========================================

class RepresentativeSchema(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class InstitutionRegistrationRequest(BaseModel):
    organisation_name: str = Field(..., min_length=2, max_length=255)
    organisation_type: str = Field(..., min_length=2, max_length=100)
    cac_registration_number: str = Field(..., min_length=2, max_length=100)
    year_established: Optional[int] = None
    official_email: str = Field(..., min_length=5, max_length=255)
    official_phone: str = Field(..., min_length=7, max_length=50)
    website: Optional[str] = None
    office_address: Optional[str] = None
    state: Optional[str] = None
    lga: Optional[str] = None
    categories: Optional[List[str]] = Field(default_factory=list)
    services: Optional[Dict[str, Any]] = Field(default_factory=dict)
    representative: Optional[Dict[str, Any]] = Field(default_factory=dict)
    documents: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class InstitutionReviewRequest(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")
    review_note: Optional[str] = Field(None, max_length=500)


class InstitutionProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    organisation_name: str
    organisation_type: str
    cac_registration_number: str
    year_established: Optional[int] = None
    official_email: str
    official_phone: str
    website: Optional[str] = None
    office_address: Optional[str] = None
    state: Optional[str] = None
    lga: Optional[str] = None
    categories: Optional[List[str]] = None
    services: Optional[Dict[str, Any]] = None
    representative: Optional[Dict[str, Any]] = None
    documents: Optional[List[Dict[str, Any]]] = None
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    review_note: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# Admin Schemas
# ==========================================

class AdminOverviewResponse(BaseModel):
    total_farmers: int
    total_farms: int
    total_flocks: int
    active_birds: int
    pending_kyc_count: int
    approved_kyc_count: int
    total_institutions: int
    pending_institutions_count: int


class AdminVerificationItem(BaseModel):
    id: uuid.UUID
    item_type: str  # 'farmer_kyc' or 'institution'
    entity_name: str
    details: str
    phone: str
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    review_note: Optional[str] = None


# ==========================================
# Risk Profile & Assessment Schemas
# ==========================================

class ProfileSignal(BaseModel):
    area: str
    status: str  # 'On record' | 'Follow up' | 'Not recorded'
    detail: str


class RiskProfileResponse(BaseModel):
    farm_id: uuid.UUID
    farmer_name: str
    farm_name: str
    location: str
    lga: Optional[str] = None
    state: Optional[str] = None
    production_type: str
    total_birds: int
    houses_count: int
    feed_records_count: int
    health_records_count: int
    vaccination_records_count: int
    production_records_count: int
    financial_records_count: int
    mortality_rate_percent: float
    risk_score: float
    risk_band: str
    signals: List[ProfileSignal]


class AssessmentCreateRequest(BaseModel):
    farm_id: uuid.UUID
    score: float = Field(..., ge=0, le=100)
    risk_band: str = Field(..., pattern="^(Low Risk|Moderate Risk|High Risk)$")
    metrics: Dict[str, Any] = Field(default_factory=dict)
    notes: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: uuid.UUID
    institution_id: uuid.UUID
    farm_id: uuid.UUID
    score: float
    risk_band: str
    metrics: Dict[str, Any]
    notes: Optional[str] = None
    assessed_at: datetime

    class Config:
        from_attributes = True

