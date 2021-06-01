import { AnyAction } from 'redux';
import { ItemId } from '../models/ItemId';
import { Character } from '../models/Character';

export const EditorActions = {
  EDITOR_ADD_TO_HISTORY: 'editor/ADD_TO_HISTORY',
  EDITOR_CHANGE_HIDDEN_ITEM_LIST: 'editor/CHANGE_HIDDEN_ITEM_LIST'
};

export const changeHiddenItemList = (hiddenItemList: Set<ItemId>): AnyAction => ({
  type: EditorActions.EDITOR_CHANGE_HIDDEN_ITEM_LIST,
  payload: hiddenItemList,
});

export const addToHistory = (character: Character): AnyAction => ({
  type: EditorActions.EDITOR_ADD_TO_HISTORY,
  payload: character
});

