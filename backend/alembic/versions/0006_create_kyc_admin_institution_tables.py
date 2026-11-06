"""create kyc, documents, institution profiles, farm access, and risk assessment tables

Revision ID: 0006_create_kyc_admin_institution_tables
Revises: 0005_create_financial_tables
Create Date: 2026-11-05 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0006_create_kyc_admin_institution_tables'
down_revision: Union[str, None] = '0005_create_financial_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. kyc_applications
    op.create_table(
        'kyc_applications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('farm_name', sa.String(length=120), nullable=False),
        sa.Column('location', sa.String(length=180), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('submitted_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('review_note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_kyc_applications_id'), 'kyc_applications', ['id'], unique=False)
    op.create_index(op.f('ix_kyc_applications_user_id'), 'kyc_applications', ['user_id'], unique=False)
    op.create_index(op.f('ix_kyc_applications_farm_id'), 'kyc_applications', ['farm_id'], unique=False)
    op.create_index(op.f('ix_kyc_applications_status'), 'kyc_applications', ['status'], unique=False)

    # 2. farm_documents
    op.create_table(
        'farm_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('document_type', sa.String(length=100), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('file_url', sa.Text(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farm_documents_id'), 'farm_documents', ['id'], unique=False)
    op.create_index(op.f('ix_farm_documents_user_id'), 'farm_documents', ['user_id'], unique=False)
    op.create_index(op.f('ix_farm_documents_farm_id'), 'farm_documents', ['farm_id'], unique=False)

    # 3. institution_profiles
    op.create_table(
        'institution_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('organisation_name', sa.String(length=255), nullable=False),
        sa.Column('organisation_type', sa.String(length=100), nullable=False),
        sa.Column('cac_registration_number', sa.String(length=100), nullable=False),
        sa.Column('year_established', sa.Integer(), nullable=True),
        sa.Column('official_email', sa.String(length=255), nullable=False),
        sa.Column('official_phone', sa.String(length=50), nullable=False),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('office_address', sa.Text(), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('lga', sa.String(length=100), nullable=True),
        sa.Column('categories', sa.JSON(), nullable=True),
        sa.Column('services', sa.JSON(), nullable=True),
        sa.Column('representative', sa.JSON(), nullable=True),
        sa.Column('documents', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('submitted_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('review_note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', name='uq_institution_user_id')
    )
    op.create_index(op.f('ix_institution_profiles_id'), 'institution_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_institution_profiles_user_id'), 'institution_profiles', ['user_id'], unique=True)
    op.create_index(op.f('ix_institution_profiles_organisation_name'), 'institution_profiles', ['organisation_name'], unique=False)
    op.create_index(op.f('ix_institution_profiles_cac_registration_number'), 'institution_profiles', ['cac_registration_number'], unique=False)
    op.create_index(op.f('ix_institution_profiles_status'), 'institution_profiles', ['status'], unique=False)

    # 4. institution_farm_access
    op.create_table(
        'institution_farm_access',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('institution_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('access_status', sa.String(length=50), nullable=False, server_default='active'),
        sa.Column('granted_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['institution_id'], ['institution_profiles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('institution_id', 'farm_id', name='uq_institution_farm_access')
    )
    op.create_index(op.f('ix_institution_farm_access_id'), 'institution_farm_access', ['id'], unique=False)
    op.create_index(op.f('ix_institution_farm_access_institution_id'), 'institution_farm_access', ['institution_id'], unique=False)
    op.create_index(op.f('ix_institution_farm_access_farm_id'), 'institution_farm_access', ['farm_id'], unique=False)
    op.create_index(op.f('ix_institution_farm_access_status'), 'institution_farm_access', ['access_status'], unique=False)

    # 5. farm_risk_assessments
    op.create_table(
        'farm_risk_assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('institution_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('score', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('risk_band', sa.String(length=50), nullable=False),
        sa.Column('metrics', sa.JSON(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('assessed_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['institution_id'], ['institution_profiles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farm_risk_assessments_id'), 'farm_risk_assessments', ['id'], unique=False)
    op.create_index(op.f('ix_farm_risk_assessments_institution_id'), 'farm_risk_assessments', ['institution_id'], unique=False)
    op.create_index(op.f('ix_farm_risk_assessments_farm_id'), 'farm_risk_assessments', ['farm_id'], unique=False)
    op.create_index(op.f('ix_farm_risk_assessments_risk_band'), 'farm_risk_assessments', ['risk_band'], unique=False)


def downgrade() -> None:
    op.drop_table('farm_risk_assessments')
    op.drop_table('institution_farm_access')
    op.drop_table('institution_profiles')
    op.drop_table('farm_documents')
    op.drop_table('kyc_applications')

