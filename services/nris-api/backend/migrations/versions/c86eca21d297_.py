"""empty message

Revision ID: c86eca21d297
Revises: 2db7d022d4f7
Create Date: 2020-07-29 16:08:11.690671

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c86eca21d297'
down_revision = '2db7d022d4f7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('attendee_type', 'attendee_type',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('document', 'comment',
               existing_type=sa.VARCHAR(length=1024),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('document', 'file_name',
               existing_type=sa.VARCHAR(length=1024),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('document_type', 'document_type',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('inspected_location_type', 'inspected_location_type',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('inspection_reason', 'inspection_reason_code',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=10485760),
               existing_nullable=False)
    op.alter_column('inspection_reason', 'inspection_reason_description',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('inspection_status', 'inspection_status_code',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=10485760),
               existing_nullable=False)
    op.alter_column('inspection_status', 'inspection_status_description',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('inspection_substatus', 'inspection_substatus_code',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=10485760),
               existing_nullable=False)
    op.alter_column('inspection_substatus', 'inspection_substatus_description',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('inspection_type', 'inspection_type_code',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=10485760),
               existing_nullable=False)
    op.alter_column('inspection_type', 'inspection_type_description',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('legislation_act', 'act',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('legislation_act_section', 'section',
               existing_type=sa.VARCHAR(length=64),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('location', 'description',
               existing_type=sa.VARCHAR(length=1024),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('noncompliance_legislation', 'noncompliant_description',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('noncompliance_permit', 'section_number',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('noncompliance_permit', 'section_title',
               existing_type=sa.VARCHAR(length=2048),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'authority_act',
               existing_type=sa.VARCHAR(length=64),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'authority_act_section',
               existing_type=sa.VARCHAR(length=64),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'response_status',
               existing_type=sa.VARCHAR(length=64),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'stop_status',
               existing_type=sa.VARCHAR(length=64),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'stop_type',
               existing_type=sa.VARCHAR(length=256),
               type_=sa.String(length=10485760),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('order_stop_detail', 'stop_type',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'stop_status',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=64),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'response_status',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=64),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'authority_act_section',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=64),
               existing_nullable=True)
    op.alter_column('order_stop_detail', 'authority_act',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=64),
               existing_nullable=True)
    op.alter_column('noncompliance_permit', 'section_title',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=2048),
               existing_nullable=True)
    op.alter_column('noncompliance_permit', 'section_number',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('noncompliance_legislation', 'noncompliant_description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('location', 'description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=1024),
               existing_nullable=True)
    op.alter_column('legislation_act_section', 'section',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=64),
               existing_nullable=True)
    op.alter_column('legislation_act', 'act',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('inspection_type', 'inspection_type_description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('inspection_type', 'inspection_type_code',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
    op.alter_column('inspection_substatus', 'inspection_substatus_description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('inspection_substatus', 'inspection_substatus_code',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
    op.alter_column('inspection_status', 'inspection_status_description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('inspection_status', 'inspection_status_code',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
    op.alter_column('inspection_reason', 'inspection_reason_description',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('inspection_reason', 'inspection_reason_code',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
    op.alter_column('inspected_location_type', 'inspected_location_type',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('document_type', 'document_type',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    op.alter_column('document', 'file_name',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=1024),
               existing_nullable=True)
    op.alter_column('document', 'comment',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=1024),
               existing_nullable=True)
    op.alter_column('attendee_type', 'attendee_type',
               existing_type=sa.String(length=10485760),
               type_=sa.VARCHAR(length=256),
               existing_nullable=True)
    # ### end Alembic commands ###