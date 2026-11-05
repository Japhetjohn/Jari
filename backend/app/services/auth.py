from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.user import User
from app.schemas.auth import FarmerRegisterRequest
from app.shared.enums import UserRole, AccountStatus
from app.core.security import get_password_hash, verify_password


class AuthService:
    @staticmethod
    def get_user_by_phone(db: Session, phone: str) -> Optional[User]:
        stmt = select(User).where(User.phone == phone)
        return db.scalar(stmt)

    @staticmethod
    def get_user_by_id(db: Session, user_id) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        return db.scalar(stmt)

    @staticmethod
    def register_farmer(db: Session, data: FarmerRegisterRequest) -> User:
        existing = AuthService.get_user_by_phone(db, data.phone)
        if existing:
            raise ValueError("An account with this phone number already exists.")

        user = User(
            full_name=data.full_name,
            phone=data.phone,
            hashed_password=get_password_hash(data.password),
            role=UserRole.FARMER,
            status=AccountStatus.ACTIVE,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, phone: str, password: str) -> Optional[User]:
        user = AuthService.get_user_by_phone(db, phone)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_admin_seed_user(
        db: Session,
        phone: str,
        full_name: str,
        password: str,
        role: UserRole = UserRole.ADMIN
    ) -> User:
        existing = AuthService.get_user_by_phone(db, phone)
        if existing:
            return existing

        user = User(
            full_name=full_name,
            phone=phone,
            hashed_password=get_password_hash(password),
            role=role,
            status=AccountStatus.ACTIVE,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

