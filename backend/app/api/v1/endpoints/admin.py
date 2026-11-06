import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.kyc_and_institution import (
    AdminOverviewResponse,
    AdminVerificationItem,
    KycReviewRequest,
    InstitutionProfileResponse,
)
from app.schemas.auth import UserProfileResponse
from app.services.admin import AdminService
from app.services.institution import InstitutionService
from app.shared.enums import UserRole

router = APIRouter(prefix="/admin", tags=["Admin Platform Management"])


@router.get(
    "/overview",
    response_model=AdminOverviewResponse,
    summary="Get platform overview metrics",
    description="Retrieve aggregate platform metrics including farmers, flocks, birds, institutions, and pending reviews."
)
def get_overview(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    return AdminService.get_platform_overview(db)


@router.get(
    "/verifications",
    response_model=List[AdminVerificationItem],
    summary="List verification review queue",
    description="Retrieve pending and processed verification requests across farmers and institutions."
)
def list_verifications(
    status: Optional[str] = Query(None, description="Filter by status (pending, approved, needs_changes, rejected)"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    return AdminService.get_verification_queue(db, status_filter=status)


@router.post(
    "/verifications/{item_id}/review",
    summary="Submit verification review decision",
    description="Record an approval, rejection, or request for changes with review notes."
)
def review_verification(
    item_id: uuid.UUID,
    payload: KycReviewRequest,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    try:
        result = AdminService.review_verification(
            db,
            item_id=item_id,
            admin_user_id=current_user.id,
            status=payload.status,
            review_note=payload.review_note
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get(
    "/farmers",
    response_model=List[UserProfileResponse],
    summary="List all registered farmers",
    description="Administrative listing of all farmer accounts on the JARI platform."
)
def list_farmers(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farmers = list(
        db.scalars(
            select(User)
            .where(User.role == UserRole.FARMER)
            .order_by(User.created_at.desc())
        ).all()
    )
    return farmers


@router.get(
    "/institutions",
    response_model=List[InstitutionProfileResponse],
    summary="List all registered institutions",
    description="Administrative listing of all financial institutions, insurance providers, and grant makers."
)
def list_institutions(
    status: Optional[str] = Query(None, description="Filter by status (pending, approved, rejected)"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    return InstitutionService.list_institutions(db, status_filter=status)

