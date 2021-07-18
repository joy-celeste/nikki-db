import { combineReducers } from 'redux';
import { EditorState } from 'redux/states/editor-state';
import { SearchState } from 'redux/states/search-state';
import editorReducer from 'redux/reducers/editor-reducer';
import searchReducer from 'redux/reducers/search-reducer';

export const rootReducer = combineReducers({
  search: searchReducer,
  editor: editorReducer,
});

export type RootState = {
  search: SearchState,
  editor: EditorState,
};