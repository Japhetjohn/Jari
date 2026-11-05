"""create farm and poultry house tables

Revision ID: 0002_create_farm_and_poultry_house_tables
Revises: 0001_create_user_table
Create Date: 2026-11-05 11:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0002_create_farm_and_poultry_house_tables'
down_revision: Union[str, None] = '0001_create_user_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create 'farms' table
    op.create_table(
        'farms',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_name', sa.String(length=255), nullable=False),
        sa.Column('owner_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False, server_default='Plateau'),
        sa.Column('lga', sa.String(length=100), nullable=False),
        sa.Column('community', sa.String(length=100), nullable=False),
        sa.Column('establishment_date', sa.String(length=32), nullable=True),
        sa.Column('operation_type', sa.String(length=50), nullable=False, server_default='Broiler'),
        sa.Column('production_system', sa.String(length=50), nullable=False, server_default='Deep litter'),
        sa.Column('number_of_houses', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('water_source', sa.String(length=50), nullable=False, server_default='Borehole'),
        sa.Column('number_of_workers', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('biosecurity', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farms_id'), 'farms', ['id'], unique=False)
    op.create_index(op.f('ix_farms_user_id'), 'farms', ['user_id'], unique=True)

    # 2. Create 'poultry_houses' table
    op.create_table(
        'poultry_houses',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('system', sa.String(length=50), nullable=False, server_default='Deep litter'),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('water', sa.String(length=50), nullable=False, server_default='Borehole'),
        sa.Column('feed_storage', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('ventilation', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_archived', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('farm_id', 'name', name='uq_farm_house_name')
    )
    op.create_index(op.f('ix_poultry_houses_id'), 'poultry_houses', ['id'], unique=False)
    op.create_index(op.f('ix_poultry_houses_farm_id'), 'poultry_houses', ['farm_id'], unique=False)
    op.create_index(op.f('ix_poultry_houses_is_archived'), 'poultry_houses', ['is_archived'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_poultry_houses_is_archived'), table_name='poultry_houses')
    op.drop_index(op.f('ix_poultry_houses_farm_id'), table_name='poultry_houses')
    op.drop_index(op.f('ix_poultry_houses_id'), table_name='poultry_houses')
    op.drop_table('poultry_houses')

    op.drop_index(op.f('ix_farms_user_id'), table_name='farms')
    op.drop_index(op.f('ix_farms_id'), table_name='farms')
    op.drop_table('farms')

