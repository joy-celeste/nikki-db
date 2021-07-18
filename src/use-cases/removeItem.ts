import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '../redux/reducers/store';
import { EditorState } from '../redux/states/editor-state';
import { Item, ItemId } from 'models/Item';
import { Character } from 'models/Character';
import { setCharacter, setLoadedItems } from 'redux/actions/editor-actions';
import { useSelector } from 'react-redux';
import { selectCurrentItemIds } from 'redux/selectors/character-selectors';

export const removeItemFromCloset = (itemId: ItemId, isWorn: boolean) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const editorState: EditorState = getState().editor;

    if (isWorn) {
      const newChar: Character = new Character(editorState.character);
      const wornItem: Item = editorState.loadedItems.find((item: Item) => item.id === itemId);
      newChar.remove(wornItem);
      dispatch(setCharacter(newChar))
    }
    
    const newLoadedItems = editorState.loadedItems.filter((item: Item) => item.id !== itemId);
    dispatch(setLoadedItems(newLoadedItems));
};

export const removeUnwornItemsFromCloset = () =>
  async (dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const state: RootState = getState();
    const loadedItems: Item[] = state.editor.loadedItems;
    const currentlyWornItemIds: Set<ItemId> = new Set<ItemId>(selectCurrentItemIds(state));
    const newLoadedItems = loadedItems.filter((item: Item) => currentlyWornItemIds.has(item.id));
    dispatch(setLoadedItems(newLoadedItems));
  };