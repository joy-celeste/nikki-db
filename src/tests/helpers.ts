import { applyMiddleware, createStore, Reducer, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from '../modules';

export function createStoreWithMiddleware(reducer?: Reducer): Store {
  return createStore(
    reducer || rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
  );
}

export {};
