import lunr, { Index } from 'lunr';
import { AnyAction } from 'redux';
import searchIndexData from '../search_index.json';
import refToSearchResult from '../ref_to_search_result.json';
import { ACTION_CONSTANTS } from './constants';
import { RootState } from '.';
import { ItemId } from './data';

const MAX_RESULTS = 5;

export default class SearchIndex {
  index: Index;

  constructor() {
    this.createIndex();
  }

  /**
   * Process the data and create a search index.
   * NOTE: Stemming is disabled :)
   */
  createIndex(): SearchIndex {
    this.index = lunr(function options() {
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);

      this.ref('id');
      this.field('name');
      this.field('type');

      searchIndexData.forEach((doc) => {
        this.add(doc);
      }, this);
    });
    return this;
  }

  /**
   * Looks up the item within the search index.
   * @param searchTerm The search input.
   * @param maxResults The max number of results to return.
   */
  search(searchTerm: string, maxResults = MAX_RESULTS): string[] {
    const output: string[] = [];
    this.index.search(searchTerm).some((result) => {
      output.push(result.ref);
      return output.length === maxResults;
    });
    return output;
  }
}

export type SearchResult = {
  name: string;
  iconId?: ItemId;
  contents: ItemId[];
};

export type SearchState = {
  index: SearchIndex;
  results: SearchResult[];
  readonly refToData: any;
};

const initialState: SearchState = {
  index: new SearchIndex(),
  results: null,
  refToData: JSON.parse(JSON.stringify(refToSearchResult)),
};

// ACTIONS
const updateSearchResults = (searchResults: SearchResult[]): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_RESULTS,
  payload: searchResults,
});

// USE-CASE
export const searchName = (searchTerm: string, maxResults = MAX_RESULTS) =>
  async(dispatch: Function, getState: () => RootState): Promise<any> => {
    const searchState = getState().search;
    const initialResults = searchState.index.search(`+name:${searchTerm} type:suit`, maxResults);
    const parsedResults: SearchResult[] = initialResults.flatMap((key: string) => {
      const suitData = searchState.refToData[key];
      return {
        name: suitData?.name,
        iconId: suitData?.iconId,
        contents: suitData?.contents,
      };
    });
    dispatch(updateSearchResults(parsedResults));
  };

// REDUCER
export function searchReducer(
  state = initialState,
  action: AnyAction,
): SearchState {
  switch (action.type) {
    case ACTION_CONSTANTS.SEARCH_UPDATE_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    default:
      return state;
  }
}
