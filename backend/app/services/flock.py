import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.flock_movement import FlockMovement
from app.models.poultry_house import PoultryHouse
from app.models.user import User
from app.schemas.flock import (
    FlockCreate,
    FlockMovementCreate,
    FlockTransferCreate,
)
from app.services.poultry_house import PoultryHouseService
from app.shared.enums import FlockStatus, FlockMovementType, MovementDirection


class FlockService:
    @staticmethod
    def get_flocks_by_farm(
        db: Session,
        farm_id: uuid.UUID,
        status: Optional[FlockStatus] = None
    ) -> List[Flock]:
        stmt = select(Flock).where(Flock.farm_id == farm_id)
        if status:
            stmt = stmt.where(Flock.status == status)
        stmt = stmt.order_by(Flock.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_flock_by_id(db: Session, flock_id: uuid.UUID) -> Optional[Flock]:
        stmt = select(Flock).where(Flock.id == flock_id)
        return db.scalar(stmt)

    @staticmethod
    def get_flock_by_name(db: Session, farm_id: uuid.UUID, name: str) -> Optional[Flock]:
        stmt = select(Flock).where(
            and_(
                Flock.farm_id == farm_id,
                Flock.name.ilike(name.strip())
            )
        )
        return db.scalar(stmt)

    @staticmethod
    def create_flock(db: Session, farm: Farm, user: User, data: FlockCreate) -> Flock:
        # 1. Check duplicate flock name within farm
        existing = FlockService.get_flock_by_name(db, farm.id, data.name)
        if existing:
            raise ValueError(f"A bird group with the name '{data.name}' already exists on your farm.")

        # 2. Check house belongs to farm
        house = PoultryHouseService.get_house_by_id(db, data.house_id)
        if not house or house.farm_id != farm.id:
            raise ValueError("The selected poultry house does not exist on your farm.")

        # 3. Reject archived houses
        if house.is_archived:
            raise ValueError("Cannot assign birds to an archived poultry house.")

        # 4. Check available capacity
        current_birds_in_house = PoultryHouseService.get_house_current_birds(db, house.id)
        remaining_capacity = max(0, house.capacity - current_birds_in_house)
        if data.initial_birds > remaining_capacity:
            raise ValueError(
                f"This bird group ({data.initial_birds} birds) would exceed the remaining space in {house.name} "
                f"({remaining_capacity} available of {house.capacity} total capacity)."
            )

        # 5. Atomic Transaction: create flock and initial movement
        flock = Flock(
            farm_id=farm.id,
            house_id=house.id,
            name=data.name.strip(),
            type=data.type,
            breed=data.breed,
            initial_birds=data.initial_birds,
            current_birds=data.initial_birds,
            acquisition_date=data.acquisition_date,
            cycle_start=data.cycle_start or data.acquisition_date,
            source=data.source,
            age_at_acquisition=data.age_at_acquisition,
            age_unit=data.age_unit,
            purchase_cost=data.purchase_cost,
            status=FlockStatus.ACTIVE,
        )
        db.add(flock)
        db.flush()  # Generates flock.id without full commit

        # 6. Automatic initial stocking movement
        movement = FlockMovement(
            farm_id=farm.id,
            flock_id=flock.id,
            type=FlockMovementType.INITIAL_STOCKING,
            direction=MovementDirection.INFLOW,
            quantity=data.initial_birds,
            date=data.acquisition_date or datetime.utcnow().strftime("%Y-%m-%d"),
            reason="Opening bird count for newly registered flock",
            destination_house=house.name,
            created_by=user.id,
        )
        db.add(movement)
        db.commit()
        db.refresh(flock)
        return flock

    @staticmethod
    def record_movement(
        db: Session,
        farm: Farm,
        user: User,
        data: FlockMovementCreate
    ) -> FlockMovement:
        flock = FlockService.get_flock_by_id(db, data.flock_id)
        if not flock or flock.farm_id != farm.id:
            raise ValueError("Flock not found or does not belong to your farm.")

        # Rejection of Initial stocking or Transfers through standalone endpoint
        if data.type == FlockMovementType.INITIAL_STOCKING:
            raise ValueError("Initial stocking is only recorded during flock registration.")
        if data.type in (FlockMovementType.TRANSFER_IN, FlockMovementType.TRANSFER_OUT):
            raise ValueError("Inter-house transfers must use the dedicated transfer endpoint.")

        # Check status
        if flock.status == FlockStatus.COMPLETED:
            raise ValueError("This bird group is completed. Start a new group to record new birds.")

        # Determine direction:
        # Inflows: Bird acquisition, Additional stocking
        # Outflows: Mortality, Sale
        # Adjustment: inferred or handled carefully
        outflow_types = {FlockMovementType.MORTALITY, FlockMovementType.SALE}
        is_outflow = data.type in outflow_types

        if is_outflow:
            direction = MovementDirection.OUTFLOW
            if data.quantity > flock.current_birds:
                raise ValueError(
                    f"Recorded quantity ({data.quantity}) cannot be greater than current flock population ({flock.current_birds})."
                )
            new_population = flock.current_birds - data.quantity
        else:
            direction = MovementDirection.INFLOW
            # Check house capacity for inflows
            house = flock.house
            current_birds_in_house = PoultryHouseService.get_house_current_birds(db, house.id)
            remaining_capacity = max(0, house.capacity - current_birds_in_house)
            if data.quantity > remaining_capacity:
                raise ValueError(
                    f"Adding {data.quantity} birds exceeds remaining space in {house.name} "
                    f"({remaining_capacity} available spaces left)."
                )
            new_population = flock.current_birds + data.quantity

        flock.current_birds = new_population
        if new_population == 0:
            flock.status = FlockStatus.COMPLETED

        movement = FlockMovement(
            farm_id=farm.id,
            flock_id=flock.id,
            type=data.type,
            direction=direction,
            quantity=data.quantity,
            date=data.date,
            reason=data.reason,
            notes=data.notes,
            source_house=flock.house.name if direction == MovementDirection.OUTFLOW else None,
            destination_house=flock.house.name if direction == MovementDirection.INFLOW else None,
            created_by=user.id,
        )
        db.add(movement)
        db.commit()
        db.refresh(movement)
        return movement

    @staticmethod
    def transfer_birds(
        db: Session,
        farm: Farm,
        user: User,
        data: FlockTransferCreate
    ) -> dict:
        if data.source_flock_id == data.destination_flock_id:
            raise ValueError("Source and destination flocks must be different bird groups.")

        source = FlockService.get_flock_by_id(db, data.source_flock_id)
        destination = FlockService.get_flock_by_id(db, data.destination_flock_id)

        if not source or source.farm_id != farm.id:
            raise ValueError("Source flock not found or does not belong to your farm.")
        if not destination or destination.farm_id != farm.id:
            raise ValueError("Destination flock not found or does not belong to your farm.")

        if source.status != FlockStatus.ACTIVE:
            raise ValueError(f"Source flock '{source.name}' is completed and has no birds to transfer.")
        if destination.status != FlockStatus.ACTIVE:
            raise ValueError(f"Destination flock '{destination.name}' is completed. Choose an active bird group.")

        if data.quantity > source.current_birds:
            raise ValueError(
                f"Cannot transfer {data.quantity} birds. Only {source.current_birds} birds currently in '{source.name}'."
            )

        # Capacity check on destination house (if destination is in a different house)
        if source.house_id != destination.house_id:
            dest_house = destination.house
            if dest_house.is_archived:
                raise ValueError(f"Destination house '{dest_house.name}' is archived.")

            current_in_dest = PoultryHouseService.get_house_current_birds(db, dest_house.id)
            remaining_dest = max(0, dest_house.capacity - current_in_dest)
            if data.quantity > remaining_dest:
                raise ValueError(
                    f"Destination house '{dest_house.name}' has only {remaining_dest} spaces left. "
                    f"Cannot accommodate {data.quantity} transferred birds."
                )

        # Execute atomic transfer
        source.current_birds -= data.quantity
        if source.current_birds == 0:
            source.status = FlockStatus.COMPLETED

        destination.current_birds += data.quantity

        transfer_ref = f"transfer-{uuid.uuid4().hex[:8]}"
        notes_with_ref = f"{data.notes}\nRef: {transfer_ref}".strip() if data.notes else f"Ref: {transfer_ref}"

        outflow = FlockMovement(
            farm_id=farm.id,
            flock_id=source.id,
            type=FlockMovementType.TRANSFER_OUT,
            direction=MovementDirection.OUTFLOW,
            quantity=data.quantity,
            date=data.date,
            reason=data.reason,
            notes=notes_with_ref,
            source_house=source.house.name,
            destination_house=destination.house.name,
            created_by=user.id,
        )
        inflow = FlockMovement(
            farm_id=farm.id,
            flock_id=destination.id,
            type=FlockMovementType.TRANSFER_IN,
            direction=MovementDirection.INFLOW,
            quantity=data.quantity,
            date=data.date,
            reason=data.reason,
            notes=notes_with_ref,
            source_house=source.house.name,
            destination_house=destination.house.name,
            created_by=user.id,
        )

        db.add(outflow)
        db.add(inflow)
        db.commit()

        db.refresh(source)
        db.refresh(destination)
        db.refresh(outflow)
        db.refresh(inflow)

        return {
            "reference": transfer_ref,
            "source_flock": source,
            "destination_flock": destination,
            "movements": [outflow, inflow]
        }

