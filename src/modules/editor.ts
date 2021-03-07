import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS } from './constants';
import { ItemId } from './data';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
export const INVENTORY = 'inventory';
export const CLOSET = 'closet';

export interface MenuState {
  closet: boolean,
  inventory: boolean,
}

export type EditorState = {
  hiddenItems: Set<ItemId>,
  backgroundImageName: string,
  downloadName: string;
  downloaded: Set<ItemId>;
  minimizedMenus: MenuState;
  activeMenus: MenuState;
};

const initialState: EditorState = {
  hiddenItems: new Set(),
  backgroundImageName: DEFAULT_BACKGROUND_IMAGE_NAME,
  downloadName: 'nikki',
  downloaded: new Set<ItemId>(),
  minimizedMenus: { closet: false, inventory: false },
  activeMenus: { closet: false, inventory: true },
};

// ACTIONS
export const setMinimizedMenus = (minimizedMenus: MenuState): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_MINIMIZED_MENUS,
  payload: minimizedMenus,
});

export const setActiveMenus = (activeMenus: MenuState): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_ACTIVE_MENUS,
  payload: activeMenus,
});

export const changeHiddenItemList = (hiddenItemList: Set<ItemId>): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_HIDDEN_ITEM_LIST,
  payload: hiddenItemList,
});

export const setDownloadName = (downloadName: string): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_SET_DOWNLOAD_NAME,
  payload: downloadName,
});

export const setDownloadedItems = (downloaded: Set<ItemId>): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_SET_ALREADY_DOWNLOADED_ITEM,
  payload: downloaded,
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

export const focusMenu = (menuName: string) =>
  async(dispatch: Dispatch<AnyAction>, _getState: () => RootState): Promise<void> => {
    if (menuName === INVENTORY) {
      dispatch(setActiveMenus({closet: false, inventory: true})); // set all other values false
    } else {
      dispatch(setActiveMenus({closet: true, inventory: false}));
    }
  };

export const minimizeMenu = (menuName: string) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const oldMinimizedMenus: MenuState = getState().editor.minimizedMenus;
    if (menuName === INVENTORY) {
      dispatch(setMinimizedMenus({...oldMinimizedMenus, inventory: true}));
      dispatch(setActiveMenus({closet: true, inventory: false}));
    } else {
      dispatch(setMinimizedMenus({...oldMinimizedMenus, closet: true}));
      dispatch(setActiveMenus({closet: false, inventory: true}));
    }
  };

export const maximizeMenu = (menuName: string) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const oldMinimizedMenus: MenuState = getState().editor.minimizedMenus;
    if (menuName === INVENTORY) {
      dispatch(setMinimizedMenus({...oldMinimizedMenus, inventory: false}));
      dispatch(setActiveMenus({closet: false, inventory: true}));
    } else {
      dispatch(setMinimizedMenus({...oldMinimizedMenus, closet: false}));
      dispatch(setActiveMenus({closet: true, inventory: false}));
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
    case ACTION_CONSTANTS.EDITOR_SET_DOWNLOAD_NAME:
      return {
        ...state,
        downloadName: action.payload,
      };
    case ACTION_CONSTANTS.EDITOR_SET_ALREADY_DOWNLOADED_ITEM:
      return {
        ...state,
        downloaded: action.payload,
      };
    case ACTION_CONSTANTS.EDITOR_CHANGE_MINIMIZED_MENUS:
      return {
        ...state,
        minimizedMenus: action.payload,
      };
    case ACTION_CONSTANTS.EDITOR_CHANGE_ACTIVE_MENUS:
      return {
        ...state,
        activeMenus: action.payload,
      };
    default:
      return state;
  }
}
