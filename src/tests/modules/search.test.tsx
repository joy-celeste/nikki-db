import { combineReducers, Store } from 'redux';
import SearchIndex, { searchName, searchReducer, MAX_RESULTS } from '../../modules/search';
import { RootState } from '../../modules';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';

describe('SearchIndex', () => {
  let store: Store<any>;
  let mockRootReducer: any;

  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
  });

  test('Expect search index to initialize correctly with no errors', () => {
    expect(() => new SearchIndex()).not.toThrowError();
    const index = new SearchIndex();
    expect(() => index.search('love')).not.toThrowError();
  });

  test(`Action: SEARCH_UPDATE_RESULTS / Use-case: searchName -- successfully search
        up a term, get results, and put it in the state`, async () => {
    let state: RootState;

    await store.dispatch<any>(searchName('love'));
    state = store.getState();
    expect(state.search.results.length).toBe(MAX_RESULTS);

    const numResults = 13;
    await store.dispatch<any>(searchName('love', numResults));
    state = store.getState();
    expect(state.search.results.length).toBe(numResults);

    state.search.results.forEach((result: any) => {
      expect(result.name.includes('love') || result.name.includes('Love')).toBe(true);
      expect(() => result.iconId as ItemId).not.toThrowError();
      result.contents.forEach((itemId: any) =>
        expect(() => itemId as ItemId).not.toThrowError());
    });
    expect(state.search.results).toMatchSnapshot();
  });
});
