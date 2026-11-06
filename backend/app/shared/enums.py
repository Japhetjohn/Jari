import enum


class UserRole(str, enum.Enum):
    FARMER = "farmer"
    ADMIN = "admin"
    INSTITUTIONAL_USER = "institutional_user"


class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    PENDING = "pending"


class PoultryType(str, enum.Enum):
    BROILER = "Broiler"
    LAYER = "Layer"
    BREEDER = "Breeder"


class ProductionSystem(str, enum.Enum):
    DEEP_LITTER = "Deep litter"
    BATTERY_CAGE = "Battery cage"
    FREE_RANGE = "Free range"
    OTHER = "Other"


class WaterSource(str, enum.Enum):
    BOREHOLE = "Borehole"
    WELL = "Well"
    MUNICIPAL = "Municipal supply"
    SURFACE_WATER = "Surface water"
    OTHER = "Other"


class FlockStatus(str, enum.Enum):
    ACTIVE = "Active"
    COMPLETED = "Completed"


class FlockMovementType(str, enum.Enum):
    INITIAL_STOCKING = "Initial stocking"
    BIRD_ACQUISITION = "Bird acquisition"
    ADDITIONAL_STOCKING = "Additional stocking"
    MORTALITY = "Mortality"
    SALE = "Sale"
    TRANSFER_IN = "Transfer in"
    TRANSFER_OUT = "Transfer out"
    ADJUSTMENT = "Adjustment"


class MovementDirection(str, enum.Enum):
    INFLOW = "inflow"
    OUTFLOW = "outflow"


class KycStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    NEEDS_CHANGES = "needs_changes"
    REJECTED = "rejected"


class InstitutionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class RiskBand(str, enum.Enum):
    LOW_RISK = "Low Risk"
    MODERATE_RISK = "Moderate Risk"
    HIGH_RISK = "High Risk"

