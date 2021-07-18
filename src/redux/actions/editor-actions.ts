import { AnyAction } from 'redux';
import { Character } from 'models/Character';
import { Item } from 'models/Item';

export const EditorActions = {
  EDITOR_SET_CHARACTER: 'editor/SET_CHARACTER',
  EDITOR_SET_LOADED_ITEMS: 'editor/SET_LOADED_ITEMS',
  EDITOR_SET_SUBTYPE_SORT: 'editor/SET_SUBTYPE_SORT'
};

export const setCharacter = (character: Character): AnyAction => ({
  type: EditorActions.EDITOR_SET_CHARACTER,
  payload: character
});

export const setLoadedItems = (loadedItems: Item[]): AnyAction => ({
  type: EditorActions.EDITOR_SET_LOADED_ITEMS,
  payload: loadedItems
});

export const setSubtypeSort = (useSubtypeSort: boolean): AnyAction => ({
  type: EditorActions.EDITOR_SET_SUBTYPE_SORT,
  payload: useSubtypeSort
});
