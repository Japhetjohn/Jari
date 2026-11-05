"""create user table

Revision ID: 0001_create_user_table
Revises: 
Create Date: 2026-11-05 11:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0001_create_user_table'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types explicitly for PostgreSQL
    user_role_enum = postgresql.ENUM('farmer', 'admin', 'institutional_user', name='user_role')
    user_role_enum.create(op.get_bind(), checkfirst=True)

    account_status_enum = postgresql.ENUM('active', 'suspended', 'pending', name='account_status')
    account_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('farmer', 'admin', 'institutional_user', name='user_role', create_type=False), nullable=False, server_default='farmer'),
        sa.Column('status', sa.Enum('active', 'suspended', 'pending', name='account_status', create_type=False), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_phone'), 'users', ['phone'], unique=True)
    op.create_index(op.f('ix_users_role'), 'users', ['role'], unique=False)
    op.create_index(op.f('ix_users_status'), 'users', ['status'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_users_status'), table_name='users')
    op.drop_index(op.f('ix_users_role'), table_name='users')
    op.drop_index(op.f('ix_users_phone'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

    bind = op.get_bind()
    account_status_enum = postgresql.ENUM('active', 'suspended', 'pending', name='account_status')
    account_status_enum.drop(bind, checkfirst=True)

    user_role_enum = postgresql.ENUM('farmer', 'admin', 'institutional_user', name='user_role')
    user_role_enum.drop(bind, checkfirst=True)

