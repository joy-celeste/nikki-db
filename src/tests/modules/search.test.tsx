import { combineReducers, Store } from 'redux';
import { ItemId } from '../../modules/data';
import { createSeedFunction, createStoreWithMiddleware } from '../helpers';
import { FilterSet, } from '../../modules/filters';
import SearchIndex, { DEFAULT_BOOST_FACTOR, searchReducer, generateSimpleSearchString, updateFilterSet, updateSearchString, searchInventory, updateSortOption, updateMaxResults, setAdvancedSearch } from '../../modules/search';
import { RootState } from '../../modules';
import { sortOptions } from '../../modules/constants';

const mockMath = Object.create(global.Math);
mockMath.random = createSeedFunction(10);
global.Math = mockMath;

const RELEVANCE_SORT = sortOptions[0];
const ID_SORT = sortOptions[1];

describe('search module', () => {
  let store: Store<any>;
  let state: RootState;
  let mockRootReducer: any;
  
  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
    store.dispatch<any>(updateFilterSet(new FilterSet()));
  });

  test(`Correct sets use advanced search field`, async () => {
    state = store.getState();
    expect(state.search.useAdvancedSearch).toBe(false);
  
    await store.dispatch<any>(setAdvancedSearch(true));
    state = store.getState();
    expect(state.search.useAdvancedSearch).toBe(true);
  });

  test(`Creates correct SEARCH TERM: case - no key words`, async () => {
    const generatedSearchTerm = generateSimpleSearchString('');
    expect(generatedSearchTerm).toContain(`isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - one key word`, async () => {
    const generatedSearchTerm = generateSimpleSearchString('love');
    expect(generatedSearchTerm).toEqual(`+name:*_love_* isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - multiple key words`, async () => {
    const generatedSearchTerm = generateSimpleSearchString('knit vest');
    expect(generatedSearchTerm).toEqual(`+name:*_knit_vest_* isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`By default, return all items if there is no maxResults`, async () => {
    const index: SearchIndex = store.getState().search.index;
    const generatedSearchTerm: string = generateSimpleSearchString('love');
    const results: string[] = index.searchWithTerm(generatedSearchTerm);
    expect(results.length).toEqual(201);
    expect(results).toMatchSnapshot();
  });

  test(`By default, if there are no filters, use simple search with name`, async () => {
    await store.dispatch<any>(updateSearchString('Legend of Light'));
    await store.dispatch<any>(updateMaxResults(10));
    await store.dispatch<any>(searchInventory());
    state = store.getState();

    expect(state.search.results.length).toEqual(3); // posed suit, unposed suit, and dress
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`Action: SEARCH_UPDATE_RESULTS / Use-case: searchName -- successfully search
  up a term, get results, and put it in the state - DEFAULT SORT (RELEVANCE)`, async () => {
    await store.dispatch<any>(updateSortOption(RELEVANCE_SORT.value));
    await store.dispatch<any>(updateSearchString('my only love'));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results.length).toBe(1);

    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(updateMaxResults(13));

    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results.length).toBe(13);

    state.search.results.forEach((result: any) => {
    expect(result.displayName.includes('love') || result.displayName.includes('Love')).toBe(true);
    expect(() => result.iconId as ItemId).not.toThrowError();
    result.contents.forEach((itemId: any) =>
      expect(() => itemId as ItemId).not.toThrowError());
    });
    expect(state.search.results).toMatchSnapshot();
  });

  test(`Action: SEARCH_UPDATE_RESULTS / Use-case: searchName -- successfully search
  up a term, get results, and put it in the state - SORT BY ID`, async () => {
    await store.dispatch<any>(updateSortOption(ID_SORT.value));
    await store.dispatch<any>(updateSearchString('my only love'));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results.length).toBe(1);

    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(updateMaxResults(13));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results.length).toBe(13);

    const IDs = state.search.results.map((result: any) => result.key);
    expect(IDs.sort()).toBe(IDs);
  });
});
