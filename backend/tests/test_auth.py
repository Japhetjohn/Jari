import uuid
import pytest
from datetime import timedelta
from app.models.user import User
from app.services.auth import AuthService
from app.shared.enums import UserRole, AccountStatus
from app.core.security import create_access_token, verify_password, get_password_hash


# 1. Database & Model Tests
def test_user_creation_and_hash(db_session):
    user = AuthService.create_admin_seed_user(
        db=db_session,
        phone="08012345678",
        full_name="Test Farmer",
        password="secretpassword",
        role=UserRole.FARMER
    )
    assert user.id is not None
    assert user.phone == "08012345678"
    assert user.role == UserRole.FARMER
    assert user.status == AccountStatus.ACTIVE
    assert user.hashed_password != "secretpassword"
    assert verify_password("secretpassword", user.hashed_password) is True


def test_unique_phone_constraint(db_session):
    AuthService.create_admin_seed_user(
        db=db_session,
        phone="08012345678",
        full_name="Farmer One",
        password="password123",
        role=UserRole.FARMER
    )
    with pytest.raises(Exception):
        # Attempt to insert identical phone directly
        dup_user = User(
            full_name="Farmer Two",
            phone="08012345678",
            hashed_password=get_password_hash("password456"),
            role=UserRole.FARMER,
            status=AccountStatus.ACTIVE,
        )
        db_session.add(dup_user)
        db_session.commit()


# 2. Farmer Registration Tests
def test_register_farmer_success(client):
    payload = {
        "full_name": "Amina Daniel",
        "phone": "08030000000",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Amina Daniel"
    assert data["phone"] == "08030000000"
    assert data["role"] == "farmer"
    assert data["status"] == "active"
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_farmer_duplicate_phone(client):
    payload = {
        "full_name": "Amina Daniel",
        "phone": "08030000000",
        "password": "password123"
    }
    client.post("/api/v1/auth/register", json=payload)
    # Duplicate attempt
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_register_invalid_phone(client):
    payload = {
        "full_name": "Invalid Phone",
        "phone": "123",  # Too short
        "password": "password123"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


def test_register_weak_password(client):
    payload = {
        "full_name": "Weak Pass",
        "phone": "08011223344",
        "password": "123"  # Less than 6 characters
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


# 3. User Login Tests
def test_login_success(client):
    # Register first
    client.post("/api/v1/auth/register", json={
        "full_name": "Login Farmer",
        "phone": "08099887766",
        "password": "correctpassword"
    })

    # Attempt login
    response = client.post("/api/v1/auth/login", json={
        "phone": "08099887766",
        "password": "correctpassword"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == "08099887766"
    assert data["user"]["role"] == "farmer"


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "full_name": "Login Farmer",
        "phone": "08099887766",
        "password": "correctpassword"
    })

    response = client.post("/api/v1/auth/login", json={
        "phone": "08099887766",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "Invalid phone number or password" in response.json()["detail"]


def test_login_unknown_user(client):
    response = client.post("/api/v1/auth/login", json={
        "phone": "08000000000",
        "password": "anypassword"
    })
    assert response.status_code == 401
    assert "Invalid phone number or password" in response.json()["detail"]


def test_login_inactive_user(client, db_session):
    # Seed inactive user
    user = User(
        full_name="Suspended Farmer",
        phone="08044444444",
        hashed_password=get_password_hash("password123"),
        role=UserRole.FARMER,
        status=AccountStatus.SUSPENDED
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/v1/auth/login", json={
        "phone": "08044444444",
        "password": "password123"
    })
    assert response.status_code == 403
    assert "inactive or suspended" in response.json()["detail"]


# 4. Authenticated User Profile & Role Authorization Tests
def test_read_current_user_me(client):
    # Register & Login
    client.post("/api/v1/auth/register", json={
        "full_name": "Amina Profile",
        "phone": "08055555555",
        "password": "password123"
    })
    login_resp = client.post("/api/v1/auth/login", json={
        "phone": "08055555555",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]

    # Call /auth/me with Bearer token
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["phone"] == "08055555555"
    assert data["full_name"] == "Amina Profile"
    assert data["role"] == "farmer"


def test_read_current_user_no_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_read_current_user_invalid_token(client):
    response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
    assert response.status_code == 401


def test_read_current_user_expired_token(client, db_session):
    # Create user
    user = AuthService.create_admin_seed_user(
        db=db_session,
        phone="08066666666",
        full_name="Expired User",
        password="password123",
        role=UserRole.FARMER
    )
    # Token expired 1 hour ago
    expired_token = create_access_token(
        subject=user.id,
        role=user.role.value,
        expires_delta=timedelta(hours=-1)
    )

    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 401


def test_role_security_prevent_privilege_escalation(client):
    # Ensure public registration only ever assigns 'farmer' role
    payload = {
        "full_name": "Hacker Trying Admin",
        "phone": "08077777777",
        "password": "password123",
        "role": "admin"  # Injected field
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "farmer"  # Strictly farmer

