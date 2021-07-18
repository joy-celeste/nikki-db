import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from 'redux/reducers/store';
import { ItemId } from 'models/Item';

export const toggleItemVisibility = (itemId: ItemId) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    // const oldHiddenItems: Set<ItemId> = getState().editor.hiddenItems;
    const newHiddenItems: Set<ItemId> = new Set();

    // if (!oldHiddenItems.has(itemId)) {
    //   newHiddenItems.add(itemId);
    // } else {
    //   newHiddenItems.delete(itemId);
    // }
    // dispatch(changeHiddenItemList(newHiddenItems));
};