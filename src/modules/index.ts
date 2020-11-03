import { combineReducers } from 'redux';
import { dataReducer, DataState } from './data';
import { characterReducer, CharacterState } from './character';
import { searchReducer, SearchState } from './search';

export const rootReducer = combineReducers({
  data: dataReducer,
  character: characterReducer,
  search: searchReducer,
});

export type RootState = {
  data: DataState,
  character: CharacterState,
  search: SearchState,
}
