import uuid
from datetime import datetime, timezone
from app.database.session import SessionLocal
from app.models.user import User
from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse
from app.models.flock import Flock
from app.models.feed_purchase import FeedPurchase
from app.models.feed_consumption import FeedConsumption
from app.models.production_record import ProductionRecord
from app.models.health_incident import HealthIncident
from app.models.vaccination_record import VaccinationRecord
from app.models.treatment_record import TreatmentRecord
from app.models.sale import Sale
from app.models.expense import Expense
from app.models.payment import FinancialPayment
from app.models.kyc import KycApplication
from app.shared.enums import FlockStatus

db = SessionLocal()

def seed_farmer_data(phone: str, full_name: str, farm_name: str):
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        print(f"User {phone} not found, skipping")
        return
    
    # Check if farm already exists
    farm = db.query(Farm).filter(Farm.user_id == user.id).first()
    if not farm:
        farm = Farm(
            id=uuid.uuid4(),
            user_id=user.id,
            farm_name=farm_name,
            owner_name=user.full_name,
            phone=user.phone,
            community="Rayfield",
            lga="Jos South",
            state="Plateau",
            establishment_date="2021-03-15",
            operation_type="Broiler & Layer",
            production_system="Deep litter & Battery cage",
            number_of_houses=2,
            water_source="Borehole",
            number_of_workers=4,
            biosecurity=["Footbaths", "Fencing", "Disinfection spray", "Visitor log"],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(farm)
        db.flush()
        print(f"Created farm {farm_name} ({farm.id}) for {phone}")
    else:
        print(f"Farm already exists for {phone}: {farm.farm_name}")
    
    # Houses
    h1 = db.query(PoultryHouse).filter(PoultryHouse.farm_id == farm.id, PoultryHouse.name == "House A").first()
    if not h1:
        h1 = PoultryHouse(
            id=uuid.uuid4(),
            farm_id=farm.id,
            name="House A",
            system="Deep litter",
            capacity=3000,
            water="Borehole",
            feed_storage=True,
            ventilation="Natural cross ventilation",
            is_archived=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(h1)
    
    h2 = db.query(PoultryHouse).filter(PoultryHouse.farm_id == farm.id, PoultryHouse.name == "House B").first()
    if not h2:
        h2 = PoultryHouse(
            id=uuid.uuid4(),
            farm_id=farm.id,
            name="House B",
            system="Deep litter",
            capacity=2500,
            water="Borehole",
            feed_storage=True,
            ventilation="Tunnel ventilation",
            is_archived=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(h2)
    db.flush()

    # Flocks
    f1 = db.query(Flock).filter(Flock.farm_id == farm.id, Flock.name == "Broiler Batch 02").first()
    if not f1:
        f1 = Flock(
            id=uuid.uuid4(),
            farm_id=farm.id,
            house_id=h1.id,
            name="Broiler Batch 02",
            type="Broiler",
            breed="Ross 308",
            initial_birds=1400,
            current_birds=1400,
            status=FlockStatus.ACTIVE,
            acquisition_date="2026-09-10",
            cycle_start="2026-09-10",
            source="Zartech Hatchery",
            created_at=datetime.now(timezone.utc)
        )
        db.add(f1)

    f2 = db.query(Flock).filter(Flock.farm_id == farm.id, Flock.name == "Layer Batch 05").first()
    if not f2:
        f2 = Flock(
            id=uuid.uuid4(),
            farm_id=farm.id,
            house_id=h2.id,
            name="Layer Batch 05",
            type="Layer",
            breed="Isa Brown",
            initial_birds=1600,
            current_birds=1600,
            status=FlockStatus.ACTIVE,
            acquisition_date="2026-05-12",
            cycle_start="2026-05-12",
            source="CHI Farms",
            created_at=datetime.now(timezone.utc)
        )
        db.add(f2)
    db.flush()

    # Feed Purchase
    p1 = db.query(FeedPurchase).filter(FeedPurchase.farm_id == farm.id).first()
    if not p1:
        p1 = FeedPurchase(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-12",
            feed_type="Starter",
            brand="Top Feed",
            supplier="Top Feed Depot Jos",
            quantity=50.0,
            unit="bags",
            bag_weight_kg=25.0,
            total_quantity_kg=1250.0,
            amount=240000.0,
            amount_paid=240000.0,
            notes="Initial feed stocking",
            created_at=datetime.now(timezone.utc)
        )
        db.add(p1)

    # Feed Consumption
    c1 = db.query(FeedConsumption).filter(FeedConsumption.farm_id == farm.id).first()
    if not c1:
        c1 = FeedConsumption(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-15",
            feed_type="Starter",
            quantity_kg=160.0,
            notes="Normal daily consumption",
            created_at=datetime.now(timezone.utc)
        )
        db.add(c1)

    # Production
    pr1 = db.query(ProductionRecord).filter(ProductionRecord.farm_id == farm.id).first()
    if not pr1:
        pr1 = ProductionRecord(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f2.id,
            date="2026-10-20",
            type="Layer",
            live_birds=1600,
            eggs_collected=1450,
            good_eggs=1420,
            damaged_eggs=30,
            birds_weighed=50,
            average_weight=1.85,
            birds_ready=0,
            notes="Standard laying rate ~90%",
            created_at=datetime.now(timezone.utc)
        )
        db.add(pr1)

    # Health Incident
    hi1 = db.query(HealthIncident).filter(HealthIncident.farm_id == farm.id).first()
    if not hi1:
        hi1 = HealthIncident(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-18",
            symptoms="Mild respiratory sounds noticed in section B",
            affected_birds=15,
            birds_lost=0,
            action="Administered electrolyte and multivitamin supportive therapy",
            outcome="Full recovery in 48 hours",
            notes="Ventilation adjusted",
            created_at=datetime.now(timezone.utc)
        )
        db.add(hi1)

    # Vaccination
    v1 = db.query(VaccinationRecord).filter(VaccinationRecord.farm_id == farm.id).first()
    if not v1:
        v1 = VaccinationRecord(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f2.id,
            date="2026-06-01",
            vaccine="Newcastle (Lasota)",
            birds=1600,
            given_by="Dr. Pam (Vet)",
            notes="Drinking water application",
            created_at=datetime.now(timezone.utc)
        )
        db.add(v1)

    # Treatment
    t1 = db.query(TreatmentRecord).filter(TreatmentRecord.farm_id == farm.id).first()
    if not t1:
        t1 = TreatmentRecord(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-19",
            treatment="Supportive Care",
            medicine="Supportive Electrolytes",
            birds_treated=15,
            given_by="Attendant",
            notes="Administered in clean water",
            created_at=datetime.now(timezone.utc)
        )
        db.add(t1)

    # Sale
    s1 = db.query(Sale).filter(Sale.farm_id == farm.id).first()
    if not s1:
        s1 = Sale(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-25",
            product="Live broilers",
            quantity=100,
            unit="Birds",
            unit_price=3600.0,
            total_amount=360000.0,
            amount_received=360000.0,
            outstanding=0.0,
            status="Paid",
            notes="Sale of 100 birds",
            created_at=datetime.now(timezone.utc)
        )
        db.add(s1)
        db.flush()
        pay1 = FinancialPayment(
            id=uuid.uuid4(),
            farm_id=farm.id,
            sale_id=s1.id,
            kind="sale",
            amount=360000.0,
            date="2026-10-25",
            note="Bank transfer on pickup",
            created_at=datetime.now(timezone.utc)
        )
        db.add(pay1)

    # Expense
    e1 = db.query(Expense).filter(Expense.farm_id == farm.id).first()
    if not e1:
        e1 = Expense(
            id=uuid.uuid4(),
            farm_id=farm.id,
            flock_id=f1.id,
            date="2026-10-26",
            category="Labour",
            amount=120000.0,
            amount_paid=120000.0,
            outstanding=0.0,
            status="Paid",
            note="Farm hands monthly stipend",
            created_at=datetime.now(timezone.utc)
        )
        db.add(e1)
        db.flush()
        pay2 = FinancialPayment(
            id=uuid.uuid4(),
            farm_id=farm.id,
            expense_id=e1.id,
            kind="expense",
            amount=120000.0,
            date="2026-10-26",
            note="Paid in full",
            created_at=datetime.now(timezone.utc)
        )
        db.add(pay2)

    # KYC
    kyc = db.query(KycApplication).filter(KycApplication.user_id == user.id).first()
    if not kyc:
        kyc = KycApplication(
            id=uuid.uuid4(),
            user_id=user.id,
            farm_id=farm.id,
            farm_name=farm.farm_name,
            location="Rayfield, Jos South, Plateau",
            phone=user.phone,
            status="approved",
            submitted_at=datetime.now(timezone.utc),
            reviewed_at=datetime.now(timezone.utc),
            review_note="Pre-verified farm profile with complete field verification."
        )
        db.add(kyc)

    db.commit()
    print(f"Seeding completed successfully for {user.phone} ({user.full_name})!")

seed_farmer_data("08030000000", "Amina Daniel", "Sunrise Integrated Poultry")
seed_farmer_data("+2348133153568", "Pererat Timothy", "Timothy Integrated Poultry Farm")
db.close()
