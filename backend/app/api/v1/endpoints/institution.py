import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.farm import FarmResponse
from app.schemas.kyc_and_institution import (
    InstitutionRegistrationRequest,
    InstitutionProfileResponse,
    RiskProfileResponse,
    AssessmentCreateRequest,
    AssessmentResponse,
)
from app.services.institution import InstitutionService
from app.services.risk_assessment import RiskAssessmentService
from app.shared.enums import UserRole

router = APIRouter(prefix="/institution", tags=["Institutional Portal"])


@router.get(
    "/me",
    response_model=InstitutionProfileResponse,
    summary="Get current institutional profile",
    description="Retrieve the organization profile and verification status for the authenticated institutional user."
)
def get_my_institution(
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.get_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No institutional profile found for this user."
        )
    return profile


@router.post(
    "/profile",
    response_model=InstitutionProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register or update institutional profile",
    description="Submit institutional details and service parameters for verification."
)
def register_or_update_profile(
    payload: InstitutionRegistrationRequest,
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.register_or_update(
        db,
        user_id=current_user.id,
        organisation_name=payload.organisation_name,
        organisation_type=payload.organisation_type,
        cac_registration_number=payload.cac_registration_number,
        official_email=payload.official_email,
        official_phone=payload.official_phone,
        year_established=payload.year_established,
        website=payload.website,
        office_address=payload.office_address,
        state=payload.state,
        lga=payload.lga,
        categories=payload.categories,
        services=payload.services,
        representative=payload.representative,
        documents=payload.documents
    )
    return profile


@router.get(
    "/farms",
    response_model=List[FarmResponse],
    summary="List portfolio farms",
    description="Retrieve list of farms authorized for portfolio viewing and risk assessment."
)
def list_portfolio_farms(
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.get_by_user(db, current_user.id)
    institution_id = profile.id if profile else uuid.uuid4()
    return RiskAssessmentService.get_portfolio_farms(db, institution_id=institution_id)


@router.post(
    "/farms/{farm_id}/grant-access",
    summary="Add farm to portfolio",
    description="Bookmark or link an authorized farm to the institution's portfolio."
)
def grant_access_to_farm(
    farm_id: uuid.UUID,
    notes: Optional[str] = Query(None),
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.get_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must have an institutional profile registered before adding farms."
        )

    access = RiskAssessmentService.grant_farm_access(
        db, institution_id=profile.id, farm_id=farm_id, notes=notes
    )
    return {"status": "access_granted", "farm_id": str(farm_id), "institution_id": str(profile.id)}


@router.get(
    "/farms/{farm_id}/risk-profile",
    response_model=RiskProfileResponse,
    summary="Compute deterministic farm risk profile",
    description="Calculate live risk score, risk band, signals, and operations continuity metrics."
)
def get_farm_risk_profile(
    farm_id: uuid.UUID,
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    try:
        profile_data = RiskAssessmentService.get_farm_risk_profile(db, farm_id)
        return profile_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post(
    "/assessments",
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save underwriting risk assessment record",
    description="Persist an institutional risk assessment or underwriting record."
)
def create_assessment(
    payload: AssessmentCreateRequest,
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.get_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must have an institutional profile registered before saving assessments."
        )

    assessment = RiskAssessmentService.create_assessment(
        db,
        institution_id=profile.id,
        farm_id=payload.farm_id,
        score=payload.score,
        risk_band=payload.risk_band,
        metrics=payload.metrics,
        notes=payload.notes
    )
    return assessment


@router.get(
    "/assessments",
    response_model=List[AssessmentResponse],
    summary="List institution's risk assessments",
    description="Retrieve all historical underwriting and risk assessments saved by this institution."
)
def list_assessments(
    farm_id: Optional[str] = Query(None),
    current_user: User = Depends(require_role(UserRole.INSTITUTIONAL_USER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    profile = InstitutionService.get_by_user(db, current_user.id)
    if not profile:
        return []

    parsed_farm_id = None
    if farm_id and farm_id.strip() and farm_id != "undefined" and farm_id != "null":
        try:
            parsed_farm_id = uuid.UUID(farm_id.strip())
        except ValueError:
            parsed_farm_id = None

    return RiskAssessmentService.list_assessments(db, institution_id=profile.id, farm_id=parsed_farm_id)

