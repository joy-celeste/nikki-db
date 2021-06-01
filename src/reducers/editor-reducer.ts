
import { AnyAction } from 'redux';
import { EditorActions } from '../actions/editor-actions';
import { initialEditorState, EditorState } from '../states/editor-state';

export default function editorReducer(
  state = initialEditorState,
  action: AnyAction,
): EditorState {
  switch (action.type) {
    case EditorActions.EDITOR_CHANGE_HIDDEN_ITEM_LIST:
      return { ...state, hiddenItems: action.payload };
    case EditorActions.EDITOR_ADD_TO_HISTORY:
      return {
        ...state,
        history: [...state.history, action.payload.character],
        step: action.payload.step,
      };
    default:
      return state;
  }
}
