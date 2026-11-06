import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, func

from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse


class PoultryHouseService:
    @staticmethod
    def get_house_current_birds(db: Session, house_id: uuid.UUID) -> int:
        from app.models.flock import Flock
        from app.shared.enums import FlockStatus

        stmt = select(func.coalesce(func.sum(Flock.current_birds), 0)).where(
            and_(
                Flock.house_id == house_id,
                Flock.status == FlockStatus.ACTIVE
            )
        )
        return int(db.scalar(stmt) or 0)

    @staticmethod
    def get_houses_by_farm(
        db: Session,
        farm_id: uuid.UUID,
        include_archived: bool = False
    ) -> List[PoultryHouse]:
        stmt = select(PoultryHouse).where(PoultryHouse.farm_id == farm_id)
        if not include_archived:
            stmt = stmt.where(PoultryHouse.is_archived.is_(False))
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_house_by_id(db: Session, house_id: uuid.UUID) -> Optional[PoultryHouse]:
        stmt = select(PoultryHouse).where(PoultryHouse.id == house_id)
        return db.scalar(stmt)

    @staticmethod
    def get_house_by_name(db: Session, farm_id: uuid.UUID, name: str) -> Optional[PoultryHouse]:
        stmt = select(PoultryHouse).where(
            and_(
                PoultryHouse.farm_id == farm_id,
                PoultryHouse.name.ilike(name.strip())
            )
        )
        return db.scalar(stmt)

    @staticmethod
    def create_house(db: Session, farm: Farm, data) -> PoultryHouse:
        existing = PoultryHouseService.get_house_by_name(db, farm.id, data.name)
        if existing:
            raise ValueError(f"A poultry house with the name '{data.name}' already exists in your farm.")

        if data.capacity <= 0:
            raise ValueError("Poultry house capacity must be greater than zero.")

        house = PoultryHouse(
            farm_id=farm.id,
            name=data.name.strip(),
            system=data.system,
            capacity=data.capacity,
            water=data.water,
            feed_storage=data.feed_storage,
            ventilation=data.ventilation,
            notes=data.notes,
            is_archived=False
        )
        db.add(house)
        db.commit()
        db.refresh(house)

        active_count = len(PoultryHouseService.get_houses_by_farm(db, farm.id, include_archived=False))
        farm.number_of_houses = active_count
        db.commit()

        return house

    @staticmethod
    def update_house(
        db: Session,
        farm: Farm,
        house_id: uuid.UUID,
        data
    ) -> PoultryHouse:
        house = PoultryHouseService.get_house_by_id(db, house_id)
        if not house or house.farm_id != farm.id:
            raise ValueError("Poultry house not found or does not belong to your farm.")

        if house.is_archived:
            raise ValueError("Archived houses cannot be modified.")

        update_dict = data.model_dump(exclude_unset=True)

        if "name" in update_dict and update_dict["name"] is not None:
            new_name = update_dict["name"].strip()
            if new_name.lower() != house.name.lower():
                existing = PoultryHouseService.get_house_by_name(db, farm.id, new_name)
                if existing:
                    raise ValueError(f"A poultry house with the name '{new_name}' already exists in your farm.")
            update_dict["name"] = new_name

        if "capacity" in update_dict and update_dict["capacity"] is not None:
            if update_dict["capacity"] <= 0:
                raise ValueError("Capacity must be greater than zero.")
            current_active_birds = PoultryHouseService.get_house_current_birds(db, house.id)
            if update_dict["capacity"] < current_active_birds:
                raise ValueError(
                    f"This house currently contains {current_active_birds} birds. "
                    f"Its capacity cannot be set lower than {current_active_birds}."
                )

        for field, value in update_dict.items():
            setattr(house, field, value)

        db.commit()
        db.refresh(house)
        return house

    @staticmethod
    def archive_house(db: Session, farm: Farm, house_id: uuid.UUID) -> PoultryHouse:
        house = PoultryHouseService.get_house_by_id(db, house_id)
        if not house or house.farm_id != farm.id:
            raise ValueError("Poultry house not found or does not belong to your farm.")

        if house.is_archived:
            return house

        current_active_birds = PoultryHouseService.get_house_current_birds(db, house.id)
        if current_active_birds > 0:
            raise ValueError(
                f"Cannot archive house '{house.name}' because it contains {current_active_birds} active birds. "
                "Move or complete the bird groups in this house before archiving it."
            )

        house.is_archived = True
        db.commit()
        db.refresh(house)

        active_count = len(PoultryHouseService.get_houses_by_farm(db, farm.id, include_archived=False))
        farm.number_of_houses = active_count
        db.commit()

        return house
