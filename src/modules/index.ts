import { combineReducers } from 'redux';
import { dataReducer, DataState } from './data';
import { characterReducer, CharacterState } from './character';

export const rootReducer = combineReducers({
  data: dataReducer,
  character: characterReducer,
});

export type RootState = {
  data: DataState,
  character: CharacterState
}
