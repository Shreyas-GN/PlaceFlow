"""add student portfolio fields

Revision ID: b2c3d4e5f6a7
Revises: c1a2b3d4e5f6
Create Date: 2026-07-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "c1a2b3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("students", sa.Column("skills", sa.JSON(), nullable=True))
    op.add_column("students", sa.Column("projects", sa.JSON(), nullable=True))
    op.add_column("students", sa.Column("certifications", sa.JSON(), nullable=True))
    op.add_column("students", sa.Column("placement_eligible", sa.Boolean(), nullable=True))


def downgrade() -> None:
    op.drop_column("students", "placement_eligible")
    op.drop_column("students", "certifications")
    op.drop_column("students", "projects")
    op.drop_column("students", "skills")
