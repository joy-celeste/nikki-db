import { combineReducers, Store } from 'redux';
import { simpleDress, simpleHair } from '../test_data/data';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { EditorState, editorReducer, toggleItemVisibility, setDownloadName, setDownloadedItems, setMinimized, setActive } from '../../modules/editor';
import { RootState } from '../../modules';

describe('EditorState', () => {
  let store: Store<any>;
  let mockRootReducer: any;
  let mockCallback: any;
  
  beforeEach(() => {
    mockRootReducer = combineReducers({
      editor: editorReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
    mockCallback = jest.fn(input => input);
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

  test('Action: EDITOR_SET_DOWNLOAD_NAME', async () => {
    await store.dispatch<any>(setDownloadName("blah"));
    let state: RootState = store.getState();
    expect(state.editor.downloadName).toEqual("blah")
  });

  test('Action: EDITOR_SET_ALREADY_DOWNLOADED_ITEM', async () => {
    const downloadedItems = new Set<ItemId>([1, 2]);
    await store.dispatch<any>(setDownloadedItems(downloadedItems));
    let state: RootState = store.getState();
    expect(state.editor.downloaded).toEqual(downloadedItems)
  });

  test('Action: EDITOR_CHANGE_MINIMIZED_MENUS', async () => {
    let state: RootState = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);
    
    await store.dispatch<any>(setMinimized({ closet: true, inventory: false }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);

    await store.dispatch<any>(setMinimized({ closet: false, inventory: true }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);

    await store.dispatch<any>(setMinimized({ closet: true, inventory: true }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);
  });

  test('Action: EDITOR_CHANGE_ACTIVE_MENUS', async () => {
    let state: RootState = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(true);
    
    await store.dispatch<any>(setActive({ closet: true, inventory: false }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(false);

    await store.dispatch<any>(setActive({ closet: false, inventory: false }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(false);

    await store.dispatch<any>(setActive({ closet: true, inventory: true }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(true);
  });
});
