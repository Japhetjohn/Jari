import uuid
from decimal import Decimal
import pytest
from app.models.user import User
from app.models.farm import Farm
from app.models.poultry_house import PoultryHouse
from app.models.flock import Flock
from app.shared.enums import UserRole


def setup_farm_and_flock(client, phone, full_name="Financial Farmer"):
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
        "name": "Finance House",
        "capacity": 2000
    }, headers=headers).json()

    flock = client.post("/api/v1/flocks", json={
        "name": "Batch Finance 01",
        "type": "Broiler",
        "house_id": house["id"],
        "initial_birds": 1000
    }, headers=headers).json()

    return headers, farm, house, flock


# ==================== 1. SALES & LIVE BIRDS INTEGRATION TESTS ====================

def test_create_egg_sale_without_flock_deduction(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000001", "Egg Seller")

    sale_payload = {
        "date": "2026-10-10",
        "product": "Eggs",
        "quantity": 50,
        "unit": "Crates",
        "unit_price": 3200.0,
        "total_amount": 160000.0,
        "amount_received": 100000.0,
        "flock_id": flock["id"]
    }
    response = client.post("/api/v1/sales", json=sale_payload, headers=headers)
    assert response.status_code == 201
    sale = response.json()
    assert float(sale["total_amount"]) == 160000.0
    assert float(sale["amount_received"]) == 100000.0
    assert float(sale["outstanding"]) == 60000.0
    assert sale["status"] == "Part paid"
    assert len(sale["payments"]) == 1
    assert float(sale["payments"][0]["amount"]) == 100000.0

    # Ensure flock population is unchanged (1000 birds)
    flock_check = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_check["current_birds"] == 1000


def test_create_live_bird_sale_integrates_movement(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000002", "Bird Seller")

    sale_payload = {
        "date": "2026-10-12",
        "product": "Live birds",
        "quantity": 250,
        "unit": "Birds",
        "unit_price": 4000.0,
        "total_amount": 1000000.0,
        "amount_received": 1000000.0,
        "flock_id": flock["id"]
    }
    response = client.post("/api/v1/sales", json=sale_payload, headers=headers)
    assert response.status_code == 201
    sale = response.json()
    assert float(sale["total_amount"]) == 1000000.0
    assert float(sale["outstanding"]) == 0.0
    assert sale["status"] == "Paid"

    # Flock population must have automatically decremented from 1000 to 750
    flock_check = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_check["current_birds"] == 750
    assert len(flock_check["movements"]) == 2  # [Initial stocking, Sale]
    sale_mov = flock_check["movements"][1]
    assert sale_mov["type"] == "Sale"
    assert sale_mov["quantity"] == 250
    assert sale_mov["direction"] == "outflow"


def test_reject_live_bird_sale_exceeding_flock_population(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000003", "Over Seller")

    # Attempt to sell 1500 birds when only 1000 exist
    sale_payload = {
        "date": "2026-10-12",
        "product": "Live birds",
        "quantity": 1500,
        "unit": "Birds",
        "total_amount": 6000000.0,
        "amount_received": 6000000.0,
        "flock_id": flock["id"]
    }
    response = client.post("/api/v1/sales", json=sale_payload, headers=headers)
    assert response.status_code == 400
    assert "Only 1000 birds currently in" in response.json()["detail"]

    # Verify flock population remains 1000
    flock_check = client.get(f"/api/v1/flocks/{flock['id']}", headers=headers).json()
    assert flock_check["current_birds"] == 1000


# ==================== 2. PARTIAL PAYMENTS TESTS ====================

def test_record_multiple_partial_payments(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000004", "Payment Tracker")

    # Create sale of ₦500,000 with ₦200,000 upfront
    sale = client.post("/api/v1/sales", json={
        "date": "2026-10-15",
        "product": "Manure",
        "quantity": 100,
        "total_amount": 500000.0,
        "amount_received": 200000.0,
        "flock_id": flock["id"]
    }, headers=headers).json()
    sale_id = sale["id"]
    assert float(sale["outstanding"]) == 300000.0
    assert sale["status"] == "Part paid"

    # 1. First partial payment: ₦150,000
    p1 = client.post(f"/api/v1/sales/{sale_id}/payments", json={
        "amount": 150000.0,
        "date": "2026-10-18",
        "note": "Bank transfer payment 1"
    }, headers=headers).json()
    assert float(p1["amount_received"]) == 350000.0
    assert float(p1["outstanding"]) == 150000.0
    assert p1["status"] == "Part paid"
    assert len(p1["payments"]) == 2

    # 2. Reject payment exceeding outstanding balance (attempt ₦200,000 when balance is ₦150,000)
    p_fail = client.post(f"/api/v1/sales/{sale_id}/payments", json={
        "amount": 200000.0,
        "date": "2026-10-20"
    }, headers=headers)
    assert p_fail.status_code == 400
    assert "cannot exceed outstanding balance" in p_fail.json()["detail"]

    # 3. Final payment: ₦150,000 -> status transitions to Paid
    p2 = client.post(f"/api/v1/sales/{sale_id}/payments", json={
        "amount": 150000.0,
        "date": "2026-10-22",
        "note": "Final settlement"
    }, headers=headers).json()
    assert float(p2["amount_received"]) == 500000.0
    assert float(p2["outstanding"]) == 0.0
    assert p2["status"] == "Paid"
    assert len(p2["payments"]) == 3


# ==================== 3. EXPENSES TESTS ====================

def test_create_expense_and_partial_payment(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000005", "Expense Farmer")

    # Create Labour expense: ₦80,000 with ₦50,000 paid upfront
    exp = client.post("/api/v1/expenses", json={
        "date": "2026-10-15",
        "category": "Labour",
        "amount": 80000.0,
        "amount_paid": 50000.0,
        "flock_id": flock["id"],
        "note": "Farm manager October salary advance"
    }, headers=headers).json()
    assert float(exp["amount"]) == 80000.0
    assert float(exp["amount_paid"]) == 50000.0
    assert float(exp["outstanding"]) == 30000.0
    assert exp["status"] == "Part paid"

    # Pay off remaining ₦30,000
    p_exp = client.post(f"/api/v1/expenses/{exp['id']}/payments", json={
        "amount": 30000.0,
        "date": "2026-10-30",
        "note": "Balance of October salary"
    }, headers=headers).json()
    assert float(p_exp["amount_paid"]) == 80000.0
    assert float(p_exp["outstanding"]) == 0.0
    assert p_exp["status"] == "Paid"


# ==================== 4. FINANCIAL LEDGER & OVERVIEW TESTS ====================

def test_financial_overview_no_double_counting(client):
    headers, _, _, flock = setup_farm_and_flock(client, "08030000006", "Overview Farmer")

    # 1. Sale: ₦300,000 (₦200,000 received, ₦100,000 outstanding)
    client.post("/api/v1/sales", json={
        "date": "2026-10-10",
        "product": "Live birds",
        "quantity": 100,
        "total_amount": 300000.0,
        "amount_received": 200000.0,
        "flock_id": flock["id"]
    }, headers=headers)

    # 2. Operating Expense: ₦40,000 fully paid
    client.post("/api/v1/expenses", json={
        "date": "2026-10-11",
        "category": "Electricity and fuel",
        "amount": 40000.0,
        "amount_paid": 40000.0
    }, headers=headers)

    # 3. Feed Purchase (from Phase 4 feed module): ₦120,000 (₦100,000 paid)
    client.post("/api/v1/feed/purchases", json={
        "date": "2026-10-12",
        "feed_type": "Starter",
        "brand": "Top Feed",
        "quantity": 5,
        "unit": "bags",
        "amount": 120000.0,
        "amount_paid": 100000.0
    }, headers=headers)

    # Overview Metrics:
    # total_sales = 300,000
    # cash_received = 200,000
    # outstanding_receivables = 100,000
    # feed_costs = 120,000
    # total_expenses = 40,000 (Operating) + 120,000 (Feed) = 160,000
    # cash_paid_out = 40,000 (Operating paid) + 100,000 (Feed paid) = 140,000
    # outstanding_payables = 20,000
    # net_cash_flow = cash_received (200,000) - cash_paid_out (140,000) = 60,000
    # operating_result = total_sales (300,000) - total_expenses (160,000) = 140,000
    overview = client.get("/api/v1/financial/overview", headers=headers).json()
    assert float(overview["total_sales"]) == 300000.0
    assert float(overview["cash_received"]) == 200000.0
    assert float(overview["outstanding_receivables"]) == 100000.0
    assert float(overview["feed_costs"]) == 120000.0
    assert float(overview["total_expenses"]) == 160000.0
    assert float(overview["cash_paid_out"]) == 140000.0
    assert float(overview["outstanding_payables"]) == 20000.0
    assert float(overview["net_cash_flow"]) == 60000.0
    assert float(overview["operating_result"]) == 140000.0

    # Unified Transactions check
    txs = client.get("/api/v1/financial/transactions", headers=headers).json()
    assert len(txs) == 3
    types = [t["type"] for t in txs]
    assert "Sale" in types
    assert "Expense" in types
    assert "Feed Purchase" in types

