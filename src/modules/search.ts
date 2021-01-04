import lunr, { Index } from 'lunr';
import { AnyAction } from 'redux';
import searchIndexData from '../data/search_index.json';
import refToSearchResult from '../data/ref_to_search_result.json';
import { ACTION_CONSTANTS, ITEM_SUFFIX } from './constants';
import { RootState } from '.';
import { ItemId } from './data';

export const MAX_RESULTS = 150;

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
      this.field('spec');
      this.field('rare');
      this.field('posed');
      this.field('tag1');
      this.field('tag2');
      this.field('depth');
      this.field('subtype');
      this.field('genre');
      this.field('isSuit');

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
  posed?: boolean;
  variation?: string;
  isSuit?: boolean
};

export type SearchState = {
  index: SearchIndex;
  results: SearchResult[];
};

export type RefToSearchData = Record<string, SearchData>;

const refToData: RefToSearchData = JSON.parse(JSON.stringify(refToSearchResult));

interface SearchData {
  name: string,
  iconId: ItemId,
  contents: ItemId[],
  posed?: boolean,
  variation?: string,
  isSuit?: boolean
}

const initialState: SearchState = {
  index: new SearchIndex(),
  results: null,
};

// ACTIONS
const updateSearchResults = (searchResults: SearchResult[]): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_RESULTS,
  payload: searchResults,
});

// USE-CASE
/* istanbul ignore next */ /* branch not passing coverage check for MAX_RESULT? */
export const searchName = (searchTerm: string, maxResults: number = MAX_RESULTS) =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const searchState = getState().search;
    const initialResults = searchState.index.search(searchTerm, maxResults);
    const parsedResults: SearchResult[] = initialResults.flatMap((key: string) => {
      const suitData = refToData[key];
      let displayName = suitData?.name;

      if (suitData?.isSuit) {
        if (suitData?.posed) {
          displayName += ITEM_SUFFIX.POSED_SUIT;
        } else {
        displayName += ITEM_SUFFIX.SUIT;
        }
      }

      if (suitData?.variation) {
        return {
          name: displayName,
          iconId: suitData?.iconId,
          contents: suitData?.contents,
          posed: suitData?.posed,
          variation: suitData?.variation,
          isSuit: suitData?.isSuit,
        };
      }
      return {
        name: displayName,
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
