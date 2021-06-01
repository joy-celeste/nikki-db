import { combineReducers } from 'redux';
import searchReducer from './search-reducer';
import { SearchState } from '../states/search-state';
import { EditorState } from '../states/editor-state';
import editorReducer from './editor-reducer';

export const rootReducer = combineReducers({
  search: searchReducer,
  editor: editorReducer
});

export type RootState = {
  search: SearchState,
  editor: EditorState
};