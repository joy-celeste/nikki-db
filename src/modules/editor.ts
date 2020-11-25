import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS } from './constants';
import { ItemId } from './data';

export type EditorState = {
  hiddenItems: Set<ItemId>
};

const initialState: EditorState = {
  hiddenItems: new Set(),
};

// ACTIONS
export const changeHiddenItemList = (hiddenItemList: Set<ItemId>): AnyAction => ({
  type: ACTION_CONSTANTS.EDITOR_CHANGE_HIDDEN_ITEM_LIST,
  payload: hiddenItemList,
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
    default:
      return state;
  }
}
