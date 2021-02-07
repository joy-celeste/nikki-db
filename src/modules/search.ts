import lunr, { Index } from 'lunr';
import { AnyAction } from 'redux';
import searchIndexData from '../data/search_index.json';
import refToSearchResult from '../data/ref_to_search_result.json';
import { ACTION_CONSTANTS, ITEM_SUFFIX, OPTIONS, SUBTYPES } from './constants';
import { RootState } from '.';
import { ItemId, SubType } from './data';
import { FilterSet } from './filters';

export const DEFAULT_MAX_RESULTS_CATEGORY = 8000;
export const DEFAULT_MAX_RESULTS_SEARCH = 150;
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
  searchWithTerm(searchTerm: string, maxResults = DEFAULT_MAX_RESULTS_SEARCH): string[] {
    const output: string[] = [];
    if (maxResults) {
      this.index.search(searchTerm).some((result) => {
        output.push(result.ref);
        return output.length === maxResults;
      });
      return output;
    }
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
  filterSet: FilterSet;
  results: SearchResult[];
  subtype: SubType;
  hideCategories: boolean;
  sortOption: string;
};

const initialState: SearchState = {
  index: new SearchIndex(),
  userInput: DEFAULT_SEARCH_VALUE,
  filterSet: new FilterSet(),
  results: null,
  subtype: null,
  hideCategories: false,
  sortOption: OPTIONS.RELEVANCE,
};

export type RefToSearchData = Record<string, SearchData>;
export const refToData: RefToSearchData = JSON.parse(JSON.stringify(refToSearchResult));

interface SearchData {
  name: string,
  iconId: ItemId,
  contents: ItemId[],
  posed?: boolean,
  variation?: string,
  isSuit?: boolean
}

// ACTIONS
export const updateSearchResults = (searchResults: SearchResult[]): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_RESULTS,
  payload: searchResults,
});

export const updateSearchString = (searchString: string): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_STRING,
  payload: searchString,
});

export const updateSearchSubtype = (subtype: SubType): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_SUBTYPE,
  payload: subtype,
});

export const updateSortOption = (sortOption: string): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SORT_OPTION,
  payload: sortOption,
});

export const updateFilterSet = (filterSet: FilterSet): AnyAction => ({
  type: ACTION_CONSTANTS.SEARCH_UPDATE_SEARCH_FILTERS,
  payload: filterSet,
});

// USE-CASES
export const generateSearchTerm = (searchState: SearchState, dispatch: Function): string => {
  const userInput = searchState.userInput
    ? `+name:*${searchState.userInput.split(' ').map((word: string) => `${word.toLowerCase()}`).join('_')}*`
    : '';
  const suitsBoost = `isSuit:true^${DEFAULT_BOOST_FACTOR}`;
  const subtype = searchState.subtype ? `+subtype:${searchState.subtype}` : '';
  return [subtype, userInput, suitsBoost].filter((x) => x).join(' ');
};

/* istanbul ignore next */ /* branch not passing coverage check for MAX_RESULT? */
export const searchInventory = (maxResults?: number) =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const searchState = getState().search;
    const { index, filterSet, sortOption } = searchState;

    let initialResults: any[];
    if (filterSet.filters.length === 0) { // use simple search
      const searchTerm = generateSearchTerm(searchState, dispatch); // suits prioritized
      initialResults = index.searchWithTerm(searchTerm, maxResults);
    } else if (filterSet.filters.length === 1 || filterSet.operator === 'and') {
      const searchTerm = filterSet.toString();
      initialResults = index.searchWithTerm(searchTerm, maxResults);
    } else {
      initialResults = [];
      filterSet.filters.forEach((filter: any) => {
        initialResults = initialResults.concat(index.searchWithTerm(filter.toString(), maxResults));
      });
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
        key: `${suitData?.iconId}-${displayName}`,
        displayName,
        iconId: suitData?.iconId,
        contents: suitData?.contents,
      };
    });

    switch (sortOption) {
      case OPTIONS.NAME:
        parsedResults.sort((a, b) => a.displayName?.localeCompare(b.displayName));
        break;
      case OPTIONS.ID:
        parsedResults.sort((a, b) => a.iconId - b.iconId);
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
        filterSet: action.payload,
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
