import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS } from './constants';
import { ItemId } from './data';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';

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
export const setMinimized = (minimizedMenus: MenuState): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_MINIMIZED_MENUS,
  payload: minimizedMenus,
});

export const setActive = (activeMenus: MenuState): AnyAction => ({
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
