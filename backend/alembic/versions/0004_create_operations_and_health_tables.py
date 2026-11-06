"""create feed, production, and health tables

Revision ID: 0004_create_operations_and_health_tables
Revises: 0003_create_flock_and_flock_movement_tables
Create Date: 2026-11-05 12:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0004_create_operations_and_health_tables'
down_revision: Union[str, None] = '0003_create_flock_and_flock_movement_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. feed_purchases
    op.create_table(
        'feed_purchases',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('feed_type', sa.String(length=50), nullable=False),
        sa.Column('brand', sa.String(length=100), nullable=False),
        sa.Column('supplier', sa.String(length=255), nullable=True),
        sa.Column('quantity', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=20), nullable=False, server_default='bags'),
        sa.Column('bag_weight_kg', sa.Float(), nullable=False, server_default='25.0'),
        sa.Column('total_quantity_kg', sa.Float(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('amount_paid', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_feed_purchases_id'), 'feed_purchases', ['id'], unique=False)
    op.create_index(op.f('ix_feed_purchases_farm_id'), 'feed_purchases', ['farm_id'], unique=False)
    op.create_index(op.f('ix_feed_purchases_flock_id'), 'feed_purchases', ['flock_id'], unique=False)
    op.create_index(op.f('ix_feed_purchases_date'), 'feed_purchases', ['date'], unique=False)
    op.create_index(op.f('ix_feed_purchases_feed_type'), 'feed_purchases', ['feed_type'], unique=False)

    # 2. feed_consumptions
    op.create_table(
        'feed_consumptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('feed_type', sa.String(length=50), nullable=False),
        sa.Column('quantity_kg', sa.Float(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_feed_consumptions_id'), 'feed_consumptions', ['id'], unique=False)
    op.create_index(op.f('ix_feed_consumptions_farm_id'), 'feed_consumptions', ['farm_id'], unique=False)
    op.create_index(op.f('ix_feed_consumptions_flock_id'), 'feed_consumptions', ['flock_id'], unique=False)
    op.create_index(op.f('ix_feed_consumptions_date'), 'feed_consumptions', ['date'], unique=False)
    op.create_index(op.f('ix_feed_consumptions_feed_type'), 'feed_consumptions', ['feed_type'], unique=False)

    # 3. production_records
    op.create_table(
        'production_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('live_birds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('eggs_collected', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('good_eggs', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('damaged_eggs', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('birds_weighed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('average_weight', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('birds_ready', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_production_records_id'), 'production_records', ['id'], unique=False)
    op.create_index(op.f('ix_production_records_farm_id'), 'production_records', ['farm_id'], unique=False)
    op.create_index(op.f('ix_production_records_flock_id'), 'production_records', ['flock_id'], unique=False)
    op.create_index(op.f('ix_production_records_date'), 'production_records', ['date'], unique=False)

    # 4. health_incidents
    op.create_table(
        'health_incidents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('symptoms', sa.String(length=500), nullable=False),
        sa.Column('affected_birds', sa.Integer(), nullable=False),
        sa.Column('birds_lost', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('action', sa.String(length=255), nullable=False, server_default='Monitoring'),
        sa.Column('outcome', sa.String(length=100), nullable=True, server_default='Being monitored'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_health_incidents_id'), 'health_incidents', ['id'], unique=False)
    op.create_index(op.f('ix_health_incidents_farm_id'), 'health_incidents', ['farm_id'], unique=False)
    op.create_index(op.f('ix_health_incidents_flock_id'), 'health_incidents', ['flock_id'], unique=False)
    op.create_index(op.f('ix_health_incidents_date'), 'health_incidents', ['date'], unique=False)

    # 5. vaccination_records
    op.create_table(
        'vaccination_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('vaccine', sa.String(length=160), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('birds', sa.Integer(), nullable=False),
        sa.Column('next_date', sa.String(length=32), nullable=True),
        sa.Column('given_by', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vaccination_records_id'), 'vaccination_records', ['id'], unique=False)
    op.create_index(op.f('ix_vaccination_records_farm_id'), 'vaccination_records', ['farm_id'], unique=False)
    op.create_index(op.f('ix_vaccination_records_flock_id'), 'vaccination_records', ['flock_id'], unique=False)
    op.create_index(op.f('ix_vaccination_records_date'), 'vaccination_records', ['date'], unique=False)

    # 6. treatment_records
    op.create_table(
        'treatment_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('treatment', sa.String(length=160), nullable=False),
        sa.Column('medicine', sa.String(length=120), nullable=True),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('birds_treated', sa.Integer(), nullable=False),
        sa.Column('given_by', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_treatment_records_id'), 'treatment_records', ['id'], unique=False)
    op.create_index(op.f('ix_treatment_records_farm_id'), 'treatment_records', ['farm_id'], unique=False)
    op.create_index(op.f('ix_treatment_records_flock_id'), 'treatment_records', ['flock_id'], unique=False)
    op.create_index(op.f('ix_treatment_records_date'), 'treatment_records', ['date'], unique=False)


def downgrade() -> None:
    op.drop_table('treatment_records')
    op.drop_table('vaccination_records')
    op.drop_table('health_incidents')
    op.drop_table('production_records')
    op.drop_table('feed_consumptions')
    op.drop_table('feed_purchases')

