import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.kyc import KycApplication
from app.models.farm import Farm


class KycService:
    @staticmethod
    def get_by_user(db: Session, user_id: uuid.UUID) -> Optional[KycApplication]:
        return db.scalar(
            select(KycApplication).where(KycApplication.user_id == user_id)
        )

    @staticmethod
    def get_by_id(db: Session, kyc_id: uuid.UUID) -> Optional[KycApplication]:
        return db.scalar(
            select(KycApplication).where(KycApplication.id == kyc_id)
        )

    @staticmethod
    def submit_application(
        db: Session,
        user_id: uuid.UUID,
        farm_name: str,
        location: str,
        phone: str
    ) -> KycApplication:
        existing = KycService.get_by_user(db, user_id)
        if existing:
            if existing.status == "approved":
                raise ValueError("Farm KYC has already been approved.")
            if existing.status == "pending":
                raise ValueError("A farm review request is already pending.")
            
            # Re-submission after 'needs_changes' or 'rejected'
            existing.farm_name = farm_name.strip()
            existing.location = location.strip()
            existing.phone = phone.strip()
            existing.status = "pending"
            existing.submitted_at = datetime.utcnow()
            existing.reviewed_at = None
            existing.reviewed_by = None
            existing.review_note = None
            db.commit()
            db.refresh(existing)
            return existing

        # Find if user already has a registered farm
        farm = db.scalar(select(Farm).where(Farm.user_id == user_id))
        farm_id = farm.id if farm else None

        application = KycApplication(
            user_id=user_id,
            farm_id=farm_id,
            farm_name=farm_name.strip(),
            location=location.strip(),
            phone=phone.strip(),
            status="pending",
            submitted_at=datetime.utcnow()
        )
        db.add(application)
        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def review_application(
        db: Session,
        kyc_id: uuid.UUID,
        admin_user_id: uuid.UUID,
        status: str,
        review_note: Optional[str] = None
    ) -> KycApplication:
        application = KycService.get_by_id(db, kyc_id)
        if not application:
            raise ValueError("KYC application not found.")

        application.status = status
        application.reviewed_at = datetime.utcnow()
        application.reviewed_by = admin_user_id
        application.review_note = review_note.strip() if review_note else None

        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def list_applications(
        db: Session,
        status_filter: Optional[str] = None
    ) -> List[KycApplication]:
        stmt = select(KycApplication).order_by(KycApplication.submitted_at.desc())
        if status_filter:
            stmt = stmt.where(KycApplication.status == status_filter)
        return list(db.scalars(stmt).all())

