import { combineReducers, Store } from 'redux';
import { simpleDress, simpleHair } from '../test_data/data';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { EditorState, editorReducer, toggleItemVisibility, Menu, MenuItem, goDownMenu, goUpMenu, setDownloadName, setDownloadedItems } from '../../modules/editor';
import { RootState } from '../../modules';
import menuDataJSON from '../test_data/menu_data.json';
import { SUBTYPES } from '../../modules/constants';

describe('Menu', () => {
  let newMenu: Menu;
  const MENU_DATA: ReadonlyArray<MenuItem> = Object.freeze(menuDataJSON);

  beforeEach(() => {
    newMenu = new Menu(MENU_DATA);
  });

  test('Initializes to with correct default data', () => {
    expect(typeof(newMenu.menuData)).toEqual(typeof(MENU_DATA));
    expect(newMenu.menuData).toEqual(MENU_DATA);
    expect(newMenu).toMatchSnapshot();
  });

  test('Doesnt do anything if trying to go down on an invalid index', () => {
    newMenu.goDown(1);
    expect(newMenu.menuStrings).toEqual(['Hair', 'Dress', 'Coat', 'Top', 'Bottom', 'Hosiery', 'Shoes', 'Accessory', 'Makeup', 'Spirit']);
    expect(newMenu.menuLocation).toEqual([null, null]);
    expect(newMenu).toMatchSnapshot();
  });

  test('Goes down the menu correctly and returns the correct menuStrings - 1 layer', () => {
    newMenu.goDown(5)
    expect(newMenu.menuStrings).toEqual(['Leglet', 'Hosiery']);
    expect(newMenu.menuLocation).toEqual([5, null]);
    expect(newMenu).toMatchSnapshot();

    newMenu.goDown(0)
    expect(newMenu.menuStrings).toEqual(['Leglet', 'Hosiery']);
    expect(newMenu.menuLocation).toEqual([5, null]);
    expect(newMenu).toMatchSnapshot();
  });

  test('Goes down the menu correctly and returns the correct menuStrings - 2 layers', () => {
    newMenu.goDown(7)
    expect(newMenu.menuLocation).toEqual([7, null]);
    expect(newMenu.menuStrings).toEqual(['Headwear', 'Earrings', 'Necklace', 'Bracelet', 'Handheld', 'Waist', 'Special', 'Skin']);
    expect(newMenu).toMatchSnapshot();

    newMenu.goDown(1) // shouldn't change because it is invalid to go down index 7 from  here
    expect(newMenu.menuLocation).toEqual([7, null]);
    expect(newMenu.menuStrings).toEqual(['Headwear', 'Earrings', 'Necklace', 'Bracelet', 'Handheld', 'Waist', 'Special', 'Skin']);
    expect(newMenu).toMatchSnapshot();

    newMenu.goDown(0)
    expect(newMenu.menuLocation).toEqual([7, 0]);
    expect(newMenu.menuStrings).toEqual(['Hair_Ornament', 'Veil', 'Hairpin', 'Ear']);
    expect(newMenu).toMatchSnapshot();
  });

  test('Goes down the menu correctly and returns the correct menuStrings - 2 layers v2', () => {
    newMenu.goDown(7)
    expect(newMenu.menuLocation).toEqual([7, null]);
    expect(newMenu.menuStrings).toEqual(['Headwear', 'Earrings', 'Necklace', 'Bracelet', 'Handheld', 'Waist', 'Special', 'Skin']);
    expect(newMenu).toMatchSnapshot();

    newMenu.goDown(2)
    expect(newMenu.menuLocation).toEqual([7, 2]);
    expect(newMenu.menuStrings).toEqual(['Scarf', 'Necklace']);
    expect(newMenu).toMatchSnapshot();
  });

  test('Goes up correctly after having gone down - 1 layer', () => {
    newMenu.goDown(5)
    newMenu.goUp()
    expect(newMenu.menuStrings).toEqual(['Hair', 'Dress', 'Coat', 'Top', 'Bottom', 'Hosiery', 'Shoes', 'Accessory', 'Makeup', 'Spirit']);
    expect(newMenu.menuLocation).toEqual([null, null]);
    expect(newMenu).toMatchSnapshot();
  });

  test('Goes up correctly after having gone down - 2 layers', () => {
    newMenu.goDown(7)
    newMenu.goDown(4)

    newMenu.goUp()
    expect(newMenu.menuLocation).toEqual([7, null]);
    expect(newMenu.menuStrings).toEqual(['Headwear', 'Earrings', 'Necklace', 'Bracelet', 'Handheld', 'Waist', 'Special', 'Skin']);
    expect(newMenu).toMatchSnapshot();

    newMenu.goUp()
    expect(newMenu.menuStrings).toEqual(['Hair', 'Dress', 'Coat', 'Top', 'Bottom', 'Hosiery', 'Shoes', 'Accessory', 'Makeup', 'Spirit']);
    expect(newMenu.menuLocation).toEqual([null, null]);
    expect(newMenu).toMatchSnapshot();
  });

  test('Fetches correct subtype value', () => {
    newMenu.goDown(7)
    newMenu.goDown(4)
    expect(newMenu.getSubtypeAt(2)).toEqual(33); // Both hand holding

    newMenu.goUp()
    expect(newMenu.getSubtypeAt(1)).toEqual(11); // Earrings

    newMenu.goUp()
    expect(newMenu.getSubtypeAt(0)).toEqual(1); // Hair
    expect(newMenu.getSubtypeAt(7)).toEqual(null); // Accessory
  });
});

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

  test('Action: EDITOR_UPDATE_MENU / Use-case: goDownMenu and goUpMenu', async () => {
    let state: RootState = store.getState();
    const hairIndex = 0; // Should be Hair, cannot go down menuLocation
    expect(state.editor.menu.menuData[hairIndex].subtype).toBe(SUBTYPES.HAIR)
    await store.dispatch<any>(goDownMenu(hairIndex, mockCallback)); // 0 is Hair, cannot go down

    // Expect menu Location to be [null, null] - have not gone down
    state.editor.menu.menuLocation.forEach(value => expect(value).toBe(null)); 
    expect(mockCallback.mock.calls[0][0]).toBe(SUBTYPES.HAIR);

    const accessoryIndex = 7; // Should be able to go down twice
    await store.dispatch<any>(goDownMenu(accessoryIndex, mockCallback));
    const headwearIndex = 0; // Should be able to go down once
    await store.dispatch<any>(goDownMenu(headwearIndex, mockCallback));
    const veilIndex = 1; // Should call calllback
    await store.dispatch<any>(goDownMenu(veilIndex, mockCallback));
    expect(store.getState().editor.menu.menuLocation[0]).toBe(accessoryIndex);
    expect(store.getState().editor.menu.menuLocation[1]).toBe(headwearIndex);
    expect(mockCallback.mock.calls[1][0]).toBe(SUBTYPES.VEIL);

    // Go back up menu to make sure it works properly
    await store.dispatch<any>(goUpMenu());
    expect(store.getState().editor.menu.menuLocation[0]).toBe(accessoryIndex);
    expect(store.getState().editor.menu.menuLocation[1]).toBe(null);
    await store.dispatch<any>(goUpMenu());
    expect(store.getState().editor.menu.menuLocation[0]).toBe(null);
    expect(store.getState().editor.menu.menuLocation[1]).toBe(null);

    const hosieryIndex = 5; // Should be able to go down only once
    await store.dispatch<any>(goDownMenu(hosieryIndex, mockCallback));
    await store.dispatch<any>(goDownMenu(0, mockCallback));
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
});
