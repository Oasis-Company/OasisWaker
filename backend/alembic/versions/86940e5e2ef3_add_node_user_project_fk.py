"""add_node_user_project_fk

Revision ID: 86940e5e2ef3
Revises: 2f2198937175
Create Date: 2026-07-13 17:45:02.656420

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '86940e5e2ef3'
down_revision: Union[str, Sequence[str], None] = '2f2198937175'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add columns one at a time — SQLite supports ADD COLUMN
    op.add_column('nodes', sa.Column('user_id', sa.String(36), nullable=True))
    op.add_column('nodes', sa.Column('project_id', sa.String(36), nullable=True))
    op.create_index('ix_nodes_user_id', 'nodes', ['user_id'], unique=False)
    op.create_index('ix_nodes_project_id', 'nodes', ['project_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_nodes_project_id', table_name='nodes')
    op.drop_index('ix_nodes_user_id', table_name='nodes')
    op.drop_column('nodes', 'project_id')
    op.drop_column('nodes', 'user_id')