import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.feed_purchase import FeedPurchase
from app.models.feed_consumption import FeedConsumption
from app.schemas.operations import (
    FeedPurchaseCreate,
    FeedConsumptionCreate,
    FeedInventoryItem,
    FeedInventorySummary,
)


class FeedService:
    @staticmethod
    def get_purchases(
        db: Session,
        farm_id: uuid.UUID,
        feed_type: Optional[str] = None
    ) -> List[FeedPurchase]:
        stmt = select(FeedPurchase).where(FeedPurchase.farm_id == farm_id)
        if feed_type:
            stmt = stmt.where(FeedPurchase.feed_type.ilike(feed_type.strip()))
        stmt = stmt.order_by(FeedPurchase.date.desc(), FeedPurchase.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_purchase(
        db: Session,
        farm: Farm,
        data: FeedPurchaseCreate
    ) -> FeedPurchase:
        # Validate flock if supplied
        if data.flock_id:
            from app.services.flock import FlockService
            flock = FlockService.get_flock_by_id(db, data.flock_id)
            if not flock or flock.farm_id != farm.id:
                raise ValueError("The linked flock does not exist on your farm.")

        # Normalize quantity into kg
        if data.unit.lower() == "bags":
            total_quantity_kg = data.quantity * data.bag_weight_kg
        else:
            total_quantity_kg = data.quantity

        purchase = FeedPurchase(
            farm_id=farm.id,
            flock_id=data.flock_id,
            date=data.date,
            feed_type=data.feed_type.strip(),
            brand=data.brand.strip(),
            supplier=data.supplier.strip() if data.supplier else None,
            quantity=data.quantity,
            unit=data.unit,
            bag_weight_kg=data.bag_weight_kg,
            total_quantity_kg=total_quantity_kg,
            amount=data.amount,
            amount_paid=data.amount_paid,
            notes=data.notes,
        )
        db.add(purchase)
        db.commit()
        db.refresh(purchase)
        return purchase

    @staticmethod
    def get_consumptions(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None
    ) -> List[FeedConsumption]:
        stmt = select(FeedConsumption).where(FeedConsumption.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(FeedConsumption.flock_id == flock_id)
        stmt = stmt.order_by(FeedConsumption.date.desc(), FeedConsumption.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_available_stock_kg(
        db: Session,
        farm_id: uuid.UUID,
        feed_type: str
    ) -> float:
        # 1. Total purchased kg for this feed_type
        stmt_bought = select(func.coalesce(func.sum(FeedPurchase.total_quantity_kg), 0.0)).where(
            and_(
                FeedPurchase.farm_id == farm_id,
                FeedPurchase.feed_type.ilike(feed_type.strip())
            )
        )
        total_bought = float(db.scalar(stmt_bought) or 0.0)

        # 2. Total consumed kg for this feed_type
        stmt_used = select(func.coalesce(func.sum(FeedConsumption.quantity_kg), 0.0)).where(
            and_(
                FeedConsumption.farm_id == farm_id,
                FeedConsumption.feed_type.ilike(feed_type.strip())
            )
        )
        total_used = float(db.scalar(stmt_used) or 0.0)

        return max(0.0, total_bought - total_used)

    @staticmethod
    def record_consumption(
        db: Session,
        farm: Farm,
        data: FeedConsumptionCreate
    ) -> FeedConsumption:
        # 1. Validate flock
        from app.services.flock import FlockService
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("The selected bird group does not exist on your farm.")

        # 2. Inventory check
        available = FeedService.get_available_stock_kg(db, farm.id, data.feed_type)
        if data.quantity_kg > available:
            raise ValueError(
                f"Cannot record {data.quantity_kg} kg of {data.feed_type} feed. "
                f"Only {round(available, 2)} kg currently available in stock."
            )

        consumption = FeedConsumption(
            farm_id=farm.id,
            flock_id=flock.id,
            date=data.date,
            feed_type=data.feed_type.strip(),
            quantity_kg=data.quantity_kg,
            notes=data.notes,
        )
        db.add(consumption)
        db.commit()
        db.refresh(consumption)
        return consumption

    @staticmethod
    def get_inventory_summary(db: Session, farm_id: uuid.UUID) -> FeedInventorySummary:
        purchases = FeedService.get_purchases(db, farm_id)
        consumptions = FeedService.get_consumptions(db, farm_id)

        all_types = sorted(list(set(
            [p.feed_type for p in purchases] + [c.feed_type for c in consumptions]
        )))

        items: List[FeedInventoryItem] = []
        total_bought = 0.0
        total_used = 0.0
        total_available = 0.0
        total_spent = sum(p.amount for p in purchases)

        for f_type in all_types:
            bought = sum(p.total_quantity_kg for p in purchases if p.feed_type.lower() == f_type.lower())
            used = sum(c.quantity_kg for c in consumptions if c.feed_type.lower() == f_type.lower())
            avail = max(0.0, bought - used)

            items.append(FeedInventoryItem(
                feed_type=f_type,
                bought_kg=bought,
                used_kg=used,
                available_kg=avail
            ))
            total_bought += bought
            total_used += used
            total_available += avail

        return FeedInventorySummary(
            total_bought_kg=total_bought,
            total_used_kg=total_used,
            total_available_kg=total_available,
            total_spent=total_spent,
            items=items
        )

