import uuid
import pytest
from app.models.user import User
from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse
from app.models.flock import Flock
from app.models.flock_movement import FlockMovement
from app.shared.enums import UserRole, FlockStatus, FlockMovementType, MovementDirection


def setup_farmer_and_houses(client, phone, full_name="Farmer Doe"):
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

    farm_resp = client.post("/api/v1/farms", json={
        "farm_name": f"{full_name} Farm",
        "owner_name": full_name,
        "phone": phone,
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru"
    }, headers=headers)
    farm = farm_resp.json()

    house_a = client.post("/api/v1/houses", json={
        "name": "House A",
        "capacity": 1000
    }, headers=headers).json()

    house_b = client.post("/api/v1/houses", json={
        "name": "House B",
        "capacity": 800
    }, headers=headers).json()

    return headers, farm, house_a, house_b


# 1. Flock Registration Tests
def test_create_flock_success_and_initial_stocking(client):
    headers, farm, house_a, _ = setup_farmer_and_houses(client, "08010000001", "Stocking Farmer")

    payload = {
        "name": "Broiler Batch 01",
        "type": "Broiler",
        "house_id": house_a["id"],
        "breed": "Ross 308",
        "initial_birds": 600,
        "acquisition_date": "2026-10-01",
        "purchase_cost": 250000.0
    }
    response = client.post("/api/v1/flocks", json=payload, headers=headers)
    assert response.status_code == 201
    flock = response.json()
    assert flock["name"] == "Broiler Batch 01"
    assert flock["initial_birds"] == 600
    assert flock["current_birds"] == 600
    assert flock["status"] == "Active"
    assert flock["house_name"] == "House A"

    # Verify Detail & Initial Stocking Movement
    detail_resp = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers)
    assert detail_resp.status_code == 200
    detail = detail_resp.json()
    assert detail["total_inflows"] == 600
    assert detail["total_outflows"] == 0
    assert len(detail["movements"]) == 1
    initial_mov = detail["movements"][0]
    assert initial_mov["type"] == "Initial stocking"
    assert initial_mov["direction"] == "inflow"
    assert initial_mov["quantity"] == 600


def test_reject_flock_exceeding_house_capacity(client):
    headers, _, house_a, _ = setup_farmer_and_houses(client, "08010000002", "Overcap Farmer")

    # House A capacity is 1000. Attempt 1200.
    payload = {
        "name": "Giant Flock",
        "house_id": house_a["id"],
        "initial_birds": 1200
    }
    response = client.post("/api/v1/flocks", json=payload, headers=headers)
    assert response.status_code == 400
    assert "exceed the remaining space" in response.json()["detail"]


def test_reject_flock_in_archived_house(client):
    headers, _, house_a, _ = setup_farmer_and_houses(client, "08010000003", "Archive Check Farmer")

    # Archive House A first
    del_resp = client.delete(f"/api/v1/houses/{house_a['id']}", headers=headers)
    assert del_resp.status_code == 200

    # Attempt flock registration in archived house
    payload = {
        "name": "Orphan Flock",
        "house_id": house_a["id"],
        "initial_birds": 200
    }
    response = client.post("/api/v1/flocks", json=payload, headers=headers)
    assert response.status_code == 400
    assert "archived" in response.json()["detail"]


# 2. Bird Movement Operations Tests
def test_record_flock_movements_and_completion(client):
    headers, _, house_a, _ = setup_farmer_and_houses(client, "08010000004", "Movement Farmer")

    flock = client.post("/api/v1/flocks", json={
        "name": "Batch Alpha",
        "house_id": house_a["id"],
        "initial_birds": 500
    }, headers=headers).json()

    # 1. Mortality Outflow (-20)
    mov_mort = client.post("/api/v1/flocks/movement", json={
        "flock_id": flock["id"],
        "type": "Mortality",
        "quantity": 20,
        "date": "2026-10-05",
        "reason": "Heat stress"
    }, headers=headers)
    assert mov_mort.status_code == 201

    flock_updated = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_updated["current_birds"] == 480
    assert flock_updated["status"] == "Active"

    # 2. Acquisition Inflow (+50)
    mov_acq = client.post("/api/v1/flocks/movement", json={
        "flock_id": flock["id"],
        "type": "Bird acquisition",
        "quantity": 50,
        "date": "2026-10-08",
        "reason": "Purchased additional point of lay pullets"
    }, headers=headers)
    assert mov_acq.status_code == 201

    flock_updated = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_updated["current_birds"] == 530

    # 3. Prevent Outflow Greater Than Current Population (attempt 600 from 530)
    mov_over = client.post("/api/v1/flocks/movement", json={
        "flock_id": flock["id"],
        "type": "Sale",
        "quantity": 600,
        "date": "2026-10-10",
        "reason": "Bulk sale"
    }, headers=headers)
    assert mov_over.status_code == 400
    assert "cannot be greater than current flock population" in mov_over.json()["detail"]

    # 4. Sale of remaining 530 -> Flock should transition to Completed
    mov_deplete = client.post("/api/v1/flocks/movement", json={
        "flock_id": flock["id"],
        "type": "Sale",
        "quantity": 530,
        "date": "2026-10-15",
        "reason": "All remaining broilers sold to market"
    }, headers=headers)
    assert mov_deplete.status_code == 201

    flock_completed = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_completed["current_birds"] == 0
    assert flock_completed["status"] == "Completed"

    # 5. Completed flock rejects further movements
    mov_blocked = client.post("/api/v1/flocks/movement", json={
        "flock_id": flock["id"],
        "type": "Bird acquisition",
        "quantity": 100,
        "date": "2026-10-16",
        "reason": "Trying to add to completed batch"
    }, headers=headers)
    assert mov_blocked.status_code == 400
    assert "completed" in mov_blocked.json()["detail"]


# 3. Inter-House Flock Transfer Tests
def test_inter_house_flock_transfer_success(client):
    headers, _, house_a, house_b = setup_farmer_and_houses(client, "08010000005", "Transfer Farmer")

    # Create Batch A in House A (cap 1000)
    batch_a = client.post("/api/v1/flocks", json={
        "name": "Batch in House A",
        "house_id": house_a["id"],
        "initial_birds": 500
    }, headers=headers).json()

    # Create Batch B in House B (cap 800)
    batch_b = client.post("/api/v1/flocks", json={
        "name": "Batch in House B",
        "house_id": house_b["id"],
        "initial_birds": 200
    }, headers=headers).json()

    # Transfer 150 birds from Batch A -> Batch B
    transfer_payload = {
        "source_flock_id": batch_a["id"],
        "destination_flock_id": batch_b["id"],
        "quantity": 150,
        "date": "2026-10-20",
        "reason": "Thinning House A and stocking House B"
    }
    t_resp = client.post("/api/v1/flocks/transfer", json=transfer_payload, headers=headers)
    assert t_resp.status_code == 200
    t_data = t_resp.json()
    assert t_data["source_flock"]["current_birds"] == 350
    assert t_data["destination_flock"]["current_birds"] == 350
    assert len(t_data["movements"]) == 2

    # Verify movement records
    types = [m["type"] for m in t_data["movements"]]
    assert "Transfer out" in types
    assert "Transfer in" in types


def test_reject_transfer_exceeding_source_or_destination_capacity(client):
    headers, _, house_a, house_b = setup_farmer_and_houses(client, "08010000006", "Transfer Bounds")

    batch_a = client.post("/api/v1/flocks", json={
        "name": "Batch A Bounds",
        "house_id": house_a["id"],
        "initial_birds": 300
    }, headers=headers).json()

    # House B capacity is 800. Put 750 birds in Batch B (only 50 remaining capacity)
    batch_b = client.post("/api/v1/flocks", json={
        "name": "Batch B Bounds",
        "house_id": house_b["id"],
        "initial_birds": 750
    }, headers=headers).json()

    # 1. Attempt transfer greater than source current count (400 > 300)
    resp1 = client.post("/api/v1/flocks/transfer", json={
        "source_flock_id": batch_a["id"],
        "destination_flock_id": batch_b["id"],
        "quantity": 400,
        "date": "2026-10-21",
        "reason": "Too many"
    }, headers=headers)
    assert resp1.status_code == 400
    assert "Only 300 birds currently in" in resp1.json()["detail"]

    # 2. Attempt transfer exceeding destination house capacity (100 > 50 spaces left)
    resp2 = client.post("/api/v1/flocks/transfer", json={
        "source_flock_id": batch_a["id"],
        "destination_flock_id": batch_b["id"],
        "quantity": 100,
        "date": "2026-10-21",
        "reason": "Exceeding dest"
    }, headers=headers)
    assert resp2.status_code == 400
    assert "has only 50 spaces left" in resp2.json()["detail"]

    # Verify both flocks remained untouched
    b_a = client.get(f"/api/v1/flocks/{batch_a['id']}", headers=headers).json()
    b_b = client.get(f"/api/v1/flocks/{batch_b['id']}", headers=headers).json()
    assert b_a["current_birds"] == 300
    assert b_b["current_birds"] == 750


# 4. Poultry House Dynamic Synchronization Tests
def test_poultry_house_live_utilization_sync(client):
    headers, _, house_a, _ = setup_farmer_and_houses(client, "08010000007", "Sync Tester")

    # Initial house state: capacity 1000, current_birds 0, available 1000
    h_init = client.get("/api/v1/houses", headers=headers).json()[0]
    assert h_init["current_birds"] == 0
    assert h_init["available_capacity"] == 1000

    # Add flock 1 (400 birds)
    flock1 = client.post("/api/v1/flocks", json={
        "name": "Sync Flock 1",
        "house_id": house_a["id"],
        "initial_birds": 400
    }, headers=headers).json()

    # Add flock 2 (250 birds) into the same house
    flock2 = client.post("/api/v1/flocks", json={
        "name": "Sync Flock 2",
        "house_id": house_a["id"],
        "initial_birds": 250
    }, headers=headers).json()

    # Query houses -> current_birds = 650, available_capacity = 350
    h_updated = [h for h in client.get("/api/v1/houses", headers=headers).json() if h["id"] == house_a["id"]][0]
    assert h_updated["current_birds"] == 650
    assert h_updated["available_capacity"] == 350

    # Mortality in Flock 1 (-50 birds)
    client.post("/api/v1/flocks/movement", json={
        "flock_id": flock1["id"],
        "type": "Mortality",
        "quantity": 50,
        "date": "2026-10-22",
        "reason": "Loss"
    }, headers=headers)

    # Query houses -> current_birds = 600, available_capacity = 400
    h_after_mort = [h for h in client.get("/api/v1/houses", headers=headers).json() if h["id"] == house_a["id"]][0]
    assert h_after_mort["current_birds"] == 600
    assert h_after_mort["available_capacity"] == 400

    # Archive block: Attempting to archive House A while containing 600 birds -> Rejected
    del_blocked = client.delete(f"/api/v1/houses/{house_a['id']}", headers=headers)
    assert del_blocked.status_code == 400
    assert "contains 600 active birds" in del_blocked.json()["detail"]

