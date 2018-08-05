import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  SET_INCIDENT,

  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,

  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR
} from './constants';

import {
  setIncident,

  createIncident,
  createIncidentSuccess,
  createIncidentError,

  getClassification,
  getClassificationSuccess,
  getClassificationError
} from './actions';

describe('Incident container actions', () => {
  const incident = {
    text: 'foo',
    category: 'bar'
  };

  it('should dispatch set incident action', () => {
    testActionCreator(setIncident, SET_INCIDENT, incident);
  });

  it('should dispatch create incident action', () => {
    testActionCreator(createIncident, CREATE_INCIDENT, incident);
  });

  it('should dispatch create incident success action', () => {
    testActionCreator(createIncidentSuccess, CREATE_INCIDENT_SUCCESS, incident);
  });

  it('should dispatch create incident success action', () => {
    testActionCreator(createIncidentError, CREATE_INCIDENT_ERROR);
  });

  it('should dispatch get classification action', () => {
    testActionCreator(getClassification, GET_CLASSIFICATION, 'poep');
  });

  it('should dispatch create incident success action', () => {
    const payload = {
      category: {
        main: [],
        sub: []
      }
    };
    testActionCreator(getClassificationSuccess, GET_CLASSIFICATION_SUCCESS, payload);
  });

  it('should dispatch create incident error action', () => {
    const payload = {
      category: {
        main: [],
        sub: []
      }
    };
    testActionCreator(getClassificationError, GET_CLASSIFICATION_ERROR, payload);
  });
});
