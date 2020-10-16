import { combineReducers } from 'redux';
import { dataReducer } from './data';

export const rootReducer = combineReducers({
  data: dataReducer
});

export type RootState = ReturnType<typeof rootReducer>;
