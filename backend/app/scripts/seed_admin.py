import argparse
import sys
from app.database.session import SessionLocal
from app.services.auth import AuthService
from app.shared.enums import UserRole


def seed_admin(phone: str, full_name: str, password: str):
    db = SessionLocal()
    try:
        user = AuthService.create_admin_seed_user(
            db=db,
            phone=phone,
            full_name=full_name,
            password=password,
            role=UserRole.ADMIN
        )
        print(f"Admin user seeded successfully: {user.phone} ({user.full_name}) - ID: {user.id}")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed an administrator account into JARI.")
    parser.add_argument("--phone", required=True, help="Administrator phone number")
    parser.add_argument("--name", default="System Administrator", help="Full name of administrator")
    parser.add_argument("--password", required=True, help="Administrator password (min 6 characters)")

    args = parser.parse_args()
    if len(args.password) < 6:
        print("Error: Password must be at least 6 characters.")
        sys.exit(1)

    seed_admin(phone=args.phone, full_name=args.name, password=args.password)

