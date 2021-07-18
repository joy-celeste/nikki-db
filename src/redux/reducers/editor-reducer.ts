
import { AnyAction } from 'redux';
import { EditorActions } from '../actions/editor-actions';
import { initialEditorState, EditorState } from '../states/editor-state';

export default function editorReducer(
  state = initialEditorState,
  action: AnyAction,
): EditorState {
  switch (action.type) {
    case EditorActions.EDITOR_SET_CHARACTER:
      return { ...state, character: action.payload };
    case EditorActions.EDITOR_SET_LOADED_ITEMS:
      return { ...state, loadedItems: action.payload };
    case EditorActions.EDITOR_SET_SUBTYPE_SORT:
      return { ...state, useSubtypeSort: action.payload };
    default:
      return state;
  }
}
