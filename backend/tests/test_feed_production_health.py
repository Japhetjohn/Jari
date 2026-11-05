import uuid
import pytest
from app.models.user import User
from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse
from app.models.flock import Flock
from app.shared.enums import UserRole, FlockStatus


def setup_farm_and_flock(client, phone, full_name="Operations Farmer"):
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
        "community": "Kuru"
    }, headers=headers).json()

    house = client.post("/api/v1/houses", json={
        "name": "House Operations",
        "capacity": 2000
    }, headers=headers).json()

    flock = client.post("/api/v1/flocks", json={
        "name": "Batch Op 01",
        "type": "Layer",
        "house_id": house["id"],
        "initial_birds": 1000
    }, headers=headers).json()

    return headers, farm, house, flock


# ==================== 1. FEED INVENTORY TESTS ====================

def test_feed_purchase_and_inventory_calculation(client):
    headers, farm, _, flock = setup_farm_and_flock(client, "08020000001", "Feed Farmer")

    # Purchase 10 bags of Starter feed (25 kg per bag = 250 kg total)
    purchase_payload = {
        "date": "2026-10-10",
        "feed_type": "Starter",
        "brand": "Top Feed",
        "supplier": "Jos Feed Store",
        "quantity": 10,
        "unit": "bags",
        "bag_weight_kg": 25.0,
        "amount": 250000.0,
        "amount_paid": 250000.0,
        "flock_id": flock["id"]
    }
    p_resp = client.post("/api/v1/feed/purchases", json=purchase_payload, headers=headers)
    assert p_resp.status_code == 201
    purchase = p_resp.json()
    assert purchase["total_quantity_kg"] == 250.0

    # Check inventory
    inv_resp = client.get("/api/v1/feed/inventory", headers=headers)
    assert inv_resp.status_code == 200
    inv = inv_resp.json()
    assert inv["total_bought_kg"] == 250.0
    assert inv["total_used_kg"] == 0.0
    assert inv["total_available_kg"] == 250.0
    starter_item = [i for i in inv["items"] if i["feed_type"] == "Starter"][0]
    assert starter_item["available_kg"] == 250.0


def test_feed_consumption_and_stock_deduction(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000002", "Consumption Farmer")

    # Buy 200 kg direct
    client.post("/api/v1/feed/purchases", json={
        "date": "2026-10-10",
        "feed_type": "Grower",
        "brand": "Vital Feed",
        "quantity": 200,
        "unit": "kg",
        "amount": 180000.0
    }, headers=headers)

    # Consume 60 kg
    c_resp = client.post("/api/v1/feed/consumption", json={
        "flock_id": flock["id"],
        "date": "2026-10-12",
        "feed_type": "Grower",
        "quantity_kg": 60.0,
        "notes": "Morning feed"
    }, headers=headers)
    assert c_resp.status_code == 201
    consumption = c_resp.json()
    assert consumption["quantity_kg"] == 60.0

    # Verify inventory is now 140 kg
    inv = client.get("/api/v1/feed/inventory", headers=headers).json()
    assert inv["total_available_kg"] == 140.0
    grower_item = [i for i in inv["items"] if i["feed_type"] == "Grower"][0]
    assert grower_item["available_kg"] == 140.0


def test_reject_consumption_exceeding_available_stock(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000003", "Exceeding Feed Farmer")

    # Buy 50 kg
    client.post("/api/v1/feed/purchases", json={
        "date": "2026-10-10",
        "feed_type": "Finisher",
        "brand": "Hybrid",
        "quantity": 50,
        "unit": "kg",
        "amount": 50000.0
    }, headers=headers)

    # Attempt to consume 75 kg (exceeds 50 kg available)
    resp = client.post("/api/v1/feed/consumption", json={
        "flock_id": flock["id"],
        "date": "2026-10-11",
        "feed_type": "Finisher",
        "quantity_kg": 75.0
    }, headers=headers)
    assert resp.status_code == 400
    assert "Only 50.0 kg currently available in stock" in resp.json()["detail"]


# ==================== 2. PRODUCTION RECORD TESTS ====================

def test_create_production_record_and_summary(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000004", "Production Farmer")

    prod_payload = {
        "flock_id": flock["id"],
        "date": "2026-10-15",
        "type": "Layer",
        "live_birds": 980,
        "eggs_collected": 500,
        "good_eggs": 480,
        "damaged_eggs": 20,
        "birds_weighed": 50,
        "average_weight": 1.85,
        "birds_ready": 0,
        "notes": "Good laying percentage"
    }
    response = client.post("/api/v1/production", json=prod_payload, headers=headers)
    assert response.status_code == 201
    prod = response.json()
    assert prod["eggs_collected"] == 500
    assert prod["good_eggs"] == 480
    assert prod["damaged_eggs"] == 20

    # Confirm flock population was NOT altered (1000 remains 1000)
    flock_check = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_check["current_birds"] == 1000

    # Summary Check
    summary = client.get("/api/v1/production/summary", headers=headers).json()
    assert summary["total_records"] == 1
    assert summary["total_eggs_collected"] == 500
    assert summary["overall_average_weight"] == 1.85


def test_reject_invalid_egg_counts_and_live_birds(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000005", "Egg Integrity Farmer")

    # Good + Damaged (300 + 50 = 350) > Eggs collected (300)
    resp_bad_eggs = client.post("/api/v1/production", json={
        "flock_id": flock["id"],
        "date": "2026-10-15",
        "type": "Layer",
        "eggs_collected": 300,
        "good_eggs": 300,
        "damaged_eggs": 50
    }, headers=headers)
    assert resp_bad_eggs.status_code == 400
    assert "Good eggs plus damaged eggs cannot exceed" in resp_bad_eggs.json()["detail"]

    # Live birds (1200) > Current Flock population (1000)
    resp_over_birds = client.post("/api/v1/production", json={
        "flock_id": flock["id"],
        "date": "2026-10-15",
        "type": "Layer",
        "live_birds": 1200
    }, headers=headers)
    assert resp_over_birds.status_code == 400
    assert "cannot exceed the flock's current population" in resp_over_birds.json()["detail"]


# ==================== 3. POULTRY HEALTH & MORTALITY INTEGRATION TESTS ====================

def test_health_incident_with_mortality_integrates_movement(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000006", "Health Farmer")

    # Initial flock population is 1000.
    incident_payload = {
        "flock_id": flock["id"],
        "date": "2026-10-16",
        "symptoms": "Coughing and lethargy",
        "affected_birds": 50,
        "birds_lost": 15,
        "action": "Administered electrolytes and antibiotics",
        "notes": "Isolated birds in hospital pen"
    }
    response = client.post("/api/v1/health/incidents", json=incident_payload, headers=headers)
    assert response.status_code == 201
    incident = response.json()
    assert incident["birds_lost"] == 15

    # 1. Flock current_birds must have automatically decremented to 985
    flock_updated = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_updated["current_birds"] == 985

    # 2. Phase 3 movement ledger must contain the Mortality movement
    assert len(flock_updated["movements"]) == 2  # [Initial stocking, Mortality]
    mort_mov = flock_updated["movements"][1]
    assert mort_mov["type"] == "Mortality"
    assert mort_mov["quantity"] == 15
    assert mort_mov["direction"] == "outflow"
    assert "Linked to health incident" in mort_mov["notes"]


def test_delete_health_incident_compensates_flock_population(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000007", "Compensate Farmer")

    # Create incident with 20 mortalities -> count drops to 980
    inc_resp = client.post("/api/v1/health/incidents", json={
        "flock_id": flock["id"],
        "date": "2026-10-17",
        "symptoms": "Mild sneezing",
        "affected_birds": 30,
        "birds_lost": 20
    }, headers=headers).json()

    flock_mid = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_mid["current_birds"] == 980

    # Delete health incident -> compensating Adjustment movement should restore population to 1000
    del_resp = client.delete(f"/api/v1/health/incidents/{inc_resp['id']}", headers=headers)
    assert del_resp.status_code == 200

    flock_restored = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_restored["current_birds"] == 1000
    types = [m["type"] for m in flock_restored["movements"]]
    assert "Adjustment" in types


def test_vaccination_and_treatment_records(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08020000008", "Vaccine Farmer")

    # Vaccination
    v_resp = client.post("/api/v1/health/vaccinations", json={
        "flock_id": flock["id"],
        "vaccine": "Lasota Newcastle Vaccine",
        "date": "2026-10-18",
        "birds": 1000,
        "next_date": "2026-11-18",
        "given_by": "Veterinary Officer"
    }, headers=headers)
    assert v_resp.status_code == 201
    vaccine = v_resp.json()
    assert vaccine["vaccine"] == "Lasota Newcastle Vaccine"
    assert vaccine["birds"] == 1000

    # Treatment
    t_resp = client.post("/api/v1/health/treatments", json={
        "flock_id": flock["id"],
        "treatment": "Coccidiosis preventive wash",
        "medicine": "Amprolium",
        "date": "2026-10-19",
        "birds_treated": 400,
        "given_by": "Farm Manager"
    }, headers=headers)
    assert t_resp.status_code == 201
    treatment = t_resp.json()
    assert treatment["treatment"] == "Coccidiosis preventive wash"
    assert treatment["birds_treated"] == 400

    # Overview KPI
    overview = client.get("/api/v1/health/overview", headers=headers).json()
    assert overview["total_vaccinations"] == 1
    assert overview["total_treatments"] == 1

