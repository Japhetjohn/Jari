from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import (
    FarmerRegisterRequest,
    LoginRequest,
    TokenResponse,
    UserProfileResponse,
)
from app.services.auth import AuthService
from app.shared.enums import AccountStatus

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register as a farmer",
    description="Public endpoint to create a farmer account. Phone number must be unique."
)
def register_farmer(
    data: FarmerRegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        user = AuthService.register_farmer(db, data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User login",
    description="Authenticate with phone number and password to obtain a JWT bearer token."
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(db, phone=data.phone, password=data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != AccountStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended."
        )

    access_token = create_access_token(
        subject=user.id,
        role=user.role.value
    )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Current authenticated user",
    description="Get profile information for the currently authenticated bearer token user."
)
def read_current_user(
    current_user: User = Depends(get_current_user)
):
    return current_user

