import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import reducer, * as actions from './rooftop';
const types = actions.ActionTypes;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('rooftop async actions', () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it('get ROOFTOP once fetch is done successfully', () => {
    const params = { address: '2015 Broadway, Oakland, CA 94612, USA' };

    fetchMock
      .get(`/api/polygons/${address}`, {
        $resolved: true,
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_ROOFTOP,
        params,
      },
      {
        type: types.RECEIVE_ROOFTOP,
        params,
        data: [],
      },
    ];

    const store = mockStore({ rooftop: {} });

    return store.dispatch(actions.fetchPolygon({ address: '2015 Broadway, Oakland, CA 94612, USA'  })).then(() => {
      const respActions = store.getActions();

      // Remove timestamp
      delete respActions[1]['receivedAt'];

      expect(respActions).toEqual(expectedActions);
    });
  });

  it('creates BAD_REQUEST once fetch is done unsuccessfully', () => {
    const params = { address: '2015 Broadway, Oakland, CA 94612, USA' };
    const error = 'Error happens on the backend';

    fetchMock
      .get('/api/polygon/address', {
        error,
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_ROOFTOP,
        params,
      },
      {
        type: types.BAD_REQUEST,
        req: 'fetchPolygon',
        error,
      },
    ];

    const store = mockStore({ rooftop: {} });

    return store.dispatch(actions.fetchPolygon({ address: '2015 Broadway, Oakland, CA 94612, USA' })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates BAD_REQUEST once fetch throws exception', () => {
    const params = { address: '2015 Broadway, Oakland, CA 94612, USA' };
    const error = 'TypeError: Cannot read property \'ok\' of undefined';

    fetchMock
      .get('/api/polygon/some_address', {
        throws: () => 'Exception',
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_ROOFTOP,
        params,
      },
      {
        type: types.BAD_REQUEST,
        req: 'fetchPolygon',
        error,
      },
    ];

    const store = mockStore({ rooftop: {} });

    return store.dispatch(actions.fetchPolygon({ address: '2015 Broadway, Oakland, CA 94612, USA' })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});


describe('rooftop reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle REQUEST_ROOFTOP', () => {
    expect(
      reducer(undefined, {
        type: actions.ActionTypes.REQUEST_ROOFTOP,
//        name,
//        options,
//        ...props,
      })
    ).toEqual({
//      type: name,
//      loading: false,
//      options,
    });
  });

  it('should handle RECEIVE_ROOFTOP', () => {
    expect(
      reducer(undefined, {
        type: actions.ActionTypes.RECEIVE_ROOFTOP,
//        name,
//        options,
//        ...props,
      })
    ).toEqual({
//      type: name,
//      loading: false,
//      options,
    });
  });
});
