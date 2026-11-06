import uuid
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmUpdate


class FarmService:
    @staticmethod
    def get_farm_by_user(db: Session, user_id: uuid.UUID) -> Optional[Farm]:
        stmt = select(Farm).where(Farm.user_id == user_id)
        return db.scalar(stmt)

    @staticmethod
    def get_farm_by_id(db: Session, farm_id: uuid.UUID) -> Optional[Farm]:
        stmt = select(Farm).where(Farm.id == farm_id)
        return db.scalar(stmt)

    @staticmethod
    def create_farm(db: Session, user: User, data: FarmCreate) -> Farm:
        # Check if farmer already has a registered primary farm
        existing = FarmService.get_farm_by_user(db, user.id)
        if existing:
            # If farm already exists, update it with new form values rather than failing
            update_dict = data.model_dump(exclude_unset=True)
            for field, value in update_dict.items():
                setattr(existing, field, value)
            db.commit()
            db.refresh(existing)
            return existing

        farm = Farm(
            user_id=user.id,
            farm_name=data.farm_name,
            owner_name=data.owner_name,
            phone=data.phone,
            state=data.state,
            lga=data.lga,
            community=data.community,
            establishment_date=data.establishment_date,
            operation_type=data.operation_type,
            production_system=data.production_system,
            number_of_houses=data.number_of_houses,
            water_source=data.water_source,
            number_of_workers=data.number_of_workers,
            biosecurity=data.biosecurity or [],
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)
        return farm

    @staticmethod
    def update_farm(db: Session, user: User, data: FarmUpdate) -> Farm:
        farm = FarmService.get_farm_by_user(db, user.id)
        if not farm:
            # Upsert: if no farm exists yet, create the primary farm
            farm = Farm(
                user_id=user.id,
                farm_name=data.farm_name or f"{user.full_name}'s Farm",
                owner_name=data.owner_name or user.full_name or "Farmer",
                phone=data.phone or user.phone,
                state=data.state or "Plateau",
                lga=data.lga or "Jos South",
                community=data.community or "Central",
                establishment_date=data.establishment_date,
                operation_type=data.operation_type or "Broiler",
                production_system=data.production_system or "Deep litter",
                number_of_houses=data.number_of_houses or 0,
                water_source=data.water_source or "Borehole",
                number_of_workers=data.number_of_workers or 0,
                biosecurity=data.biosecurity or [],
            )
            db.add(farm)
            db.commit()
            db.refresh(farm)
            return farm

        update_dict = data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(farm, field, value)

        db.commit()
        db.refresh(farm)
        return farm

