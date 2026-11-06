import uuid
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from app.models.farm import Farm
from app.models.flock import Flock
from app.models.sale import Sale
from app.models.payment import FinancialPayment
from app.models.user import User
from app.schemas.financial import SaleCreate, PaymentCreateRequest
from app.schemas.flock import FlockMovementCreate
from app.services.flock import FlockService
from app.shared.enums import FlockMovementType, FlockStatus


class SalesService:
    @staticmethod
    def get_sales(
        db: Session,
        farm_id: uuid.UUID,
        flock_id: Optional[uuid.UUID] = None,
        product: Optional[str] = None
    ) -> List[Sale]:
        stmt = select(Sale).where(Sale.farm_id == farm_id)
        if flock_id:
            stmt = stmt.where(Sale.flock_id == flock_id)
        if product:
            stmt = stmt.where(Sale.product.ilike(product.strip()))
        stmt = stmt.order_by(Sale.date.desc(), Sale.created_at.desc())
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_sale_by_id(db: Session, sale_id: uuid.UUID) -> Optional[Sale]:
        stmt = select(Sale).where(Sale.id == sale_id)
        return db.scalar(stmt)

    @staticmethod
    def create_sale(
        db: Session,
        farm: Farm,
        user: User,
        data: SaleCreate
    ) -> Sale:
        # Determine total amount and unit price
        if data.total_amount is not None and data.total_amount > 0:
            total_amount = data.total_amount
            unit_price = data.unit_price if data.unit_price is not None else (
                total_amount / Decimal(data.quantity) if data.quantity > 0 else Decimal("0.00")
            )
        elif data.unit_price is not None and data.quantity > 0:
            unit_price = data.unit_price
            total_amount = unit_price * Decimal(data.quantity)
        else:
            raise ValueError("Either total_amount or both unit_price and quantity must be provided.")

        amount_received = data.amount_received
        if amount_received > total_amount:
            raise ValueError(f"Amount received (₦{amount_received}) cannot exceed total sale amount (₦{total_amount}).")

        outstanding = total_amount - amount_received
        status = "Paid" if outstanding == 0 else ("Part paid" if amount_received > 0 else "Unpaid")

        # Live birds integration with Phase 3 Flock movements
        is_live_birds = "live bird" in data.product.lower() or data.product.lower() == "birds"
        flock: Optional[Flock] = None

        if is_live_birds:
            if not data.flock_id:
                raise ValueError("A flock must be selected for live bird sales.")
            flock = FlockService.get_flock_by_id(db, data.flock_id)
            if not flock or flock.farm_id != farm.id:
                raise ValueError("The selected flock does not exist on your farm.")
            if flock.status != FlockStatus.ACTIVE:
                raise ValueError(f"Cannot sell birds from completed flock '{flock.name}'.")
            if data.quantity <= 0:
                raise ValueError("Quantity of birds sold must be greater than zero.")
            if data.quantity > flock.current_birds:
                raise ValueError(
                    f"Cannot sell {data.quantity} birds. Only {flock.current_birds} birds currently in '{flock.name}'."
                )
        elif data.flock_id:
            flock = FlockService.get_flock_by_id(db, data.flock_id)
            if not flock or flock.farm_id != farm.id:
                raise ValueError("The linked flock does not exist on your farm.")

        # 1. Create Sale entity
        sale = Sale(
            farm_id=farm.id,
            flock_id=flock.id if flock else None,
            date=data.date,
            product=data.product.strip(),
            quantity=data.quantity,
            unit=data.unit,
            unit_price=unit_price,
            total_amount=total_amount,
            amount_received=amount_received,
            outstanding=outstanding,
            status=status,
            notes=data.notes,
        )
        db.add(sale)
        db.flush()  # assign sale.id

        # 2. Record upfront payment record if cash received > 0
        if amount_received > 0:
            payment = FinancialPayment(
                farm_id=farm.id,
                sale_id=sale.id,
                kind="sale",
                amount=amount_received,
                date=data.date,
                note="Payment received when sale was recorded",
            )
            db.add(payment)

        # 3. Live-bird sale population deduction via FlockService in the SAME transaction
        if is_live_birds and data.quantity > 0:
            FlockService.record_movement(
                db=db,
                farm=farm,
                user=user,
                data=FlockMovementCreate(
                    flock_id=flock.id,
                    type=FlockMovementType.SALE,
                    quantity=data.quantity,
                    date=data.date,
                    reason=f"Sale of {data.quantity} live birds (Sale {sale.id})",
                    notes=f"Linked to sale record {sale.id}"
                )
            )

        db.commit()
        db.refresh(sale)
        return sale

    @staticmethod
    def record_payment(
        db: Session,
        farm: Farm,
        sale_id: uuid.UUID,
        data: PaymentCreateRequest
    ) -> Sale:
        sale = SalesService.get_sale_by_id(db, sale_id)
        if not sale or sale.farm_id != farm.id:
            raise ValueError("Sale record not found or does not belong to your farm.")

        if sale.outstanding <= 0:
            raise ValueError(f"Sale '{sale.product}' is already fully paid.")

        if data.amount > sale.outstanding:
            raise ValueError(
                f"Payment amount (₦{data.amount}) cannot exceed outstanding balance (₦{sale.outstanding})."
            )

        payment = FinancialPayment(
            farm_id=farm.id,
            sale_id=sale.id,
            kind="sale",
            amount=data.amount,
            date=data.date,
            note=data.note,
        )
        db.add(payment)

        # Update sale balances
        sale.amount_received += data.amount
        sale.outstanding -= data.amount
        sale.status = "Paid" if sale.outstanding == 0 else "Part paid"

        db.commit()
        db.refresh(sale)
        return sale

