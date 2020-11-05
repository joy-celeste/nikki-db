import SearchIndex, { searchName, searchReducer } from '../../modules/search';
import { combineReducers, Store } from 'redux';
import { posedDress, posedCoat, simpleDress, simpleHair, posedTop, posedBottom, posedShoes } from '../test_data/data';
import { RootState } from '../../modules';
import { AmputationParts, ItemData, ItemId, SubType, DataState } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { Character, CharacterState, characterReducer, wearItem, BodyParts } from '../../modules/character';
import { BODY, DEFAULT_AMPUTATIONS, DEFAULT_BODY, DEFAULT_CLOTHES, SUBTYPES } from '../../modules/constants';
import { Index } from 'lunr';

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
    const numResults = 13;
    await store.dispatch<any>(searchName('love', numResults));
    const state: RootState = store.getState();
    expect(state.search.results.length).toBe(numResults);

    state.search.results.forEach(result => {
      expect(result.name.includes('love') || result.name.includes('Love')).toBe(true);
      expect(() => result.iconId as ItemId).not.toThrowError();
      result.contents.forEach(itemId => 
        expect(() => itemId as ItemId).not.toThrowError()
      )}
    );
    expect(state).toMatchSnapshot();
  });
});
