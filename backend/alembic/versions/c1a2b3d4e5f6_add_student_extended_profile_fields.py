"""add student extended profile fields

Revision ID: c1a2b3d4e5f6
Revises: f3b1c8e2a4d5
Create Date: 2026-07-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "c1a2b3d4e5f6"
down_revision: Union[str, None] = "f3b1c8e2a4d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("students", sa.Column("roll_number", sa.String(), nullable=True))
    op.add_column("students", sa.Column("degree", sa.String(), nullable=True))
    op.add_column("students", sa.Column("current_semester", sa.Integer(), nullable=True))
    op.add_column("students", sa.Column("graduation_year", sa.Integer(), nullable=True))
    op.add_column("students", sa.Column("active_backlogs", sa.Integer(), server_default="0", nullable=True))
    op.add_column("students", sa.Column("historical_backlogs", sa.Integer(), server_default="0", nullable=True))
    op.add_column("students", sa.Column("tenth_percentage", sa.Float(), nullable=True))
    op.add_column("students", sa.Column("twelfth_percentage", sa.Float(), nullable=True))
    op.add_column("students", sa.Column("alternative_email", sa.String(), nullable=True))
    op.add_column("students", sa.Column("whatsapp_number", sa.String(), nullable=True))
    op.add_column("students", sa.Column("parent_contact", sa.String(), nullable=True))
    op.add_column("students", sa.Column("resume_url", sa.String(), nullable=True))
    op.add_column("students", sa.Column("linkedin_url", sa.String(), nullable=True))
    op.add_column("students", sa.Column("github_url", sa.String(), nullable=True))
    op.add_column("students", sa.Column("profile_complete", sa.Boolean(), server_default="false", nullable=False))
    op.create_index(op.f("ix_students_roll_number"), "students", ["roll_number"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_students_roll_number"), table_name="students")
    op.drop_column("students", "profile_complete")
    op.drop_column("students", "github_url")
    op.drop_column("students", "linkedin_url")
    op.drop_column("students", "resume_url")
    op.drop_column("students", "parent_contact")
    op.drop_column("students", "whatsapp_number")
    op.drop_column("students", "alternative_email")
    op.drop_column("students", "twelfth_percentage")
    op.drop_column("students", "tenth_percentage")
    op.drop_column("students", "historical_backlogs")
    op.drop_column("students", "active_backlogs")
    op.drop_column("students", "graduation_year")
    op.drop_column("students", "current_semester")
    op.drop_column("students", "degree")
    op.drop_column("students", "roll_number")
