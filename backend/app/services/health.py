import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.health_incident import HealthIncident
from app.models.vaccination_record import VaccinationRecord
from app.models.treatment_record import TreatmentRecord
from app.models.user import User
from app.schemas.flock import FlockMovementCreate
from app.schemas.operations import (
    HealthIncidentCreate,
    HealthIncidentUpdate,
    VaccinationRecordCreate,
    TreatmentRecordCreate,
    HealthOverviewSummary,
)
from app.services.flock import FlockService
from app.shared.enums import FlockStatus, FlockMovementType


class HealthService:
    # --- HEALTH INCIDENTS ---

    @staticmethod
    def get_incidents(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None
    ) -> List[HealthIncident]:
        stmt = select(HealthIncident).where(HealthIncident.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(HealthIncident.flock_id == flock_id)
        stmt = stmt.order_by(HealthIncident.date.desc(), HealthIncident.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_incident_by_id(db: Session, incident_id: uuid.UUID) -> Optional[HealthIncident]:
        stmt = select(HealthIncident).where(HealthIncident.id == incident_id)
        return db.scalar(stmt)

    @staticmethod
    def create_incident(
        db: Session,
        farm: Farm,
        user: User,
        data: HealthIncidentCreate
    ) -> HealthIncident:
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("The selected bird group does not exist on your farm.")

        if flock.status != FlockStatus.ACTIVE:
            raise ValueError(f"Cannot record health incidents on completed flock '{flock.name}'.")

        if data.affected_birds > flock.current_birds:
            raise ValueError(
                f"Birds affected ({data.affected_birds}) cannot exceed current flock population ({flock.current_birds})."
            )

        if data.birds_lost > data.affected_birds:
            raise ValueError("Birds lost cannot exceed the number of birds affected.")

        if data.birds_lost > flock.current_birds:
            raise ValueError(
                f"Birds lost ({data.birds_lost}) cannot exceed current flock population ({flock.current_birds})."
            )

        # 1. Create the incident record in database session
        incident = HealthIncident(
            farm_id=farm.id,
            flock_id=flock.id,
            date=data.date,
            symptoms=data.symptoms.strip(),
            affected_birds=data.affected_birds,
            birds_lost=data.birds_lost,
            action=data.action.strip(),
            outcome=data.outcome.strip() if data.outcome else "Being monitored",
            notes=data.notes,
        )
        db.add(incident)

        # 2. If birds_lost > 0, deduct mortality via Phase 3 movement service in the same transaction
        if data.birds_lost > 0:
            FlockService.record_movement(
                db=db,
                farm=farm,
                user=user,
                data=FlockMovementCreate(
                    flock_id=flock.id,
                    type=FlockMovementType.MORTALITY,
                    quantity=data.birds_lost,
                    date=data.date,
                    reason=f"Mortality from health incident: {data.symptoms[:100]}",
                    notes=f"Linked to health incident {incident.id}"
                )
            )

        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def update_incident(
        db: Session,
        farm: Farm,
        incident_id: uuid.UUID,
        data: HealthIncidentUpdate
    ) -> HealthIncident:
        incident = HealthService.get_incident_by_id(db, incident_id)
        if not incident or incident.farm_id != farm.id:
            raise ValueError("Health incident not found or does not belong to your farm.")

        update_dict = data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(incident, field, value)

        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def delete_incident(
        db: Session,
        farm: Farm,
        user: User,
        incident_id: uuid.UUID
    ) -> HealthIncident:
        incident = HealthService.get_incident_by_id(db, incident_id)
        if not incident or incident.farm_id != farm.id:
            raise ValueError("Health incident not found or does not belong to your farm.")

        # If birds were lost in this incident, restore bird count via an Adjustment movement
        if incident.birds_lost > 0:
            FlockService.record_movement(
                db=db,
                farm=farm,
                user=user,
                data=FlockMovementCreate(
                    flock_id=incident.flock_id,
                    type=FlockMovementType.ADJUSTMENT,
                    quantity=incident.birds_lost,
                    date=incident.date,
                    reason=f"Compensating restoration: Health record {incident.id} removed",
                    notes=f"Restored {incident.birds_lost} birds originally lost in health incident."
                )
            )

        db.delete(incident)
        db.commit()
        return incident

    # --- VACCINATIONS ---

    @staticmethod
    def get_vaccinations(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None
    ) -> List[VaccinationRecord]:
        stmt = select(VaccinationRecord).where(VaccinationRecord.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(VaccinationRecord.flock_id == flock_id)
        stmt = stmt.order_by(VaccinationRecord.date.desc(), VaccinationRecord.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_vaccination(
        db: Session,
        farm: Farm,
        data: VaccinationRecordCreate
    ) -> VaccinationRecord:
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("The selected bird group does not exist on your farm.")

        if flock.status != FlockStatus.ACTIVE:
            raise ValueError(f"Cannot record vaccination on completed flock '{flock.name}'.")

        if data.birds > flock.current_birds:
            raise ValueError(
                f"Birds covered ({data.birds}) cannot exceed current flock population ({flock.current_birds})."
            )

        record = VaccinationRecord(
            farm_id=farm.id,
            flock_id=flock.id,
            vaccine=data.vaccine.strip(),
            date=data.date,
            birds=data.birds,
            next_date=data.next_date,
            given_by=data.given_by.strip() if data.given_by else None,
            notes=data.notes,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    # --- TREATMENTS ---

    @staticmethod
    def get_treatments(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None
    ) -> List[TreatmentRecord]:
        stmt = select(TreatmentRecord).where(TreatmentRecord.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(TreatmentRecord.flock_id == flock_id)
        stmt = stmt.order_by(TreatmentRecord.date.desc(), TreatmentRecord.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_treatment(
        db: Session,
        farm: Farm,
        data: TreatmentRecordCreate
    ) -> TreatmentRecord:
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("The selected bird group does not exist on your farm.")

        if flock.status != FlockStatus.ACTIVE:
            raise ValueError(f"Cannot record treatment on completed flock '{flock.name}'.")

        if data.birds_treated > flock.current_birds:
            raise ValueError(
                f"Birds treated ({data.birds_treated}) cannot exceed current flock population ({flock.current_birds})."
            )

        record = TreatmentRecord(
            farm_id=farm.id,
            flock_id=flock.id,
            treatment=data.treatment.strip(),
            medicine=data.medicine.strip() if data.medicine else None,
            date=data.date,
            birds_treated=data.birds_treated,
            given_by=data.given_by.strip() if data.given_by else None,
            notes=data.notes,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    # --- HEALTH OVERVIEW ---

    @staticmethod
    def get_health_overview(db: Session, farm_id: uuid.UUID) -> HealthOverviewSummary:
        incidents = HealthService.get_incidents(db, farm_id)
        vaccinations = HealthService.get_vaccinations(db, farm_id)
        treatments = HealthService.get_treatments(db, farm_id)

        return HealthOverviewSummary(
            total_incidents=len(incidents),
            total_birds_affected=sum(i.affected_birds for i in incidents),
            total_birds_lost=sum(i.birds_lost for i in incidents),
            total_vaccinations=len(vaccinations),
            total_treatments=len(treatments),
        )

