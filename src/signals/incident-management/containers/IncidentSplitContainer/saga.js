import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import { authPatchCall, authPostCall } from '../../../../shared/services/api/api';

function formatUpdateIncident(values) {
  const update = {
    text: values.text,
    category: {
      sub_category: values.subcategory
    },
    priority: {
      priority: values.priority
    }
  };

  if (values.note) {
    update.notes = [{
      text: values.note
    }];
  }

  return update;
}

export function* splitIncident(action) {
  const payload = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  try {
    const created = yield authPostCall(`${requestURL}/${payload.incident.id}/split`, payload.create);
    yield authPatchCall(`${requestURL}/${created[0].id}`, formatUpdateIncident(payload.update[0]));
    yield authPatchCall(`${requestURL}/${created[1].id}`, formatUpdateIncident(payload.update[1]));
    if (created[2] && created[2].id && payload.update[2]) {
      yield authPatchCall(`${requestURL}/${created[2].id}`, formatUpdateIncident(payload.update[2]));
    }
    yield put(splitIncidentSuccess({ id: payload.incident.id, created }));
    yield put(push(`/manage/incident/${payload.incident.id}`));
  } catch (error) {
    yield put(splitIncidentError(error));
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(SPLIT_INCIDENT, splitIncident);
}
