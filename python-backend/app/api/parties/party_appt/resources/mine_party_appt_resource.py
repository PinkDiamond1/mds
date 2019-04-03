from datetime import datetime, timedelta
import uuid

from flask import request
from flask_restplus import Resource, reqparse
from sqlalchemy import or_, exc as alch_exceptions
from werkzeug.exceptions import BadRequest, InternalServerError, NotFound

from ..models.mine_party_appt import MinePartyAppointment
from ..models.mine_party_appt_type import MinePartyAppointmentType
from ....constants import PARTY_STATUS_CODE
from app.extensions import api
from ....utils.access_decorators import requires_role_mine_view, requires_role_mine_create
from ....utils.resources_mixins import UserMixin, ErrorMixin


class MinePartyApptResource(Resource, UserMixin, ErrorMixin):
    parser = reqparse.RequestParser()
    parser.add_argument('mine_guid', type=str, help='guid of the mine.')
    parser.add_argument('party_guid', type=str, help='guid of the party.')
    parser.add_argument(
        'mine_party_appt_type_code',
        type=str,
        help='code for the type of appt.',
        store_missing=False)
    parser.add_argument('related_guid', type=str, store_missing=False)
    parser.add_argument(
        'start_date',
        type=lambda x: datetime.strptime(x, '%Y-%m-%d') if x else None,
        store_missing=False)
    parser.add_argument(
        'end_date',
        type=lambda x: datetime.strptime(x, '%Y-%m-%d') if x else None,
        store_missing=False)

    @api.doc(params={'mine_party_appt_guid': 'mine party appointment serial id'})
    @requires_role_mine_view
    def get(self, mine_party_appt_guid=None):
        relationships = request.args.get('relationships')
        relationships = relationships.split(',') if relationships else []
        if mine_party_appt_guid:
            mpa = MinePartyAppointment.find_by_mine_party_appt_guid(mine_party_appt_guid)
            if not mpa:
                raise NotFound('Mine Party Appointment not found')
            result = mpa.json(relationships=relationships)
        else:
            mine_guid = request.args.get('mine_guid')
            party_guid = request.args.get('party_guid')
            types = request.args.getlist('types')  #list
            mpas = MinePartyAppointment.find_by(
                mine_guid=mine_guid, party_guid=party_guid, mine_party_appt_type_codes=types)
            result = [x.json(relationships=relationships) for x in mpas]
        return result

    @api.doc(params={'mine_party_appt_guid': 'mine party appointment serial id'})
    @requires_role_mine_create
    def post(self, mine_party_appt_guid=None):
        if mine_party_appt_guid:
            raise BadRequest('unexpected mine party appointment guid')
        data = self.parser.parse_args()

        new_mpa = MinePartyAppointment(
            mine_guid=data.get('mine_guid'),
            party_guid=data.get('party_guid'),
            mine_party_appt_type_code=data.get('mine_party_appt_type_code'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            processed_by=self.get_user_info())

        if new_mpa.mine_party_appt_type_code == "EOR":
            new_mpa.assign_related_guid(data.get('related_guid'))
            if not new_mpa.mine_tailings_storage_facility_guid:
                raise AssertionError(
                    'mine_tailings_storage_facility_guid must be provided for Engineer of Record')
            #TODO move db foreign key constraint when services get separated
            pass

        if new_mpa.mine_party_appt_type_code == "PMT":
            new_mpa.assign_related_guid(data.get('related_guid'))
            if not new_mpa.permit_guid:
                raise AssertionError('permit_guid must be provided for Permittee')
            #TODO move db foreign key constraint when services get separated
            pass
        try:
            new_mpa.save()
        except alch_exceptions.IntegrityError as e:
            if "daterange_excl" in str(e):
                mpa_type_name = MinePartyAppointmentType.find_by_mine_party_appt_type_code(
                    data.get('mine_party_appt_type_code')).description
                raise BadRequest(f'Error: Date ranges for {mpa_type_name} must not overlap')
        return new_mpa.json()

    @api.doc(
        params={
            'mine_party_appt_guid':
            'mine party appointment guid, this endpoint only respects form data keys: start_date and end_date, and related_guid'
        })
    @requires_role_mine_create
    def put(self, mine_party_appt_guid=None):
        if not mine_party_appt_guid:
            raise BadRequest('missing mine party appointment guid')

        data = self.parser.parse_args()
        mpa = MinePartyAppointment.find_by_mine_party_appt_guid(mine_party_appt_guid)
        if not mpa:
            raise NotFound('mine party appointment not found')

        for key, value in data.items():
            if key in ['party_guid', 'mine_guid']:
                continue
            elif key == "related_guid":
                mpa.assign_related_guid(data.get('related_guid'))
            else:
                setattr(mpa, key, value)
        try:
            mpa.save()
        except alch_exceptions.IntegrityError as e:
            if "daterange_excl" in str(e):
                mpa_type_name = mpa.mine_party_appt_type.description
                raise BadRequest(f'Error: Date ranges for {mpa_type_name} must not overlap')

        return mpa.json()

    @api.doc(params={'mine_party_appt_guid': 'mine party appointment guid to be deleted'})
    @requires_role_mine_create
    def delete(self, mine_party_appt_guid=None):
        if not mine_party_appt_guid:
            raise BadRequest('expected mine party appointment guid')

        data = self.parser.parse_args()
        mpa = MinePartyAppointment.find_by_mine_party_appt_guid(mine_party_appt_guid)
        if not mpa:
            raise NotFound('mine party appointment not found')

        mpa.deleted_ind = True
        mpa.save()

        return ('', 204)
