"""create pdfs table

Revision ID: fded371ef7c3
Revises: cbd0f27582e6
Create Date: 2024-07-14 07:08:31.759665

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fded371ef7c3'
down_revision: Union[str, None] = 'cbd0f27582e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'pdfs',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('name', sa.Text, nullable=False),
        sa.Column('file', sa.Text, nullable=False),
        sa.Column('selected', sa.Boolean, nullable=False, default=False)
    )

def downgrade():
    op.drop_table('pdfs')
