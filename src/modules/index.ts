import { combineReducers } from 'redux';
import { dataReducer } from './data';
import { characterReducer } from './character';

export const rootReducer = combineReducers({
  data: dataReducer,
  character: characterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
