import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from '../modules';

export function createStoreWithMiddleware(): Store {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}

export {};