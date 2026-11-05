import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.institution import InstitutionProfile


class InstitutionService:
    @staticmethod
    def get_by_user(db: Session, user_id: uuid.UUID) -> Optional[InstitutionProfile]:
        return db.scalar(
            select(InstitutionProfile).where(InstitutionProfile.user_id == user_id)
        )

    @staticmethod
    def get_by_id(db: Session, institution_id: uuid.UUID) -> Optional[InstitutionProfile]:
        return db.scalar(
            select(InstitutionProfile).where(InstitutionProfile.id == institution_id)
        )

    @staticmethod
    def register_or_update(
        db: Session,
        user_id: uuid.UUID,
        organisation_name: str,
        organisation_type: str,
        cac_registration_number: str,
        official_email: str,
        official_phone: str,
        year_established: Optional[int] = None,
        website: Optional[str] = None,
        office_address: Optional[str] = None,
        state: Optional[str] = None,
        lga: Optional[str] = None,
        categories: Optional[List[str]] = None,
        services: Optional[Dict[str, Any]] = None,
        representative: Optional[Dict[str, Any]] = None,
        documents: Optional[List[Dict[str, Any]]] = None
    ) -> InstitutionProfile:
        profile = InstitutionService.get_by_user(db, user_id)
        if profile:
            profile.organisation_name = organisation_name.strip()
            profile.organisation_type = organisation_type.strip()
            profile.cac_registration_number = cac_registration_number.strip()
            profile.official_email = official_email.strip()
            profile.official_phone = official_phone.strip()
            profile.year_established = year_established
            profile.website = website.strip() if website else None
            profile.office_address = office_address.strip() if office_address else None
            profile.state = state.strip() if state else None
            profile.lga = lga.strip() if lga else None
            if categories is not None:
                profile.categories = categories
            if services is not None:
                profile.services = services
            if representative is not None:
                profile.representative = representative
            if documents is not None:
                profile.documents = documents
            profile.status = "pending"
            profile.submitted_at = datetime.utcnow()
            profile.reviewed_at = None
            profile.reviewed_by = None
            profile.review_note = None
            db.commit()
            db.refresh(profile)
            return profile

        profile = InstitutionProfile(
            user_id=user_id,
            organisation_name=organisation_name.strip(),
            organisation_type=organisation_type.strip(),
            cac_registration_number=cac_registration_number.strip(),
            year_established=year_established,
            official_email=official_email.strip(),
            official_phone=official_phone.strip(),
            website=website.strip() if website else None,
            office_address=office_address.strip() if office_address else None,
            state=state.strip() if state else None,
            lga=lga.strip() if lga else None,
            categories=categories or [],
            services=services or {},
            representative=representative or {},
            documents=documents or [],
            status="pending",
            submitted_at=datetime.utcnow()
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def review_institution(
        db: Session,
        institution_id: uuid.UUID,
        admin_user_id: uuid.UUID,
        status: str,
        review_note: Optional[str] = None
    ) -> InstitutionProfile:
        profile = InstitutionService.get_by_id(db, institution_id)
        if not profile:
            raise ValueError("Institution profile not found.")

        profile.status = status
        profile.reviewed_at = datetime.utcnow()
        profile.reviewed_by = admin_user_id
        profile.review_note = review_note.strip() if review_note else None

        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def list_institutions(
        db: Session,
        status_filter: Optional[str] = None
    ) -> List[InstitutionProfile]:
        stmt = select(InstitutionProfile).order_by(InstitutionProfile.submitted_at.desc())
        if status_filter:
            stmt = stmt.where(InstitutionProfile.status == status_filter)
        return list(db.scalars(stmt).all())

