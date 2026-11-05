import enum


class UserRole(str, enum.Enum):
    FARMER = "farmer"
    ADMIN = "admin"
    INSTITUTIONAL_USER = "institutional_user"


class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    PENDING = "pending"
