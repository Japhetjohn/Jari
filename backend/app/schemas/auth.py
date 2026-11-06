import re
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.shared.enums import UserRole, AccountStatus


def normalize_phone_number(v: str) -> str:
    cleaned = re.sub(r"\s+", "", v).strip()
    if not cleaned or len(cleaned) < 10:
        raise ValueError("Phone number must contain at least 10 digits.")
    return cleaned


class UserBase(BaseModel):
    phone: str = Field(..., description="User telephone number used for authentication")
    full_name: str = Field(..., min_length=2, max_length=255, description="Full name of user")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return normalize_phone_number(v)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        val = v.strip()
        if len(val) < 2:
            raise ValueError("Full name must be at least 2 characters long.")
        return val


class FarmerRegisterRequest(UserBase):
    password: str = Field(..., min_length=6, max_length=128, description="Password (min 6 characters)")
    role: Optional[UserRole] = Field(default=UserRole.FARMER, description="Account role (farmer or institutional_user)")

    @field_validator("password")

    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v


class LoginRequest(BaseModel):
    phone: str = Field(..., description="Registered phone number")
    password: str = Field(..., min_length=1, description="Account password")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        return normalize_phone_number(v)


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    phone: str
    role: UserRole
    status: AccountStatus
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

