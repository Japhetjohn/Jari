import uuid
import pytest
from app.models.user import User
from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse
from app.services.auth import AuthService
from app.shared.enums import UserRole, AccountStatus


def register_and_login(client, phone, full_name="Test Farmer"):
    client.post("/api/v1/auth/register", json={
        "full_name": full_name,
        "phone": phone,
        "password": "password123"
    })
    login_resp = client.post("/api/v1/auth/login", json={
        "phone": phone,
        "password": "password123"
    })
    return login_resp.json()["access_token"]


# 1. Farm Operations Tests
def test_create_farm_success(client):
    token = register_and_login(client, "08011111111", "Farm Owner")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "farm_name": "Golden Feathers Poultry",
        "owner_name": "Amina Daniel",
        "phone": "08011111111",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru",
        "establishment_date": "2020-01-01",
        "operation_type": "Broiler",
        "production_system": "Deep litter",
        "number_of_houses": 0,
        "water_source": "Borehole",
        "number_of_workers": 6,
        "biosecurity": ["Footbath", "Visitor control"]
    }
    response = client.post("/api/v1/farms", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["farm_name"] == "Golden Feathers Poultry"
    assert data["community"] == "Kuru"
    assert data["biosecurity"] == ["Footbath", "Visitor control"]
    assert "id" in data
    assert "user_id" in data


def test_get_my_farm(client):
    token = register_and_login(client, "08022222222", "Profile Farmer")
    headers = {"Authorization": f"Bearer {token}"}

    # Before creating a farm -> 404
    resp_empty = client.get("/api/v1/farms/me", headers=headers)
    assert resp_empty.status_code == 404

    # Create farm
    client.post("/api/v1/farms", json={
        "farm_name": "Plateau Green Poultry",
        "owner_name": "Profile Farmer",
        "phone": "08022222222",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Bukuru"
    }, headers=headers)

    # Fetch farm -> 200
    resp_found = client.get("/api/v1/farms/me", headers=headers)
    assert resp_found.status_code == 200
    assert resp_found.json()["farm_name"] == "Plateau Green Poultry"


def test_prevent_duplicate_primary_farm(client):
    token = register_and_login(client, "08033333333", "Double Farm Farmer")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "farm_name": "Farm One",
        "owner_name": "Double Farm Farmer",
        "phone": "08033333333",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Vwang"
    }
    # First creation -> success
    resp1 = client.post("/api/v1/farms", json=payload, headers=headers)
    assert resp1.status_code == 201

    # Second creation -> error (one primary farm rule)
    resp2 = client.post("/api/v1/farms", json=payload, headers=headers)
    assert resp2.status_code == 400
    assert "already registered a farm" in resp2.json()["detail"]


def test_update_my_farm(client):
    token = register_and_login(client, "08044444444", "Updater Farmer")
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/api/v1/farms", json={
        "farm_name": "Initial Farm Name",
        "owner_name": "Updater Farmer",
        "phone": "08044444444",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Gyel"
    }, headers=headers)

    update_payload = {
        "farm_name": "Renamed Farm",
        "number_of_workers": 12,
        "biosecurity": ["Disinfection", "Footbath"]
    }
    resp = client.put("/api/v1/farms/me", json=update_payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["farm_name"] == "Renamed Farm"
    assert data["number_of_workers"] == 12
    assert data["community"] == "Gyel"  # Preserved


def test_farm_unauthenticated_forbidden(client):
    response = client.get("/api/v1/farms/me")
    assert response.status_code == 401

    response = client.post("/api/v1/farms", json={"farm_name": "Hacked"})
    assert response.status_code == 401


# 2. Poultry House Operations Tests
def test_create_and_list_poultry_houses(client):
    token = register_and_login(client, "08055555555", "House Manager")
    headers = {"Authorization": f"Bearer {token}"}

    # Register farm first
    client.post("/api/v1/farms", json={
        "farm_name": "House Farm",
        "owner_name": "House Manager",
        "phone": "08055555555",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Zawan"
    }, headers=headers)

    # Create House A
    house_a = client.post("/api/v1/houses", json={
        "name": "House A",
        "system": "Deep litter",
        "capacity": 1200,
        "water": "Borehole",
        "feed_storage": True,
        "ventilation": "Natural ventilation"
    }, headers=headers)
    assert house_a.status_code == 201
    assert house_a.json()["name"] == "House A"
    assert house_a.json()["available_capacity"] == 1200

    # Create House B
    house_b = client.post("/api/v1/houses", json={
        "name": "House B",
        "system": "Battery cage",
        "capacity": 1500,
        "water": "Well",
        "feed_storage": False
    }, headers=headers)
    assert house_b.status_code == 201

    # List houses
    list_resp = client.get("/api/v1/houses", headers=headers)
    assert list_resp.status_code == 200
    houses = list_resp.json()
    assert len(houses) == 2
    names = [h["name"] for h in houses]
    assert "House A" in names
    assert "House B" in names


def test_reject_duplicate_house_name_in_same_farm(client):
    token = register_and_login(client, "08066666666", "Duplicate Test")
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/api/v1/farms", json={
        "farm_name": "Duplicate House Farm",
        "owner_name": "Duplicate Test",
        "phone": "08066666666",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Du"
    }, headers=headers)

    client.post("/api/v1/houses", json={
        "name": "House 1",
        "capacity": 1000
    }, headers=headers)

    # Attempt same name
    resp_dup = client.post("/api/v1/houses", json={
        "name": "House 1",
        "capacity": 500
    }, headers=headers)
    assert resp_dup.status_code == 400
    assert "already exists in your farm" in resp_dup.json()["detail"]


def test_reject_invalid_capacity(client):
    token = register_and_login(client, "08077777777", "Capacity Tester")
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/api/v1/farms", json={
        "farm_name": "Capacity Farm",
        "owner_name": "Capacity Tester",
        "phone": "08077777777",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru"
    }, headers=headers)

    resp_zero = client.post("/api/v1/houses", json={
        "name": "Zero Cap House",
        "capacity": 0  # Invalid
    }, headers=headers)
    assert resp_zero.status_code == 422

    resp_neg = client.post("/api/v1/houses", json={
        "name": "Negative Cap House",
        "capacity": -50
    }, headers=headers)
    assert resp_neg.status_code == 422


def test_archive_poultry_house_and_exclude_from_default_list(client):
    token = register_and_login(client, "08088888888", "Archive Tester")
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/api/v1/farms", json={
        "farm_name": "Archive Farm",
        "owner_name": "Archive Tester",
        "phone": "08088888888",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru"
    }, headers=headers)

    h_resp = client.post("/api/v1/houses", json={
        "name": "House To Archive",
        "capacity": 800
    }, headers=headers)
    house_id = h_resp.json()["id"]

    # Delete (archive) house
    del_resp = client.delete(f"/api/v1/houses/{house_id}", headers=headers)
    assert del_resp.status_code == 200
    assert del_resp.json()["is_archived"] is True

    # Default listing should exclude archived
    list_active = client.get("/api/v1/houses", headers=headers)
    assert len(list_active.json()) == 0

    # Including archived should show it
    list_all = client.get("/api/v1/houses?include_archived=true", headers=headers)
    assert len(list_all.json()) == 1
    assert list_all.json()[0]["id"] == house_id


def test_farm_data_isolation_between_farmers(client):
    # Farmer A
    token_a = register_and_login(client, "08090000001", "Farmer Alpha")
    headers_a = {"Authorization": f"Bearer {token_a}"}
    client.post("/api/v1/farms", json={
        "farm_name": "Alpha Farm",
        "owner_name": "Farmer Alpha",
        "phone": "08090000001",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Kuru"
    }, headers_a)
    house_a = client.post("/api/v1/houses", json={"name": "Alpha House 1", "capacity": 1000}, headers_a).json()

    # Farmer B
    token_b = register_and_login(client, "08090000002", "Farmer Beta")
    headers_b = {"Authorization": f"Bearer {token_b}"}
    client.post("/api/v1/farms", json={
        "farm_name": "Beta Farm",
        "owner_name": "Farmer Beta",
        "phone": "08090000002",
        "state": "Plateau",
        "lga": "Jos South",
        "community": "Bukuru"
    }, headers_b)

    # Farmer B lists houses -> only sees their own (0 houses initially)
    resp_b_houses = client.get("/api/v1/houses", headers_b)
    assert len(resp_b_houses.json()) == 0

    # Farmer B attempts to update Farmer A's house -> rejected
    resp_b_hack = client.put(f"/api/v1/houses/{house_a['id']}", json={"name": "Hacked Name"}, headers_b)
    assert resp_b_hack.status_code == 400
    assert "not found or does not belong to your farm" in resp_b_hack.json()["detail"]

