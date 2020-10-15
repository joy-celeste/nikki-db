import { combineReducers } from 'redux';
import { userReducer } from './user';
import { productsReducer } from './products';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;