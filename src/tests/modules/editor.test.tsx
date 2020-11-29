import { combineReducers, Store } from 'redux';
import { simpleDress, simpleHair } from '../test_data/data';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { EditorState, editorReducer, toggleItemVisibility, Menu, MenuItem } from '../../modules/editor';
import { RootState } from '../../modules';
import menuDataJSON from '../test_data/menu_data.json';

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
