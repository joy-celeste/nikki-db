import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS, MENU_DATA } from './constants';
import { ItemId, SubType } from './data';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';

export interface MenuItem {
  subtype: SubType | ReadonlyArray<MenuItem>,
  displayName: string,
}

export class Menu {
  menuData: ReadonlyArray<MenuItem>;
  menuLocation: [number, number];
  menuStrings: string[];

  constructor(input?: any) {
    this.menuData = input.menuData ?? input;
    this.menuLocation = input.menuLocation ?? [null, null];
    this.menuStrings = input.menuStrings ?? this.getStrings();
  }

  getLayer(): ReadonlyArray<MenuItem> {
    if (this.menuLocation[0]) {
      const firstLayer = this.menuData;
      const firstLayerNext = firstLayer[this.menuLocation[0]] as MenuItem;
      if (!this.menuLocation[1] && this.menuLocation[1] !== 0) {
        return firstLayerNext?.subtype as ReadonlyArray<MenuItem>;
      }
      const secondLayer = firstLayerNext.subtype as ReadonlyArray<MenuItem>;
      const secondLayerNext = secondLayer[this.menuLocation[1]] as MenuItem;
      return secondLayerNext?.subtype as ReadonlyArray<MenuItem>;
    }
    return this.menuData;
  }

  public getStrings(): string[] {
    return this.getLayer()?.map((item: MenuItem) => item.displayName) ?? null;
  }

  goDown(index: number): void {
    if (typeof (this.getLayer()[index]?.subtype) === 'number') {
      return;
    }

    if (!this.menuLocation[0]) {
      this.menuLocation = [index, null];
    } else if (!this.menuLocation[1]) {
      this.menuLocation[1] = index;
    }

    this.menuStrings = this.getStrings();
  }

  goUp(): void {
    if (this.menuLocation[1]) {
      this.menuLocation[1] = null;
    } else if (this.menuLocation[0]) {
      this.menuLocation = [null, null];
    }
    this.menuStrings = this.getStrings();
  }

  public getSubtypeAt(index: number): SubType {
    const result = this.getLayer()[index].subtype;
    if (typeof (result) === 'number') {
      return result;
    }
    return null;
  }
}

export type EditorState = {
  hiddenItems: Set<ItemId>,
  backgroundImageName: string,
  menu: Menu
};

const initialState: EditorState = {
  hiddenItems: new Set(),
  backgroundImageName: DEFAULT_BACKGROUND_IMAGE_NAME,
  menu: new Menu(MENU_DATA),
};

// ACTIONS
export const changeHiddenItemList = (hiddenItemList: Set<ItemId>): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_HIDDEN_ITEM_LIST,
  payload: hiddenItemList,
});

export const updateMenu = (menu: Menu): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_UPDATE_MENU,
  payload: menu,
});

// USE-CASE
export const toggleItemVisibility = (itemId: ItemId) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const oldHiddenItems: Set<ItemId> = getState().editor.hiddenItems;
    const newHiddenItems: Set<ItemId> = new Set(oldHiddenItems);

    if (!oldHiddenItems.has(itemId)) {
      newHiddenItems.add(itemId);
    } else {
      newHiddenItems.delete(itemId);
    }
    dispatch(changeHiddenItemList(newHiddenItems));
  };

export const goUpMenu = () =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const oldMenu: Menu = getState().editor.menu;
    const newMenu: Menu = new Menu(oldMenu);
    newMenu.goUp();
    dispatch(updateMenu(newMenu));
  };

export const goDownMenu = (index: number, callback: Function) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const oldMenu: Menu = getState().editor.menu;
    const subtype = oldMenu.getSubtypeAt(index);

    if (subtype) {
      callback(subtype);
    } else {
      const newMenu: Menu = new Menu(oldMenu);
      newMenu.goDown(index);
      dispatch(updateMenu(newMenu));
    }
  };

// REDUCER
export function editorReducer(
  state = initialState,
  action: AnyAction,
): EditorState {
  switch (action.type) {
    case ACTION_CONSTANTS.EDITOR_CHANGE_HIDDEN_ITEM_LIST:
      return {
        ...state,
        hiddenItems: action.payload,
      };
    case ACTION_CONSTANTS.EDITOR_UPDATE_MENU:
      return {
        ...state,
        menu: action.payload,
      };
    default:
      return state;
  }
}
