import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '../reducers/store';
import { changeHiddenItemList } from '../actions/editor-actions';
import { ItemId } from '../models/ItemId';

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