import { Dispatch } from 'react';
import { RootState } from 'redux/reducers/store';
import { setCharacter, setLoadedItems } from 'redux/actions/editor-actions';
import { Item, ItemId } from 'models/Item';
import { Character } from 'models/Character';
import { selectItemById } from 'redux/selectors/character-selectors';

export const wearItem = (itemId: ItemId) =>
  async(dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    const state: RootState = getState();
    const oldChar: Character = state.editor.character;
    const oldLoadedItems = state.editor.loadedItems;

    const newChar: Character = new Character(oldChar);
    const item: Item = selectItemById(state, itemId);
    newChar.wear(item);

    dispatch(setLoadedItems(Array.from(new Set([...oldLoadedItems, ...Object.values(newChar.clothes)]))));
    dispatch(setCharacter(newChar));
  };

export const wearItems = (itemIds: ItemId[]) =>
  async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    if (itemIds.length === 1) {
      return dispatch(wearItem(itemIds[0]))
    }
    const state: RootState = getState();
    const newChar: Character = new Character();
    const oldLoadedItems = state.editor.loadedItems;

    itemIds.forEach((itemId: ItemId) => {
      const item: Item = selectItemById(state, itemId);
      newChar.wear(item);
    })
    dispatch(setLoadedItems(Array.from(new Set([...oldLoadedItems, ...Object.values(newChar.clothes)]))));
    dispatch(setCharacter(newChar));
  };