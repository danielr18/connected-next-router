import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from '../../../es'

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const rootReducer = combineReducers({
  router: routerReducer
})

export const configureStore = (initialState = {}, { asPath }) => {
  const routerMiddleware = createRouterMiddleware()

  if (asPath) {
    initialState.router = initialRouterState(asPath)
  }

  const store = createStore(rootReducer, initialState, bindMiddleware([routerMiddleware]))
  return store
}
