"""add company extended fields

Revision ID: e1f2a3b4c5d6
Revises: b2c3d4e5f6a7
Create Date: 2026-07-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('companies', sa.Column('ctc', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('companies', sa.Column('hiring_process', sa.Text(), nullable=True))
    op.add_column('companies', sa.Column('required_skills', sa.Text(), nullable=True))
    op.add_column('companies', sa.Column('location', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('company_type', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('companies', 'company_type')
    op.drop_column('companies', 'location')
    op.drop_column('companies', 'required_skills')
    op.drop_column('companies', 'hiring_process')
    op.drop_column('companies', 'description')
    op.drop_column('companies', 'ctc')
