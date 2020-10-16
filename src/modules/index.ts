import { combineReducers } from 'redux';
import { userReducer } from './user';
import { dataReducer } from './data';

export const rootReducer = combineReducers({
  user: userReducer,
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
