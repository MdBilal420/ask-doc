"""create docs table

Revision ID: cbd0f27582e6
Revises: 0a31823f61f2
Create Date: 2024-07-09 12:23:29.530532

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cbd0f27582e6'
down_revision: Union[str, None] = '0a31823f61f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
    create table docs(
        id bigserial primary key,
        name text,
        read boolean not null default false
    )
    """)

def downgrade():
    op.execute("drop table docs;")
