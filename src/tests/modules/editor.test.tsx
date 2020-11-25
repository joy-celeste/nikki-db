import { combineReducers, Store } from 'redux';
import { simpleDress, simpleHair } from '../test_data/data';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { EditorState, editorReducer, toggleItemVisibility } from '../../modules/editor';
import { RootState } from '../../modules';

describe('CharacterState', () => {
  let store: Store<any>;
  let mockRootReducer: any;

  beforeEach(() => {
    mockRootReducer = combineReducers({
      editor: editorReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
  });

  test('Assert initial state uses default values', async () => {
    const editorState: EditorState = store.getState().editor;
    expect(editorState.hiddenItems).toEqual(new Set<ItemId>());
  });

  test('Action: EDITOR_CHANGE_HIDDEN_ITEM_LIST / Use-case: toggleItemVisibility -- '
       + 'successfully hide and unhide items', async () => {
    await store.dispatch<any>(toggleItemVisibility(simpleHair.id));
    let state: RootState = store.getState();
    expect(state.editor.hiddenItems.has(simpleHair.id));
    expect(state).toMatchSnapshot();

    await store.dispatch<any>(toggleItemVisibility(simpleDress.id));
    expect(state.editor.hiddenItems.has(simpleDress.id));
    state = store.getState();
    expect(state).toMatchSnapshot();

    await store.dispatch<any>(toggleItemVisibility(simpleHair.id));
    expect(!state.editor.hiddenItems.has(simpleHair.id));
    state = store.getState();
    expect(state).toMatchSnapshot();
  });
});
