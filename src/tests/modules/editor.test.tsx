import { combineReducers, Store } from 'redux';
import { simpleDress, simpleHair } from '../test_data/data';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { EditorState, editorReducer, toggleItemVisibility, setDownloadName, setDownloadedItems, setMinimizedMenus, setActiveMenus, CLOSET, focusMenu, INVENTORY, minimizeMenu, maximizeMenu } from '../../modules/editor';
import { RootState } from '../../modules';

describe('EditorState', () => {
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
    
    await store.dispatch<any>(setMinimizedMenus({ closet: true, inventory: false }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);

    await store.dispatch<any>(setMinimizedMenus({ closet: false, inventory: true }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);

    await store.dispatch<any>(setMinimizedMenus({ closet: true, inventory: true }));
    state = store.getState();
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);
  });

  test('Action: EDITOR_CHANGE_ACTIVE_MENUS', async () => {
    let state: RootState = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(true);
    
    await store.dispatch<any>(setActiveMenus({ closet: true, inventory: false }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(false);

    await store.dispatch<any>(setActiveMenus({ closet: false, inventory: false }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(false);

    await store.dispatch<any>(setActiveMenus({ closet: true, inventory: true }));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(true);
  });

  test('Action: EDITOR_CHANGE_ACTIVE_MENUS / Use-case: focusMenu - ' +
    'switches focus between menus successfully', async () => {
    let state: RootState = store.getState();
    expect(state.editor.activeMenus.inventory).toEqual(true);
    expect(state.editor.activeMenus.closet).toEqual(false);
    
    await store.dispatch<any>(focusMenu(CLOSET));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(false);

    await store.dispatch<any>(focusMenu(INVENTORY));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(true);
  });

  test('Action: EDITOR_CHANGE_MINIMIZED_MENUS / EDITOR_CHANGE_ACTIVE_MENUS / Use-case: minimizeMenu - ' +
  'switches focus between menus successfully when minimizing', async () => {
    let state: RootState = store.getState();
    expect(state.editor.activeMenus.inventory).toEqual(true);
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);

    await store.dispatch<any>(minimizeMenu(CLOSET));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(true);
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);

    await store.dispatch<any>(minimizeMenu(INVENTORY));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(false);
    expect(state.editor.minimizedMenus.closet).toEqual(true);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);
  });

  test('Action: EDITOR_CHANGE_MINIMIZED_MENUS / EDITOR_CHANGE_ACTIVE_MENUS / Use-case: maximizeMenu - ' +
  'switches focus between menus successfully when maximizing', async () => {
    let state: RootState = store.getState();
    await store.dispatch<any>(minimizeMenu(INVENTORY));
    await store.dispatch<any>(minimizeMenu(CLOSET));
    await store.dispatch<any>(maximizeMenu(CLOSET));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(true);
    expect(state.editor.activeMenus.inventory).toEqual(false);
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(true);

    await store.dispatch<any>(maximizeMenu(INVENTORY));
    state = store.getState();
    expect(state.editor.activeMenus.closet).toEqual(false);
    expect(state.editor.activeMenus.inventory).toEqual(true);
    expect(state.editor.minimizedMenus.closet).toEqual(false);
    expect(state.editor.minimizedMenus.inventory).toEqual(false);
  });
});
