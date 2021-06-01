import { combineReducers } from 'redux';
import searchReducer from './search-reducer';
import { SearchState } from '../states/search-state';

export const rootReducer = combineReducers({
  search: searchReducer
});

export type RootState = {
  search: SearchState
};