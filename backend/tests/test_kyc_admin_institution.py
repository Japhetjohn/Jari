import uuid
import pytest
from app.models.user import User
from app.services.auth import AuthService
from app.shared.enums import UserRole, AccountStatus


def setup_farmer(client, phone, full_name="Farmer Doe"):
    client.post("/api/v1/auth/register", json={
        "full_name": full_name,
        "phone": phone,
        "password": "password123"
    })
    login_resp = client.post("/api/v1/auth/login", json={
        "phone": phone,
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    farm = client.post("/api/v1/farms", json={
        "farm_name": f"{full_name} Farm",
        "owner_name": full_name,
        "phone": phone,
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru",
        "biosecurity": ["Perimeter fencing", "Footbath", "Bird netting", "Visitor register"]
    }, headers=headers).json()

    return headers, farm


def setup_admin(client, db_session, phone="08099999999", full_name="Platform Admin"):
    # Create admin user directly with hashed password
    admin = User(
        full_name=full_name,
        phone=phone,
        hashed_password=AuthService.hash_password("adminpassword123"),
        role=UserRole.ADMIN,
        status=AccountStatus.ACTIVE
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)

    login_resp = client.post("/api/v1/auth/login", json={
        "phone": phone,
        "password": "adminpassword123"
    })
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, admin


def setup_institutional_user(client, db_session, phone="08088888888", full_name="Bank Officer"):
    inst_user = User(
        full_name=full_name,
        phone=phone,
        hashed_password=AuthService.hash_password("instpass123"),
        role=UserRole.INSTITUTIONAL_USER,
        status=AccountStatus.ACTIVE
    )
    db_session.add(inst_user)
    db_session.commit()
    db_session.refresh(inst_user)

    login_resp = client.post("/api/v1/auth/login", json={
        "phone": phone,
        "password": "instpass123"
    })
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, inst_user


# ==================== 1. FARMER KYC SUBMISSION & RETRIEVAL ====================

def test_farmer_kyc_submission_and_duplicate_guard(client):
    headers, farm = setup_farmer(client, "08011111111", "Musa Plateau")

    # Initial get -> 404
    get_res = client.get("/api/v1/kyc/me", headers=headers)
    assert get_res.status_code == 404

    # Submit KYC
    submit_res = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Musa Plateau Farm",
        "location": "Kuru, Jos South, Plateau",
        "phone": "08011111111"
    }, headers=headers)
    assert submit_res.status_code == 201
    kyc_data = submit_res.json()
    assert kyc_data["status"] == "pending"
    assert kyc_data["farm_name"] == "Musa Plateau Farm"

    # Re-submitting while pending is rejected
    dup_res = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Musa Plateau Farm",
        "location": "Kuru, Jos South, Plateau",
        "phone": "08011111111"
    }, headers=headers)
    assert dup_res.status_code == 400
    assert "already pending" in dup_res.json()["detail"]


# ==================== 2. ADMIN VERIFICATION WORKFLOW ====================

def test_admin_review_workflow(client, db_session):
    farmer_headers, farm = setup_farmer(client, "08022222222", "Grace Farms")
    admin_headers, admin = setup_admin(client, db_session, "08099990001")

    # Farmer submits KYC
    submit_res = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Grace Farms",
        "location": "Bukuru, Jos South",
        "phone": "08022222222"
    }, headers=farmer_headers)
    kyc_id = submit_res.json()["id"]

    # Admin checks verification queue
    queue_res = client.get("/api/v1/admin/verifications", headers=admin_headers)
    assert queue_res.status_code == 200
    items = queue_res.json()
    assert len(items) >= 1
    assert any(i["id"] == kyc_id for i in items)

    # Admin requests changes
    review_res = client.post(f"/api/v1/admin/verifications/{kyc_id}/review", json={
        "status": "needs_changes",
        "review_note": "Please specify exact farm coordinates and road."
    }, headers=admin_headers)
    assert review_res.status_code == 200
    assert review_res.json()["status"] == "needs_changes"

    # Farmer checks status
    farmer_check = client.get("/api/v1/kyc/me", headers=farmer_headers)
    assert farmer_check.json()["status"] == "needs_changes"
    assert "coordinates" in farmer_check.json()["review_note"]

    # Farmer updates and re-submits
    resubmit = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Grace Farms",
        "location": "Bukuru Express Road, Jos South",
        "phone": "08022222222"
    }, headers=farmer_headers)
    assert resubmit.status_code == 201
    assert resubmit.json()["status"] == "pending"

    # Admin marks approved
    approve_res = client.post(f"/api/v1/admin/verifications/{kyc_id}/review", json={
        "status": "approved",
        "review_note": "Verified by regional extension officer."
    }, headers=admin_headers)
    assert approve_res.status_code == 200

    # Farmer checks final status
    final_check = client.get("/api/v1/kyc/me", headers=farmer_headers)
    assert final_check.json()["status"] == "approved"

    # Further submission attempts blocked
    blocked = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Grace Farms",
        "location": "Bukuru Express Road, Jos South",
        "phone": "08022222222"
    }, headers=farmer_headers)
    assert blocked.status_code == 400
    assert "already been approved" in blocked.json()["detail"]


# ==================== 3. FARM DOCUMENTS MANAGEMENT ====================

def test_farm_documents_upload_and_delete(client):
    headers, farm = setup_farmer(client, "08033333333", "Doc Farmer")

    # List empty
    docs_empty = client.get("/api/v1/documents", headers=headers)
    assert docs_empty.status_code == 200
    assert len(docs_empty.json()) == 0

    # Upload document
    upload_res = client.post("/api/v1/documents", json={
        "name": "CAC_Certificate.pdf",
        "document_type": "application/pdf",
        "file_size": 204800,
        "file_url": "data:application/pdf;base64,JVBERi0xLjQKJ..."
    }, headers=headers)
    assert upload_res.status_code == 201
    doc = upload_res.json()
    assert doc["name"] == "CAC_Certificate.pdf"
    doc_id = doc["id"]

    # List contains document
    docs_list = client.get("/api/v1/documents", headers=headers)
    assert len(docs_list.json()) == 1

    # Delete document
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=headers)
    assert del_res.status_code == 204

    # List empty again
    docs_after = client.get("/api/v1/documents", headers=headers)
    assert len(docs_after.json()) == 0


# ==================== 4. INSTITUTION REGISTRATION & ADMIN REVIEW ====================

def test_institution_registration_and_admin_review(client, db_session):
    inst_headers, inst_user = setup_institutional_user(client, db_session, "08044444444", "AgriBank Officer")
    admin_headers, admin = setup_admin(client, db_session, "08099990002")

    # Register institution profile
    reg_res = client.post("/api/v1/institution/profile", json={
        "organisation_name": "AgriBank Nigeria Ltd",
        "organisation_type": "Commercial Bank",
        "cac_registration_number": "RC-998877",
        "year_established": 2012,
        "official_email": "agri@bank.ng",
        "official_phone": "08044444444",
        "state": "Plateau",
        "lga": "Jos North",
        "categories": ["Lending Institution"],
        "representative": {
            "full_name": "AgriBank Officer",
            "job_title": "Head of Agribusiness",
            "email": "officer@bank.ng",
            "phone": "08044444444"
        }
    }, headers=inst_headers)
    assert reg_res.status_code == 201
    profile = reg_res.json()
    assert profile["status"] == "pending"
    inst_id = profile["id"]

    # Admin views institutions list
    inst_list = client.get("/api/v1/admin/institutions", headers=admin_headers)
    assert inst_list.status_code == 200
    assert any(i["id"] == inst_id for i in inst_list.json())

    # Admin approves institution
    review_res = client.post(f"/api/v1/admin/verifications/{inst_id}/review", json={
        "status": "approved",
        "review_note": "Verified through CAC portal and CBN registry."
    }, headers=admin_headers)
    assert review_res.status_code == 200

    # Institutional user gets profile
    me_res = client.get("/api/v1/institution/me", headers=inst_headers)
    assert me_res.status_code == 200
    assert me_res.json()["status"] == "approved"


# ==================== 5. DETERMINISTIC RISK SCORING & ASSESSMENTS ====================

def test_risk_scoring_and_assessment(client, db_session):
    farmer_headers, farm = setup_farmer(client, "08055555555", "Scored Farmer")
    inst_headers, inst_user = setup_institutional_user(client, db_session, "08066666666", "Insurance Underwriter")
    admin_headers, admin = setup_admin(client, db_session, "08099990003")

    # Register institution profile
    client.post("/api/v1/institution/profile", json={
        "organisation_name": "Leadway Poultry Insurance",
        "organisation_type": "Insurance Provider",
        "cac_registration_number": "RC-112233",
        "official_email": "insurance@leadway.demo",
        "official_phone": "08066666666",
        "categories": ["Insurance Provider"]
    }, headers=inst_headers)

    # Setup poultry house & flock
    house = client.post("/api/v1/houses", json={"name": "House Alpha", "capacity": 2000}, headers=farmer_headers).json()
    flock = client.post("/api/v1/flocks", json={
        "name": "Batch Risk Test",
        "type": "Broiler",
        "house_id": house["id"],
        "initial_birds": 1000
    }, headers=farmer_headers).json()

    # Add operations: feed purchase, vaccination record, and minor mortality
    client.post("/api/v1/feed/purchases", json={
        "date": "2026-10-10",
        "feed_type": "Broiler Starter",
        "quantity_bags": 20,
        "cost": 150000.0
    }, headers=farmer_headers)

    client.post("/api/v1/health/vaccinations", json={
        "flock_id": flock["id"],
        "vaccine_name": "Gumboro",
        "date_administered": "2026-10-12",
        "dosage": "1 dose per bird"
    }, headers=farmer_headers)

    client.post("/api/v1/health/incidents", json={
        "flock_id": flock["id"],
        "incident_date": "2026-10-14",
        "title": "Minor heat stress",
        "severity": "Mild",
        "mortality_count": 10
    }, headers=farmer_headers)

    # Approve KYC
    kyc_res = client.post("/api/v1/kyc/submit", json={
        "farm_name": "Scored Farmer Farm",
        "location": "Kuru, Jos South",
        "phone": "08055555555"
    }, headers=farmer_headers).json()

    client.post(f"/api/v1/admin/verifications/{kyc_res['id']}/review", json={
        "status": "approved",
        "review_note": "Verified."
    }, headers=admin_headers)

    # Compute risk profile
    farm_id = farm["id"]
    risk_res = client.get(f"/api/v1/institution/farms/{farm_id}/risk-profile", headers=inst_headers)
    assert risk_res.status_code == 200
    risk = risk_res.json()
    assert risk["total_birds"] == 990  # 1000 - 10 mortality
    assert risk["mortality_rate_percent"] == 1.0  # 10 / 1000 = 1.0%
    assert risk["risk_score"] >= 75.0
    assert risk["risk_band"] == "Low Risk"
    assert len(risk["signals"]) == 5

    # Create an assessment record
    assess_res = client.post("/api/v1/institution/assessments", json={
        "farm_id": farm_id,
        "score": risk["risk_score"],
        "risk_band": risk["risk_band"],
        "metrics": {"mortality": risk["mortality_rate_percent"], "birds": risk["total_birds"]},
        "notes": "Farm qualifies for Tier 1 avian insurance."
    }, headers=inst_headers)
    assert assess_res.status_code == 201

    # List assessments
    assess_list = client.get("/api/v1/institution/assessments", headers=inst_headers)
    assert assess_list.status_code == 200
    assert len(assess_list.json()) == 1
    assert assess_list.json()[0]["risk_band"] == "Low Risk"


# ==================== 6. RBAC SECURITY RESTRICTIONS ====================

def test_rbac_security_restrictions(client):
    farmer_headers, farm = setup_farmer(client, "08077777777", "Standard Farmer")

    # Farmer cannot access admin overview
    admin_forbidden = client.get("/api/v1/admin/overview", headers=farmer_headers)
    assert admin_forbidden.status_code == 403

    # Farmer cannot review verifications
    review_forbidden = client.post(
        f"/api/v1/admin/verifications/{uuid.uuid4()}/review",
        json={"status": "approved"},
        headers=farmer_headers
    )
    assert review_forbidden.status_code == 403

    # Farmer cannot create institutional assessment
    assess_forbidden = client.post(
        "/api/v1/institution/assessments",
        json={"farm_id": farm["id"], "score": 85.0, "risk_band": "Low Risk"},
        headers=farmer_headers
    )
    assert assess_forbidden.status_code == 403

