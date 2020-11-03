import lunr, { Index } from 'lunr';
import { AnyAction } from 'redux';
import data from '../search_index.json';
import suits_data from '../suits_data.json';
import index_ref_to_name from '../index_ref_to_name.json';
import { ACTION_CONSTANTS, SEARCH_RESULT_TYPES } from './constants';
import { RootState } from '.';

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
  createIndex() {
    this.index = lunr(function() {
      this.pipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.stemmer);

      this.ref('id');
      this.field('name');
      this.field('type');

      data.forEach((doc) => {
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
    for (const result of this.index.search(searchTerm)) {
      if (output.length === maxResults) break;
      output.push(result.ref);
    }
    return output;
  }
}

export type SearchType = 'Item' | 'Suit';

export type SearchResult = {
  itemName: string;
  type: SearchType;
  iconId?: number;
};

export type SearchState = {
  index: SearchIndex;
  results: SearchResult[];
  readonly refToName: any;
  readonly suitData: any;
};

const initialState: SearchState = {
  index: new SearchIndex(),
  results: null,
  refToName: JSON.parse(JSON.stringify(index_ref_to_name)),
  suitData: JSON.parse(JSON.stringify(suits_data)),
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

    const parsedResults: SearchResult[] = initialResults.flatMap((result: string) => {
      const type = (result[0] === 'I' ? SEARCH_RESULT_TYPES.ITEM : SEARCH_RESULT_TYPES.SUIT) as SearchType;
      const id = parseInt(result.substring(1), 10) as number;

      if (type === SEARCH_RESULT_TYPES.SUIT) {
        const suitData = searchState.suitData[id];
        return Object.keys(suitData?.variations).map((variation) => ({
          type,
          itemName: `${suitData?.name}${variation === '0' ? ' (Suit)' : ' (Posed Suit)'}`,
          iconId: suitData?.variations[variation]?.icon_id,
        }));
      } else {
        return {
          type,
          itemName: searchState?.refToName?.[result],
          iconId: id,
        };
      }
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
