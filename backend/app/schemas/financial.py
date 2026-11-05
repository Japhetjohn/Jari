import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


# --- PAYMENT SCHEMAS ---

class PaymentEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    sale_id: Optional[uuid.UUID] = None
    expense_id: Optional[uuid.UUID] = None
    kind: str
    amount: Decimal
    date: str
    note: Optional[str] = None
    created_at: datetime


class PaymentCreateRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Amount paid/received")
    date: str = Field(..., description="Date of payment (YYYY-MM-DD)")
    note: Optional[str] = Field(default=None, max_length=255, description="Payment note or reference")


# --- SALE SCHEMAS ---

class SaleCreate(BaseModel):
    date: str = Field(..., description="Sale date (YYYY-MM-DD)")
    product: str = Field(..., min_length=1, max_length=100, description="Product sold (Live birds, Eggs, Manure, etc.)")
    quantity: int = Field(default=0, ge=0, description="Quantity sold")
    unit: str = Field(default="Units", max_length=50, description="Unit (Birds, Crates, Trays, Kg)")
    unit_price: Optional[Decimal] = Field(default=None, ge=0, description="Unit price")
    total_amount: Optional[Decimal] = Field(default=None, ge=0, description="Total sale amount")
    amount_received: Decimal = Field(default=Decimal("0.00"), ge=0, description="Upfront cash received")
    flock_id: Optional[uuid.UUID] = Field(default=None, description="Linked flock ID (required for Live birds)")
    notes: Optional[str] = Field(default=None, description="Sale notes")

    @field_validator("product")
    @classmethod
    def strip_product(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Product cannot be empty.")
        return val


class SaleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: Optional[uuid.UUID] = None
    flock_name: Optional[str] = None
    date: str
    product: str
    quantity: int
    unit: str
    unit_price: Decimal
    total_amount: Decimal
    amount_received: Decimal
    outstanding: Decimal
    status: str
    notes: Optional[str] = None
    payments: List[PaymentEntryResponse] = []
    created_at: datetime


# --- EXPENSE SCHEMAS ---

class ExpenseCreate(BaseModel):
    date: str = Field(..., description="Expense date (YYYY-MM-DD)")
    category: str = Field(..., min_length=2, max_length=100, description="Category (Feed, Labour, Utilities, etc.)")
    amount: Decimal = Field(..., gt=0, description="Total expense amount")
    amount_paid: Decimal = Field(default=Decimal("0.00"), ge=0, description="Amount paid upfront")
    flock_id: Optional[uuid.UUID] = Field(default=None, description="Optional linked flock ID")
    note: Optional[str] = Field(default=None, description="Expense details/notes")

    @field_validator("category")
    @classmethod
    def strip_category(cls, v: str) -> str:
        val = v.strip()
        if not val:
            raise ValueError("Category cannot be empty.")
        return val


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    farm_id: uuid.UUID
    flock_id: Optional[uuid.UUID] = None
    flock_name: Optional[str] = None
    date: str
    category: str
    amount: Decimal
    amount_paid: Decimal
    outstanding: Decimal
    status: str
    note: Optional[str] = None
    payments: List[PaymentEntryResponse] = []
    created_at: datetime


# --- FINANCIAL OVERVIEW & SUMMARY SCHEMAS ---

class FinancialOverviewResponse(BaseModel):
    total_sales: Decimal
    cash_received: Decimal
    outstanding_receivables: Decimal
    total_expenses: Decimal
    feed_costs: Decimal
    cash_paid_out: Decimal
    outstanding_payables: Decimal
    net_cash_flow: Decimal
    operating_result: Decimal


class FinancialTransactionItem(BaseModel):
    id: uuid.UUID
    date: str
    type: str  # "Sale", "Payment Received", "Expense", "Bill Payment", "Feed Purchase"
    description: str
    category_or_product: str
    amount: Decimal
    direction: str  # "inflow" or "outflow"
    flock_name: Optional[str] = None

