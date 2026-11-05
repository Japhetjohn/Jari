"""create flock and flock movement tables

Revision ID: 0003_create_flock_and_flock_movement_tables
Revises: 0002_create_farm_and_poultry_house_tables
Create Date: 2026-11-05 11:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0003_create_flock_and_flock_movement_tables'
down_revision: Union[str, None] = '0002_create_farm_and_poultry_house_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create enum types explicitly for PostgreSQL
    flock_status_enum = postgresql.ENUM('Active', 'Completed', name='flock_status')
    flock_status_enum.create(op.get_bind(), checkfirst=True)

    flock_movement_type_enum = postgresql.ENUM(
        'Initial stocking',
        'Bird acquisition',
        'Additional stocking',
        'Mortality',
        'Sale',
        'Transfer in',
        'Transfer out',
        'Adjustment',
        name='flock_movement_type'
    )
    flock_movement_type_enum.create(op.get_bind(), checkfirst=True)

    movement_direction_enum = postgresql.ENUM('inflow', 'outflow', name='movement_direction')
    movement_direction_enum.create(op.get_bind(), checkfirst=True)

    # 2. Create 'flocks' table
    op.create_table(
        'flocks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('house_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False, server_default='Broiler'),
        sa.Column('breed', sa.String(length=100), nullable=True),
        sa.Column('initial_birds', sa.Integer(), nullable=False),
        sa.Column('current_birds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('acquisition_date', sa.String(length=32), nullable=True),
        sa.Column('cycle_start', sa.String(length=32), nullable=True),
        sa.Column('source', sa.String(length=255), nullable=True),
        sa.Column('age_at_acquisition', sa.Integer(), nullable=True),
        sa.Column('age_unit', sa.String(length=20), nullable=True, server_default='Days'),
        sa.Column('purchase_cost', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('status', sa.Enum('Active', 'Completed', name='flock_status'), nullable=False, server_default='Active'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['house_id'], ['poultry_houses.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('farm_id', 'name', name='uq_farm_flock_name')
    )
    op.create_index(op.f('ix_flocks_id'), 'flocks', ['id'], unique=False)
    op.create_index(op.f('ix_flocks_farm_id'), 'flocks', ['farm_id'], unique=False)
    op.create_index(op.f('ix_flocks_house_id'), 'flocks', ['house_id'], unique=False)
    op.create_index(op.f('ix_flocks_status'), 'flocks', ['status'], unique=False)

    # 3. Create 'flock_movements' table
    op.create_table(
        'flock_movements',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('flock_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.Enum('Initial stocking', 'Bird acquisition', 'Additional stocking', 'Mortality', 'Sale', 'Transfer in', 'Transfer out', 'Adjustment', name='flock_movement_type'), nullable=False),
        sa.Column('direction', sa.Enum('inflow', 'outflow', name='movement_direction'), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('date', sa.String(length=32), nullable=False),
        sa.Column('reason', sa.String(length=255), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('source_house', sa.String(length=100), nullable=True),
        sa.Column('destination_house', sa.String(length=100), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['flock_id'], ['flocks.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_flock_movements_id'), 'flock_movements', ['id'], unique=False)
    op.create_index(op.f('ix_flock_movements_farm_id'), 'flock_movements', ['farm_id'], unique=False)
    op.create_index(op.f('ix_flock_movements_flock_id'), 'flock_movements', ['flock_id'], unique=False)
    op.create_index(op.f('ix_flock_movements_type'), 'flock_movements', ['type'], unique=False)
    op.create_index(op.f('ix_flock_movements_direction'), 'flock_movements', ['direction'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_flock_movements_direction'), table_name='flock_movements')
    op.drop_index(op.f('ix_flock_movements_type'), table_name='flock_movements')
    op.drop_index(op.f('ix_flock_movements_flock_id'), table_name='flock_movements')
    op.drop_index(op.f('ix_flock_movements_farm_id'), table_name='flock_movements')
    op.drop_index(op.f('ix_flock_movements_id'), table_name='flock_movements')
    op.drop_table('flock_movements')

    op.drop_index(op.f('ix_flocks_status'), table_name='flocks')
    op.drop_index(op.f('ix_flocks_house_id'), table_name='flocks')
    op.drop_index(op.f('ix_flocks_farm_id'), table_name='flocks')
    op.drop_index(op.f('ix_flocks_id'), table_name='flocks')
    op.drop_table('flocks')

    bind = op.get_bind()
    movement_direction_enum = postgresql.ENUM('inflow', 'outflow', name='movement_direction')
    movement_direction_enum.drop(bind, checkfirst=True)

    flock_movement_type_enum = postgresql.ENUM(
        'Initial stocking',
        'Bird acquisition',
        'Additional stocking',
        'Mortality',
        'Sale',
        'Transfer in',
        'Transfer out',
        'Adjustment',
        name='flock_movement_type'
    )
    flock_movement_type_enum.drop(bind, checkfirst=True)

    flock_status_enum = postgresql.ENUM('Active', 'Completed', name='flock_status')
    flock_status_enum.drop(bind, checkfirst=True)

