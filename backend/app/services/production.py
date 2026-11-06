import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.production_record import ProductionRecord
from app.schemas.operations import ProductionRecordCreate, ProductionSummary


class ProductionService:
    @staticmethod
    def get_records(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None
    ) -> List[ProductionRecord]:
        stmt = select(ProductionRecord).where(ProductionRecord.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(ProductionRecord.flock_id == flock_id)
        stmt = stmt.order_by(ProductionRecord.date.desc(), ProductionRecord.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_record(
        db: Session,
        farm: Farm,
        data: ProductionRecordCreate
    ) -> ProductionRecord:
        from app.services.flock import FlockService
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("The selected bird group does not exist on your farm.")

        # Validation rules:
        # 1. Eggs checks: good + damaged <= total eggs collected
        if data.eggs_collected > 0:
            if data.good_eggs + data.damaged_eggs > data.eggs_collected:
                raise ValueError("Good eggs plus damaged eggs cannot exceed total eggs collected.")

        # 2. Operational observation checks against current flock population
        if data.live_birds > flock.current_birds:
            raise ValueError(
                f"Recorded live birds ({data.live_birds}) cannot exceed the flock's current population ({flock.current_birds})."
            )
        if data.birds_weighed > flock.current_birds:
            raise ValueError(
                f"Weighed birds ({data.birds_weighed}) cannot exceed the flock's current population ({flock.current_birds})."
            )
        if data.birds_ready > flock.current_birds:
            raise ValueError(
                f"Birds ready ({data.birds_ready}) cannot exceed the flock's current population ({flock.current_birds})."
            )

        record = ProductionRecord(
            farm_id=farm.id,
            flock_id=flock.id,
            date=data.date,
            type=data.type,
            live_birds=data.live_birds,
            eggs_collected=data.eggs_collected,
            good_eggs=data.good_eggs,
            damaged_eggs=data.damaged_eggs,
            birds_weighed=data.birds_weighed,
            average_weight=data.average_weight,
            birds_ready=data.birds_ready,
            notes=data.notes,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_summary(db: Session, farm_id: uuid.UUID) -> ProductionSummary:
        records = ProductionService.get_records(db, farm_id)
        total_records = len(records)
        total_eggs = sum(r.eggs_collected for r in records)
        total_good = sum(r.good_eggs for r in records)
        total_damaged = sum(r.damaged_eggs for r in records)
        total_ready = sum(r.birds_ready for r in records)

        weighed_records = [r.average_weight for r in records if r.average_weight > 0]
        avg_weight = sum(weighed_records) / len(weighed_records) if weighed_records else 0.0

        return ProductionSummary(
            total_records=total_records,
            total_eggs_collected=total_eggs,
            total_good_eggs=total_good,
            total_damaged_eggs=total_damaged,
            total_birds_ready=total_ready,
            overall_average_weight=round(avg_weight, 2)
        )

