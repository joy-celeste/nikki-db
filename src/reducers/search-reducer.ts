
import { AnyAction } from 'redux';
import { SearchActions } from '../actions/search-actions';
import { initialSearchState, SearchState } from '../states/search-state';

export default function searchReducer(
  state = initialSearchState,
  action: AnyAction,
): SearchState {
  switch (action.type) {
    case SearchActions.SEARCH_UPDATE_RESULTS:
      return { ...state, results: action.payload };
    case SearchActions.SEARCH_UPDATE_SEARCH_FILTERS:
      return { ...state, filterSet: action.payload };
    case SearchActions.SEARCH_UPDATE_SEARCH_STRING:
      return { ...state, simpleSearchString: action.payload };
    case SearchActions.SEARCH_USE_ADVANCED_SEARCH:
      return { ...state, useAdvancedSearch: action.payload };
    case SearchActions.SEARCH_UPDATE_MAX_RESULTS:
      return { ...state, maxResults: action.payload };
    case SearchActions.SEARCH_UPDATE_SORT_OPTION:
      return { ...state, sortOption: action.payload };
    default:
      return state;
  }
}
