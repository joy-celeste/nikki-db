import { AnyAction } from 'redux';
import { SearchResult } from 'models/SearchResult';
import { FilterSet } from '../../modules/filters';

export const SearchActions = {
  SEARCH_UPDATE_RESULTS: 'search/UPDATE_RESULTS',
  SEARCH_UPDATE_SEARCH_FILTERS: 'search/UPDATE_SEARCH_FILTERS',
  SEARCH_UPDATE_SEARCH_STRING: 'search/UPDATE_SEARCH_STRING',
  SEARCH_UPDATE_MAX_RESULTS: 'search/SEARCH_UPDATE_MAX_RESULTS',
  SEARCH_USE_ADVANCED_SEARCH: 'search/USE_ADVANCED_SEARCH',
  SEARCH_UPDATE_SORT_OPTION: 'search/UPDATE_SORT_OPTION',
};

export const updateSearchResults = (searchResults: SearchResult[]): AnyAction => ({
  type: SearchActions.SEARCH_UPDATE_RESULTS,
  payload: searchResults,
});
  
  export const updateSearchString = (searchString: string): AnyAction => ({
  type: SearchActions.SEARCH_UPDATE_SEARCH_STRING,
  payload: searchString,
});
  
export const updateSortOption = (sortOption: string): AnyAction => ({
  type: SearchActions.SEARCH_UPDATE_SORT_OPTION,
  payload: sortOption,
});
  
  export const updateFilterSet = (filterSet: FilterSet): AnyAction => ({
  type: SearchActions.SEARCH_UPDATE_SEARCH_FILTERS,
  payload: filterSet,
});
  
  export const updateMaxResults = (maxResults: number): AnyAction => ({
  type: SearchActions.SEARCH_UPDATE_MAX_RESULTS,
  payload: maxResults,
});
  
  export const setAdvancedSearch = (useAdvancedSearch: boolean): AnyAction => ({
  type: SearchActions.SEARCH_USE_ADVANCED_SEARCH,
  payload: useAdvancedSearch,
});