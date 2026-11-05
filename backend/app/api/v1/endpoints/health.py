import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import require_role
from app.models.user import User
from app.schemas.operations import (
    HealthIncidentCreate,
    HealthIncidentUpdate,
    HealthIncidentResponse,
    VaccinationRecordCreate,
    VaccinationRecordResponse,
    TreatmentRecordCreate,
    TreatmentRecordResponse,
    HealthOverviewSummary,
)
from app.services.farm import FarmService
from app.services.health import HealthService
from app.shared.enums import UserRole

router = APIRouter(prefix="/health", tags=["Poultry Health"])


def _get_farmer_farm(db: Session, user: User):
    farm = FarmService.get_farm_by_user(db, user.id)
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must register a farm before managing poultry health records."
        )
    return farm


# --- INCIDENTS ---

@router.get(
    "/incidents",
    response_model=List[HealthIncidentResponse],
    summary="List health incidents",
    description="Retrieve all health incidents for the farmer's bird groups."
)
def list_health_incidents(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    incidents = HealthService.get_incidents(db, farm.id, flock_id=flock_id)
    responses = []
    for inc in incidents:
        resp = HealthIncidentResponse.model_validate(inc)
        resp.flock_name = inc.flock.name if inc.flock else None
        responses.append(resp)
    return responses


@router.post(
    "/incidents",
    response_model=HealthIncidentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record health incident",
    description="Record an incident. If birds_lost > 0, automatically docks flock count via Phase 3 movement ledger in the same transaction."
)
def create_health_incident(
    data: HealthIncidentCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        incident = HealthService.create_incident(db, farm=farm, user=current_user, data=data)
        resp = HealthIncidentResponse.model_validate(incident)
        resp.flock_name = incident.flock.name if incident.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put(
    "/incidents/{id}",
    response_model=HealthIncidentResponse,
    summary="Update health incident",
    description="Update non-mortality fields of an incident without double-deducting flock counts."
)
def update_health_incident(
    id: uuid.UUID,
    data: HealthIncidentUpdate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        incident = HealthService.update_incident(db, farm=farm, incident_id=id, data=data)
        resp = HealthIncidentResponse.model_validate(incident)
        resp.flock_name = incident.flock.name if incident.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/incidents/{id}",
    response_model=HealthIncidentResponse,
    summary="Delete health incident",
    description="Remove an incident. Automatically compensates flock count via an Adjustment movement if mortality was recorded."
)
def delete_health_incident(
    id: uuid.UUID,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        removed = HealthService.delete_incident(db, farm=farm, user=current_user, incident_id=id)
        resp = HealthIncidentResponse.model_validate(removed)
        resp.flock_name = removed.flock.name if removed.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# --- VACCINATIONS ---

@router.get(
    "/vaccinations",
    response_model=List[VaccinationRecordResponse],
    summary="List vaccination logs",
    description="Retrieve all vaccination records for the farmer's bird groups."
)
def list_vaccinations(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    records = HealthService.get_vaccinations(db, farm.id, flock_id=flock_id)
    responses = []
    for r in records:
        resp = VaccinationRecordResponse.model_validate(r)
        resp.flock_name = r.flock.name if r.flock else None
        responses.append(resp)
    return responses


@router.post(
    "/vaccinations",
    response_model=VaccinationRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record vaccination",
    description="Log an administered vaccine with bird coverage validation."
)
def create_vaccination(
    data: VaccinationRecordCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        record = HealthService.create_vaccination(db, farm=farm, data=data)
        resp = VaccinationRecordResponse.model_validate(record)
        resp.flock_name = record.flock.name if record.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# --- TREATMENTS ---

@router.get(
    "/treatments",
    response_model=List[TreatmentRecordResponse],
    summary="List treatment logs",
    description="Retrieve medical or supportive treatment records for the farmer's bird groups."
)
def list_treatments(
    flock_id: Optional[uuid.UUID] = Query(None, description="Filter by flock ID"),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    records = HealthService.get_treatments(db, farm.id, flock_id=flock_id)
    responses = []
    for r in records:
        resp = TreatmentRecordResponse.model_validate(r)
        resp.flock_name = r.flock.name if r.flock else None
        responses.append(resp)
    return responses


@router.post(
    "/treatments",
    response_model=TreatmentRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record treatment",
    description="Record a veterinary or supportive treatment given to a bird group."
)
def create_treatment(
    data: TreatmentRecordCreate,
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    try:
        record = HealthService.create_treatment(db, farm=farm, data=data)
        resp = TreatmentRecordResponse.model_validate(record)
        resp.flock_name = record.flock.name if record.flock else None
        return resp
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# --- OVERVIEW ---

@router.get(
    "/overview",
    response_model=HealthOverviewSummary,
    summary="Health overview KPI summary",
    description="Return real aggregated health statistics from persisted records."
)
def get_health_overview(
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    farm = _get_farmer_farm(db, current_user)
    return HealthService.get_health_overview(db, farm.id)

