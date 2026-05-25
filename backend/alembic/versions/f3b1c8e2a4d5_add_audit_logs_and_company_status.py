"""add audit_logs table and company status

Revision ID: f3b1c8e2a4d5
Revises: a537fa1e2d36
Create Date: 2026-05-25 06:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'f3b1c8e2a4d5'
down_revision: Union[str, Sequence[str], None] = 'a537fa1e2d36'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('audit_logs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('actor_id', sa.String(), nullable=False),
        sa.Column('actor_name', sa.String(), nullable=False),
        sa.Column('actor_role', sa.String(), nullable=False),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('resource_type', sa.String(), nullable=False),
        sa.Column('resource_id', sa.String(), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.add_column('companies', sa.Column('status', sa.String(), server_default='active', nullable=False))


def downgrade() -> None:
    op.drop_column('companies', 'status')
    op.drop_table('audit_logs')
