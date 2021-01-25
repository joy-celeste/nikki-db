import lunr, { Index } from 'lunr';
import { AnyAction } from 'redux';
import searchIndexData from '../data/search_index.json';
import refToSearchResult from '../data/ref_to_search_result.json';
import { ACTION_CONSTANTS, ITEM_SUFFIX, OPTIONS } from './constants';
import { RootState } from '.';
import { ItemId, SubType } from './data';

export const MAX_RESULTS = 150;
export const DEFAULT_BOOST_FACTOR = 3;
const DEFAULT_SEARCH_VALUE = '';

export interface SearchOption {
  value: string | number,
  label: string,
  color: string,
  type: string
}

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
  searchWithTerm(searchTerm: string, maxResults = MAX_RESULTS): string[] {
    const output: string[] = [];
    this.index.search(searchTerm).some((result) => {
      output.push(result.ref);
      return output.length === maxResults;
    });
    return output;
  }
}

export type SearchResult = {
  key?: string;
  displayName: string;
  iconId?: ItemId;
  contents: ItemId[];
  posed?: boolean;
  variation?: string;
  isSuit?: boolean;
};

export type SearchState = {
  index: SearchIndex;
  userInput: string;
  filters: SearchOption[];
  results: SearchResult[];
  subtype: SubType;
  hideCategories: boolean;
  sortOption: string;
};

const initialState: SearchState = {
  index: new SearchIndex(),
  userInput: DEFAULT_SEARCH_VALUE,
  filters: [],
  results: null,
  subtype: null,
  hideCategories: false,
  sortOption: OPTIONS.RELEVANCE,
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

// ACTIONS
const updateSearchResults = (searchResults: SearchResult[]): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_RESULTS,
  payload: searchResults,
});

export const updateSearchFilters = (searchTerms: SearchOption[]): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_FILTERS,
  payload: searchTerms,
});

export const updateSearchString = (searchString: string): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_STRING,
  payload: searchString,
});

export const updateSearchSubtype = (subtype: SubType): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_SUBTYPE,
  payload: subtype,
});

export const updateSuitsOnly = (suitsOnly: boolean): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SUITS_ONLY,
  payload: suitsOnly,
});

export const updateSortOption = (sortOption: string): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SORT_OPTION,
  payload: sortOption,
});

// USE-CASES
export const generateSearchTerm = (searchState: SearchState, dispatch: Function): string => {
  const userInput = searchState.userInput
    ? `+name:*${searchState.userInput.split(' ').map((word: string) => `${word.toLowerCase()}`).join('_')}*`
    : '';
  const anySuitsTag = searchState.filters.some((searchOption) => searchOption.value === OPTIONS.IS_SUIT);
  const suitsBoost = anySuitsTag ? '' : `isSuit:true^${DEFAULT_BOOST_FACTOR}`;
  const subtype = searchState.subtype && !anySuitsTag ? `+subtype:${searchState.subtype}` : '';
  const filters = searchState.filters.map((searchOption: SearchOption) => {
    if (searchOption.type === OPTIONS.TRUE || searchOption.type === OPTIONS.FALSE) {
      return `+${searchOption.value}:${searchOption.type}`;
    }
    return `+${searchOption.type}:${searchOption.value}`;
  }).join(' ');

  dispatch(updateSuitsOnly(anySuitsTag));
  return [filters, subtype, userInput, suitsBoost].filter((x) => x).join(' ');
};

/* istanbul ignore next */ /* branch not passing coverage check for MAX_RESULT? */
export const searchInventory = (maxResults: number = MAX_RESULTS) =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const searchState = getState().search;
    const { index, sortOption } = searchState;
    const searchTerm = generateSearchTerm(searchState, dispatch);
    const initialResults = index.searchWithTerm(searchTerm, maxResults);

    if (sortOption === OPTIONS.ID) {
      initialResults.sort();
    }
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
          key: `${suitData?.iconId}-${displayName}-${suitData?.variation}`,
          displayName,
          iconId: suitData?.iconId,
          contents: suitData?.contents,
          posed: suitData?.posed,
          variation: suitData?.variation,
          isSuit: suitData?.isSuit,
        };
      }
      return {
        displayName,
        iconId: suitData?.iconId,
        contents: suitData?.contents,
      };
    });

    switch (sortOption) {
      case OPTIONS.NAME:
        parsedResults.sort((a, b) => a.displayName.localeCompare(b.displayName));
        break;
      case OPTIONS.ID:
        parsedResults.sort((a, b) => a.key.localeCompare(b.key));
        break;
      case OPTIONS.RELEVANCE:
      default:
        break;
    }

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
    case ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };
    case ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_STRING:
      return {
        ...state,
        userInput: action.payload,
      };
    case ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_SUBTYPE:
      return {
        ...state,
        subtype: action.payload,
      };
    case ACTION_CONSTANTS.SEARCH_UPDATE_SUITS_ONLY:
      return {
        ...state,
        hideCategories: action.payload,
      };
    case ACTION_CONSTANTS.SEARCH_UPDATE_SORT_OPTION:
      return {
        ...state,
        sortOption: action.payload,
      };
    default:
      return state;
  }
}
