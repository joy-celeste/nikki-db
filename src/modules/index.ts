import { combineReducers } from 'redux';
import { dataReducer, DataState } from './data';
import { characterReducer, CharacterState } from './character';
import { searchReducer, SearchState } from './search';
import { editorReducer, EditorState } from './editor';

export const rootReducer = combineReducers({
  data: dataReducer,
  character: characterReducer,
  search: searchReducer,
  editor: editorReducer,
});

export type RootState = {
  data: DataState,
  character: CharacterState,
  search: SearchState,
  editor: EditorState,
}
