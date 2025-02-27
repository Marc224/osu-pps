import { combineReducers } from 'redux';
import { fetchJson } from 'utils/fetch';
import { DEBUG_FETCH } from 'constants/common';

const getTypes = mode => ({
  LOADING: `${mode}/METADATA/LOADING`,
  SUCCESS: `${mode}/METADATA/SUCCESS`,
  ERROR: `${mode}/METADATA/ERROR`,
});

const initialState = {
  isLoading: false,
  lastUpdated: null,
};

const getReducer = mode => {
  const { LOADING, SUCCESS, ERROR } = getTypes(mode);
  return function metadataReducer(state = initialState, action) {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          isLoading: true,
        };
      case ERROR:
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      case SUCCESS:
        return {
          ...state,
          isLoading: false,
          lastUpdated: new Date(action.data.lastUpdated).toLocaleDateString(),
          lastUpdatedTime: new Date(action.data.lastUpdated).toTimeString(),
        };
      default:
        return state;
    }
  };
};

export default combineReducers({
  osu: getReducer('osu'),
  taiko: getReducer('taiko'),
  mania: getReducer('mania'),
  fruits: getReducer('fruits'),
});

export const fetchMetadata = mode => {
  const { LOADING, SUCCESS, ERROR } = getTypes(mode);
  return async dispatch => {
    dispatch({ type: LOADING });
    try {
      const data = await fetchJson({
        url: DEBUG_FETCH
          ? `/metadata-${mode}.json`
          : `https://raw.githubusercontent.com/grumd/osu-pps/master/metadata-${mode}.json`,
      });
      dispatch({ type: SUCCESS, data });
      return data;
    } catch (error) {
      dispatch({ type: ERROR, error });
    }
  };
};
