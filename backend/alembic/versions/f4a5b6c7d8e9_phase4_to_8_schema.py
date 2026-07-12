"""Phase 4-8 schema: application pipeline, announcements, calendar, placement settings

Revision ID: f4a5b6c7d8e9
Revises: e1f2a3b4c5d6
Create Date: 2026-07-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'f4a5b6c7d8e9'
down_revision: Union[str, Sequence[str], None] = 'e1f2a3b4c5d6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Phase 4: extend applications table
    op.add_column('applications', sa.Column('next_action', sa.String(), nullable=True))
    op.add_column('applications', sa.Column('recruiter_notes', sa.Text(), nullable=True))

    # Phase 4: application status history
    op.create_table(
        'application_status_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('application_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('applications.id'), nullable=False),
        sa.Column('previous_status', sa.String(), nullable=True),
        sa.Column('new_status', sa.String(), nullable=False),
        sa.Column('changed_by', sa.String(), nullable=False),
        sa.Column('changed_by_role', sa.String(), nullable=False, server_default='admin'),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('note', sa.Text(), nullable=True),
    )
    op.create_index('ix_app_status_history_application_id', 'application_status_history', ['application_id'])

    # Phase 5: announcements
    op.create_table(
        'announcements',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('category', sa.String(), nullable=False, server_default='Notice'),
        sa.Column('priority', sa.String(), nullable=False, server_default='Normal'),
        sa.Column('created_by', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('active', sa.Boolean(), nullable=False, server_default='true'),
    )

    # Phase 8: calendar events
    op.create_table(
        'calendar_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('event_type', sa.String(), nullable=False, server_default='Notice'),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id'), nullable=True),
        sa.Column('created_by', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Phase 8: placement settings
    op.create_table(
        'placement_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('season_name', sa.String(), nullable=False, server_default='Placement Season 2025-26'),
        sa.Column('season_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('allowed_branches', sa.Text(), nullable=True),
        sa.Column('default_min_cgpa', sa.Float(), nullable=False, server_default='6.0'),
        sa.Column('max_backlogs_allowed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('placement_coordinator_name', sa.String(), nullable=True),
        sa.Column('placement_coordinator_email', sa.String(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('placement_settings')
    op.drop_table('calendar_events')
    op.drop_table('announcements')
    op.drop_index('ix_app_status_history_application_id', table_name='application_status_history')
    op.drop_table('application_status_history')
    op.drop_column('applications', 'recruiter_notes')
    op.drop_column('applications', 'next_action')
