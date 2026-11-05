import uuid
from datetime import datetime, timezone
from app.database.session import SessionLocal
from app.models.user import User
from app.models.farm import Farm
from app.models.institution import InstitutionProfile
from app.models.institution_access import InstitutionFarmAccess
from app.models.assessment import FarmRiskAssessment
from app.shared.enums import RiskBand

db = SessionLocal()

user = db.query(User).filter(User.phone == "08060000000").first()
if not user:
    print("User 08060000000 not found!")
    exit(1)

# Check / create InstitutionProfile
profile = db.query(InstitutionProfile).filter(InstitutionProfile.user_id == user.id).first()
if not profile:
    profile = InstitutionProfile(
        id=uuid.uuid4(),
        user_id=user.id,
        organisation_name="Plateau Agri Trust",
        organisation_type="Microfinance / Agricultural Credit",
        cac_registration_number="RC-1294812",
        year_established=2018,
        official_email="contact@plateauagritrust.ng",
        official_phone="08060000000",
        state="Plateau",
        lga="Jos South",
        office_address="12 Commercial Way, Rayfield, Jos",
        status="approved",
        categories=["Lending / Credit", "Insurance Underwriting", "Input Financing"],
        services={"credit_limit": 10000000, "interest_rate": 8.5},
        representative={
            "fullName": "Paul Gyang",
            "jobTitle": "Chief Credit Officer",
            "email": "p.gyang@plateauagritrust.ng",
            "phone": "08060000000"
        },
        documents=[],
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.add(profile)
    db.flush()
    print(f"Created InstitutionProfile: {profile.organisation_name} ({profile.id})")
else:
    print(f"InstitutionProfile already exists: {profile.organisation_name}")

# Link all available farms to this institution portfolio
farms = db.query(Farm).all()
for f in farms:
    access = db.query(InstitutionFarmAccess).filter(
        InstitutionFarmAccess.institution_id == profile.id,
        InstitutionFarmAccess.farm_id == f.id
    ).first()
    if not access:
        access = InstitutionFarmAccess(
            id=uuid.uuid4(),
            institution_id=profile.id,
            farm_id=f.id,
            notes="Granted portfolio access for risk assessment",
            granted_at=datetime.now(timezone.utc)
        )
        db.add(access)
        print(f"Linked farm {f.farm_name} to {profile.organisation_name}")

# Create an initial assessment
if farms:
    first_farm = farms[0]
    ass = db.query(FarmRiskAssessment).filter(
        FarmRiskAssessment.institution_id == profile.id,
        FarmRiskAssessment.farm_id == first_farm.id
    ).first()
    if not ass:
        ass = FarmRiskAssessment(
            id=uuid.uuid4(),
            institution_id=profile.id,
            farm_id=first_farm.id,
            score=88.5,
            risk_band=RiskBand.LOW_RISK,
            metrics={"biosecurity_score": 90, "flock_health": 95, "financial_history": 85},
            notes="Strong creditworthiness and consistent production logs.",
            assessed_at=datetime.now(timezone.utc)
        )
        db.add(ass)
        print(f"Created assessment for farm {first_farm.farm_name}")

db.commit()
db.close()
print("Institution seeding completed successfully!")
