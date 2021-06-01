import SearchIndex from '../models/SearchIndex';
import { SearchResult } from '../models/SearchResult';
import { DEFAULT_SEARCH_VALUE, OPTIONS, DEFAULT_MAX_RESULTS_SEARCH } from '../modules/constants';
import { SubType } from '../modules/data';
import { FilterSet } from '../modules/filters';

export type SearchState = {
  index: SearchIndex;
  simpleSearchString: string;
  filterSet: FilterSet;
  results: SearchResult[];
  subtype: SubType;
  useAdvancedSearch: boolean;
  sortOption: string;
  maxResults: number;
};
  
export const initialSearchState: SearchState = {
  index: new SearchIndex(),
  simpleSearchString: DEFAULT_SEARCH_VALUE,
  filterSet: new FilterSet(),
  results: null,
  subtype: null,
  useAdvancedSearch: false,
  sortOption: OPTIONS.RELEVANCE,
  maxResults: DEFAULT_MAX_RESULTS_SEARCH,
};