import fetchData from '../../../common/utils/fetchData';

const REQUEST_ROOFTOP = '/modules/domain/rooftop/REQUEST_ROOFTOP';
const RECEIVE_ROOFTOP = '/modules/domain/rooftop/RECEIVE_ROOFTOP';
const BAD_REQUEST = '/modules/domain/rooftop/BAD_REQUEST';

export const ActionTypes = {
  REQUEST_ROOFTOP,
  RECEIVE_ROOFTOP,
  BAD_REQUEST,
};

const initialState = {
  polygon: [],
};

export default function rooftop(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_ROOFTOP:
      return {
        ...state,
        polygon: action.data,
      };
    case BAD_REQUEST:
      return {
        ...state,
        [action.req]: {
          lastError: action.error,
        },
      };
    default:
      return state;
  }
}

// Export actions
export function requestRooftop(params) {
  return {
    type: REQUEST_ROOFTOP,
    params,
  };
}

export function receiveRooftop(data, params) {
  return {
    type: RECEIVE_ROOFTOP,
    data,
    params,
    receivedAt: Date.now(),
  };
}

export function badRequest(req, error) {
  return {
    type: BAD_REQUEST,
    req,
    error,
  };
}

export function fetchRooftop(params) {
  const { address, callback } = params;
  return (dispatch) => {
    const serverUrl = '/api/polygons/:address';

    dispatch(requestRooftop(params));

    return fetchData(serverUrl, {
      method: 'GET',
      params: { address },
    })
      .then(response => response.json())
      .then((json) => {
        if (json && json.status === "OK") {
          const result = json.results[0];
          const northeast = result.geometry.viewport.northeast;
          const southwest = result.geometry.viewport.southwest;
          const data = [
            { lat: northeast.lat, lng: northeast.lng },
            { lat: northeast.lat, lng: southwest.lng },
            { lat: southwest.lat, lng: southwest.lng },
            { lat: southwest.lat, lng: northeast.lng },
          ];

          // Noteed: There must be a better way to get the rooftop polygon as they are not always a rectangle
          dispatch(receiveRooftop(data, params));

          if (callback) {
            callback(json.results[0]);
          }
        } else {
          dispatch(badRequest('fetchRooftop', 'Error happens on the backend'));
        }
      })
      .catch((e) => {
        dispatch(badRequest('fetchRooftop', e.toString()));
      });
  }
}