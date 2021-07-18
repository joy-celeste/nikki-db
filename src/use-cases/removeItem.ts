import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '../redux/reducers/store';
import { EditorState } from '../redux/states/editor-state';
import { Item, ItemId } from 'models/Item';
import { Character } from 'models/Character';

export const removeItemFromCloset = (itemId: ItemId) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const editorState: EditorState = getState().editor;
    // const oldChar: Character = editorState.history[editorState.step];
    const newChar: Character = new Character(null);
    // newChar.wear(itemId);
    // dispatch(addToHistory(newChar));
};