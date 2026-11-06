from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.kyc_and_institution import KycSubmitRequest, KycResponse
from app.services.kyc import KycService
from app.shared.enums import UserRole

router = APIRouter(prefix="/kyc", tags=["Farmer KYC"])


@router.get(
    "/me",
    response_model=Optional[KycResponse],
    summary="Get current farmer KYC application",
    description="Retrieve the KYC review status and details for the authenticated farmer."
)
def get_my_kyc(
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    application = KycService.get_by_user(db, current_user.id)
    if not application:
        return None
    return application


@router.post(
    "/submit",
    response_model=KycResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit or re-submit KYC application",
    description="Save or re-submit farm details for administrator verification."
)
def submit_kyc(
    payload: KycSubmitRequest,
    current_user: User = Depends(require_role(UserRole.FARMER)),
    db: Session = Depends(get_db)
):
    try:
        application = KycService.submit_application(
            db,
            user_id=current_user.id,
            farm_name=payload.farm_name,
            location=payload.location,
            phone=payload.phone
        )
        return application
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

