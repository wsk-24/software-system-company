"""init tables

Revision ID: baf0be297a4d
Revises: 079bcf478c94
Create Date: 2026-05-29 23:21:51.054375

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'baf0be297a4d'
down_revision: Union[str, Sequence[str], None] = '079bcf478c94'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
