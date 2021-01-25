import { combineReducers, Store } from 'redux';
import SearchIndex, { searchInventory, searchReducer, updateSearchString, generateSearchTerm, DEFAULT_BOOST_FACTOR, updateSearchFilters, updateSearchSubtype, updateSortOption } from '../../modules/search';
import { RootState } from '../../modules';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { sortOptions, generalOptions, genreOptions, specialOptions, SUBTYPES } from '../../modules/constants';

const CLOUD_GENRE_OPTION = genreOptions[7];
const CHINESE_CLASSICAL_OPTION = specialOptions[3];
const POSED_OPTION = generalOptions[0];
const IS_SUIT_OPTION = generalOptions[1];
const IS_ITEM_OPTION = generalOptions[3];
const RELEVANCE_SORT = sortOptions[0];
const ID_SORT = sortOptions[1];

describe('SearchIndex', () => {
  let store: Store<any>;
  let mockRootReducer: any;
  let state: RootState;

  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
  });

  test('Expect search index to initialize correctly with no errors', () => {
    expect(() => new SearchIndex()).not.toThrowError();
    const index = new SearchIndex();
    expect(() => index.searchWithTerm('love')).not.toThrowError();
  });

  test(`Creates correct SEARCH TERM: case - no key words, all subtypes, no filters`, async () => {
    await store.dispatch<any>(updateSearchString(''));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toContain(`isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - one key word, all subtypes, no filters`, async () => {
    await store.dispatch<any>(updateSearchString('love'));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+name:*love* isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - multiple key words, all subtypes, no filters`, async () => {
    await store.dispatch<any>(updateSearchString('knit vest'));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+name:*knit_vest* isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - no key word, with suit filter`, async () => {
    await store.dispatch<any>(updateSearchFilters([IS_SUIT_OPTION]));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+isSuit:true`);
  });

  test(`Creates correct SEARCH TERM: case - no key word, with suit filter, and posed filter`, async () => {
    await store.dispatch<any>(updateSearchFilters([IS_SUIT_OPTION, POSED_OPTION]));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+isSuit:true +posed:true`);
  });

  test(`Creates correct SEARCH TERM: case - no key word, with explicit item filter`, async () => {
    await store.dispatch<any>(updateSearchFilters([IS_ITEM_OPTION]));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+isSuit:false`);
  });

  test(`Creates correct SEARCH TERM: case - no key word, one simple filter (special tag)`, async () => {
    await store.dispatch<any>(updateSearchFilters([CHINESE_CLASSICAL_OPTION]));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+spec:${CHINESE_CLASSICAL_OPTION.value} isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

    test(`Creates correct SEARCH TERM: case - no key word, one simple filter (genre)`, async () => {
    await store.dispatch<any>(updateSearchFilters([CLOUD_GENRE_OPTION]));
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+genre:${CLOUD_GENRE_OPTION.value} isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - no key word, one subtype filter`, async () => {
    await store.dispatch<any>(updateSearchSubtype(SUBTYPES.COAT))
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm).toEqual(`+subtype:${SUBTYPES.COAT} isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });

  test(`Creates correct SEARCH TERM: case - multiple key words, all subtypes, simple and general filters, and subtypes`, async () => {
    await store.dispatch<any>(updateSearchString('knit vest'));
    await store.dispatch<any>(updateSearchFilters([CHINESE_CLASSICAL_OPTION, POSED_OPTION]));
    await store.dispatch<any>(updateSearchSubtype(SUBTYPES.COAT))
    state = store.getState();
    const generatedSearchTerm = generateSearchTerm(state.search, store.dispatch);
    expect(generatedSearchTerm)
      .toEqual(`+spec:${CHINESE_CLASSICAL_OPTION.value} +posed:true +subtype:${SUBTYPES.COAT} ` +
               `+name:*knit_vest* isSuit:true^${DEFAULT_BOOST_FACTOR}`);
  });
  
  test(`Action: SEARCH_UPDATE_RESULTS / Use-case: searchName -- successfully search
        up a term, get results, and put it in the state - DEFAULT SORT (RELEVANCE)`, async () => {
    await store.dispatch<any>(updateSortOption(RELEVANCE_SORT.value));
    await store.dispatch<any>(updateSearchString('my only love'));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results.length).toBe(1);

    const numResults = 13;
    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(searchInventory(numResults));
    state = store.getState();
    expect(state.search.results.length).toBe(numResults);

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

    const numResults = 13;
    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(searchInventory(numResults));
    state = store.getState();
    expect(state.search.results.length).toBe(numResults);

    const IDs = state.search.results.map((result: any) => result.key);
    expect(IDs.sort()).toBe(IDs);
  });
});
