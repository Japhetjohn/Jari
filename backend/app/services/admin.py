import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.user import User
from app.models.farm import Farm
from app.models.flock import Flock
from app.models.kyc import KycApplication
from app.models.institution import InstitutionProfile
from app.shared.enums import UserRole


class AdminService:
    @staticmethod
    def get_platform_overview(db: Session) -> Dict[str, Any]:
        total_farmers = db.scalar(
            select(func.count(User.id)).where(User.role == UserRole.FARMER)
        ) or 0

        total_farms = db.scalar(
            select(func.count(Farm.id))
        ) or 0

        total_flocks = db.scalar(
            select(func.count(Flock.id))
        ) or 0

        active_birds = db.scalar(
            select(func.coalesce(func.sum(Flock.current_birds), 0)).where(
                Flock.status == "Active"
            )
        ) or 0

        pending_kyc_count = db.scalar(
            select(func.count(KycApplication.id)).where(
                KycApplication.status == "pending"
            )
        ) or 0

        approved_kyc_count = db.scalar(
            select(func.count(KycApplication.id)).where(
                KycApplication.status == "approved"
            )
        ) or 0

        total_institutions = db.scalar(
            select(func.count(InstitutionProfile.id))
        ) or 0

        pending_institutions_count = db.scalar(
            select(func.count(InstitutionProfile.id)).where(
                InstitutionProfile.status == "pending"
            )
        ) or 0

        return {
            "total_farmers": total_farmers,
            "total_farms": total_farms,
            "total_flocks": total_flocks,
            "active_birds": int(active_birds),
            "pending_kyc_count": pending_kyc_count,
            "approved_kyc_count": approved_kyc_count,
            "total_institutions": total_institutions,
            "pending_institutions_count": pending_institutions_count,
        }

    @staticmethod
    def get_verification_queue(
        db: Session,
        status_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = []

        # 1. Farmer KYC applications
        kyc_stmt = select(KycApplication).order_by(KycApplication.submitted_at.desc())
        if status_filter:
            kyc_stmt = kyc_stmt.where(KycApplication.status == status_filter)
        
        kyc_apps = list(db.scalars(kyc_stmt).all())
        for app in kyc_apps:
            results.append({
                "id": app.id,
                "item_type": "farmer_kyc",
                "entity_name": app.farm_name,
                "details": app.location,
                "phone": app.phone,
                "status": app.status,
                "submitted_at": app.submitted_at,
                "reviewed_at": app.reviewed_at,
                "review_note": app.review_note
            })

        # 2. Institutional verification applications
        inst_stmt = select(InstitutionProfile).order_by(InstitutionProfile.submitted_at.desc())
        if status_filter:
            inst_stmt = inst_stmt.where(InstitutionProfile.status == status_filter)

        inst_profiles = list(db.scalars(inst_stmt).all())
        for prof in inst_profiles:
            results.append({
                "id": prof.id,
                "item_type": "institution",
                "entity_name": prof.organisation_name,
                "details": f"{prof.organisation_type} - CAC: {prof.cac_registration_number}",
                "phone": prof.official_phone,
                "status": prof.status,
                "submitted_at": prof.submitted_at,
                "reviewed_at": prof.reviewed_at,
                "review_note": prof.review_note
            })

        # Sort combined queue by submitted_at descending
        results.sort(key=lambda x: x["submitted_at"], reverse=True)
        return results

    @staticmethod
    def review_verification(
        db: Session,
        item_id: uuid.UUID,
        admin_user_id: uuid.UUID,
        status: str,
        review_note: Optional[str] = None
    ) -> Dict[str, Any]:
        # Check if it's a KYC application
        kyc = db.scalar(select(KycApplication).where(KycApplication.id == item_id))
        if kyc:
            from app.services.kyc import KycService
            updated = KycService.review_application(
                db, kyc_id=item_id, admin_user_id=admin_user_id, status=status, review_note=review_note
            )
            return {
                "id": updated.id,
                "item_type": "farmer_kyc",
                "status": updated.status,
                "reviewed_at": updated.reviewed_at,
                "review_note": updated.review_note
            }

        # Check if it's an Institution profile
        inst = db.scalar(select(InstitutionProfile).where(InstitutionProfile.id == item_id))
        if inst:
            from app.services.institution import InstitutionService
            updated = InstitutionService.review_institution(
                db, institution_id=item_id, admin_user_id=admin_user_id, status=status, review_note=review_note
            )
            return {
                "id": updated.id,
                "item_type": "institution",
                "status": updated.status,
                "reviewed_at": updated.reviewed_at,
                "review_note": updated.review_note
            }

        raise ValueError(f"Verification item with id {item_id} not found.")

