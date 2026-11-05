import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.farm import Farm
from app.models.user import User
from app.models.poultry_house import PoultryHouse
from app.models.flock import Flock
from app.models.flock_movement import FlockMovement
from app.models.feed_purchase import FeedPurchase
from app.models.feed_consumption import FeedConsumption
from app.models.production_record import ProductionRecord
from app.models.health_incident import HealthIncident
from app.models.vaccination_record import VaccinationRecord
from app.models.sale import Sale
from app.models.expense import Expense
from app.models.kyc import KycApplication
from app.models.institution_access import InstitutionFarmAccess
from app.models.assessment import FarmRiskAssessment


class RiskAssessmentService:
    @staticmethod
    def get_farm_risk_profile(db: Session, farm_id: uuid.UUID) -> Dict[str, Any]:
        farm = db.scalar(select(Farm).where(Farm.id == farm_id))
        if not farm:
            raise ValueError(f"Farm with id {farm_id} not found.")

        owner = db.scalar(select(User).where(User.id == farm.user_id))
        farmer_name = owner.full_name if owner else "Unknown Farmer"

        # 1. Flocks & Population
        flocks = list(db.scalars(select(Flock).where(Flock.farm_id == farm_id)).all())
        total_birds = sum(f.current_birds for f in flocks if f.status == "Active")
        total_initial = sum(f.initial_birds for f in flocks)
        
        # Houses count
        houses_count = db.scalar(
            select(func.count(PoultryHouse.id)).where(
                PoultryHouse.farm_id == farm_id,
                PoultryHouse.is_archived == False
            )
        ) or 0

        # Mortality calculation
        mortality_birds = db.scalar(
            select(func.coalesce(func.sum(FlockMovement.quantity), 0)).where(
                FlockMovement.farm_id == farm_id,
                FlockMovement.movement_type == "Mortality"
            )
        ) or 0

        mortality_rate_percent = 0.0
        if total_initial > 0:
            mortality_rate_percent = round((mortality_birds / total_initial) * 100, 2)

        # 2. Operations counts
        feed_purchases_count = db.scalar(
            select(func.count(FeedPurchase.id)).where(FeedPurchase.farm_id == farm_id)
        ) or 0
        feed_consumptions_count = db.scalar(
            select(func.count(FeedConsumption.id)).where(FeedConsumption.farm_id == farm_id)
        ) or 0
        feed_records_count = feed_purchases_count + feed_consumptions_count

        production_records_count = db.scalar(
            select(func.count(ProductionRecord.id)).where(ProductionRecord.farm_id == farm_id)
        ) or 0

        # 3. Health counts
        health_records_count = db.scalar(
            select(func.count(HealthIncident.id)).where(HealthIncident.farm_id == farm_id)
        ) or 0
        vaccination_records_count = db.scalar(
            select(func.count(VaccinationRecord.id)).where(VaccinationRecord.farm_id == farm_id)
        ) or 0

        # 4. Financial counts
        sales_count = db.scalar(
            select(func.count(Sale.id)).where(Sale.farm_id == farm_id)
        ) or 0
        expenses_count = db.scalar(
            select(func.count(Expense.id)).where(Expense.farm_id == farm_id)
        ) or 0
        financial_records_count = sales_count + expenses_count

        # 5. KYC Status
        kyc = db.scalar(select(KycApplication).where(KycApplication.user_id == farm.user_id))
        kyc_status = kyc.status if kyc else "none"

        # 6. Biosecurity
        biosecurity_list = farm.biosecurity or []
        biosecurity_score = len(biosecurity_list)

        # Deterministic Score Formula (Base 100)
        score = 100.0

        # Factor A: Mortality rate
        if mortality_rate_percent > 10.0:
            score -= 25.0
        elif mortality_rate_percent > 5.0:
            score -= 12.0

        # Factor B: Biosecurity
        if biosecurity_score < 2:
            score -= 15.0
        elif biosecurity_score < 4:
            score -= 8.0

        # Factor C: KYC Status
        if kyc_status == "approved":
            pass  # Verified, no deduction
        elif kyc_status == "pending":
            score -= 10.0
        elif kyc_status == "needs_changes":
            score -= 15.0
        else:
            score -= 20.0

        # Factor D: Operational records
        if feed_records_count == 0:
            score -= 5.0
        if vaccination_records_count == 0:
            score -= 5.0
        if financial_records_count == 0:
            score -= 5.0

        score = max(0.0, min(100.0, score))

        if score >= 75.0:
            risk_band = "Low Risk"
        elif score >= 50.0:
            risk_band = "Moderate Risk"
        else:
            risk_band = "High Risk"

        # Formulate signals matching frontend insurance-risk-profiles.tsx
        signals = [
            {
                "area": "Vaccination history",
                "status": "On record" if vaccination_records_count >= 2 else ("Follow up" if vaccination_records_count == 1 else "Not recorded"),
                "detail": f"{vaccination_records_count} vaccination entries recorded for flocks." if vaccination_records_count > 0 else "No vaccination entries saved."
            },
            {
                "area": "Bird health",
                "status": "On record" if health_records_count == 0 and mortality_rate_percent <= 5 else ("Follow up" if mortality_rate_percent > 5 or health_records_count > 0 else "Not recorded"),
                "detail": f"{health_records_count} health incidents on record; mortality is {mortality_rate_percent}%." if health_records_count > 0 or mortality_rate_percent > 0 else "No disease outbreaks or high mortality noted."
            },
            {
                "area": "Flock movements",
                "status": "On record" if total_birds > 0 or len(flocks) > 0 else "Not recorded",
                "detail": f"{len(flocks)} flocks recorded with {total_birds:,} active birds." if len(flocks) > 0 else "No active flock movements registered."
            },
            {
                "area": "Farm operations",
                "status": "On record" if feed_records_count > 0 and production_records_count > 0 else ("Follow up" if feed_records_count > 0 or production_records_count > 0 else "Not recorded"),
                "detail": f"{feed_records_count} feed entries and {production_records_count} production records on file."
            },
            {
                "area": "Financial records",
                "status": "On record" if financial_records_count >= 2 else ("Follow up" if financial_records_count == 1 else "Not recorded"),
                "detail": f"{sales_count} sales and {expenses_count} expenses saved in the financial ledger."
            }
        ]

        location_str = [farm.community, farm.lga, farm.state]
        clean_location = ", ".join([str(p) for p in location_str if p]) or "Location not specified"

        return {
            "farm_id": farm.id,
            "farmer_name": farmer_name,
            "farm_name": farm.farm_name,
            "location": clean_location,
            "lga": farm.lga,
            "state": farm.state,
            "production_type": farm.production_system.value if hasattr(farm.production_system, "value") else str(farm.production_system),
            "total_birds": total_birds,
            "houses_count": houses_count,
            "feed_records_count": feed_records_count,
            "health_records_count": health_records_count,
            "vaccination_records_count": vaccination_records_count,
            "production_records_count": production_records_count,
            "financial_records_count": financial_records_count,
            "mortality_rate_percent": mortality_rate_percent,
            "risk_score": score,
            "risk_band": risk_band,
            "signals": signals
        }

    @staticmethod
    def create_assessment(
        db: Session,
        institution_id: uuid.UUID,
        farm_id: uuid.UUID,
        score: float,
        risk_band: str,
        metrics: Dict[str, Any],
        notes: Optional[str] = None
    ) -> FarmRiskAssessment:
        assessment = FarmRiskAssessment(
            institution_id=institution_id,
            farm_id=farm_id,
            score=score,
            risk_band=risk_band,
            metrics=metrics,
            notes=notes.strip() if notes else None,
            assessed_at=datetime.utcnow()
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        return assessment

    @staticmethod
    def list_assessments(
        db: Session,
        institution_id: uuid.UUID,
        farm_id: Optional[uuid.UUID] = None
    ) -> List[FarmRiskAssessment]:
        stmt = (
            select(FarmRiskAssessment)
            .where(FarmRiskAssessment.institution_id == institution_id)
            .order_by(FarmRiskAssessment.assessed_at.desc())
        )
        if farm_id:
            stmt = stmt.where(FarmRiskAssessment.farm_id == farm_id)
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_portfolio_farms(db: Session, institution_id: uuid.UUID) -> List[Farm]:
        # First check explicit granted farm access
        access_records = list(
            db.scalars(
                select(InstitutionFarmAccess)
                .where(
                    InstitutionFarmAccess.institution_id == institution_id,
                    InstitutionFarmAccess.access_status == "active"
                )
            ).all()
        )
        if access_records:
            farm_ids = [a.farm_id for a in access_records]
            return list(db.scalars(select(Farm).where(Farm.id.in_(farm_ids))).all())

        # If no explicit mapping has been created yet, return all registered farms so institution can explore portfolio candidates
        return list(db.scalars(select(Farm).order_by(Farm.created_at.desc())).all())

    @staticmethod
    def grant_farm_access(
        db: Session,
        institution_id: uuid.UUID,
        farm_id: uuid.UUID,
        notes: Optional[str] = None
    ) -> InstitutionFarmAccess:
        existing = db.scalar(
            select(InstitutionFarmAccess).where(
                InstitutionFarmAccess.institution_id == institution_id,
                InstitutionFarmAccess.farm_id == farm_id
            )
        )
        if existing:
            existing.access_status = "active"
            existing.notes = notes
            db.commit()
            db.refresh(existing)
            return existing

        access = InstitutionFarmAccess(
            institution_id=institution_id,
            farm_id=farm_id,
            access_status="active",
            notes=notes,
            granted_at=datetime.utcnow()
        )
        db.add(access)
        db.commit()
        db.refresh(access)
        return access

