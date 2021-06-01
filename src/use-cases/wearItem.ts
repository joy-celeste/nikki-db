import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '../reducers/store';
import { addToHistory } from '../actions/editor-actions';
import { Character } from '../modules/character';
import { EditorState } from '../states/editor-state';
import { ItemId } from '../models/ItemId';

export const wearItem = (itemId: ItemId) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    const editorState: EditorState = getState().editor;
    const oldChar: Character = editorState.history[editorState.step];
    const newChar: Character = new Character(oldChar);
    // newChar.wear(itemId);
    dispatch(addToHistory(newChar));
  };