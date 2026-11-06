"""create sales, expenses, and financial payments tables

Revision ID: 0005_create_financial_tables
Revises: 0004_create_operations_and_health_tables
Create Date: 2026-11-05 12:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0005_create_financial_tables'
down_revision: Union[str, None] = '0004_create_operations_and_health_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. sales
    op.create_table(
        'sales',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('product', sa.String(length=100), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('unit', sa.String(length=50), nullable=False, server_default='Units'),
        sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('amount_received', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('outstanding', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='Unpaid'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sales_id'), 'sales', ['id'], unique=False)
    op.create_index(op.f('ix_sales_farm_id'), 'sales', ['farm_id'], unique=False)
    op.create_index(op.f('ix_sales_flock_id'), 'sales', ['flock_id'], unique=False)
    op.create_index(op.f('ix_sales_date'), 'sales', ['date'], unique=False)
    op.create_index(op.f('ix_sales_product'), 'sales', ['product'], unique=False)
    op.create_index(op.f('ix_sales_status'), 'sales', ['status'], unique=False)

    # 2. expenses
    op.create_table(
        'expenses',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('amount_paid', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('outstanding', sa.Numeric(precision=12, scale=2), nullable=False, server_default='0.00'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='Paid'),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_expenses_id'), 'expenses', ['id'], unique=False)
    op.create_index(op.f('ix_expenses_farm_id'), 'expenses', ['farm_id'], unique=False)
    op.create_index(op.f('ix_expenses_flock_id'), 'expenses', ['flock_id'], unique=False)
    op.create_index(op.f('ix_expenses_date'), 'expenses', ['date'], unique=False)
    op.create_index(op.f('ix_expenses_category'), 'expenses', ['category'], unique=False)
    op.create_index(op.f('ix_expenses_status'), 'expenses', ['status'], unique=False)

    # 3. financial_payments
    op.create_table(
        'financial_payments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('sale_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('expense_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('kind', sa.String(length=20), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sale_id'], ['sales.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['expense_id'], ['expenses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_financial_payments_id'), 'financial_payments', ['id'], unique=False)
    op.create_index(op.f('ix_financial_payments_farm_id'), 'financial_payments', ['farm_id'], unique=False)
    op.create_index(op.f('ix_financial_payments_sale_id'), 'financial_payments', ['sale_id'], unique=False)
    op.create_index(op.f('ix_financial_payments_expense_id'), 'financial_payments', ['expense_id'], unique=False)
    op.create_index(op.f('ix_financial_payments_date'), 'financial_payments', ['date'], unique=False)


def downgrade() -> None:
    op.drop_table('financial_payments')
    op.drop_table('expenses')
    op.drop_table('sales')

