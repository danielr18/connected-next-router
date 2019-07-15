import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import { format } from 'url';
import { Middleware } from 'redux';
import { MakeStore } from 'next-redux-wrapper';

const bindMiddleware = (middleware: [Middleware]) => {
  const { composeWithDevTools } = require('redux-devtools-extension')
  return composeWithDevTools(applyMiddleware(...middleware))
}

const rootReducer = combineReducers({
  router: routerReducer
})

export const configureStore: MakeStore = (initialState = {}, { asPath, pathname, query }) => {
  const routerMiddleware = createRouterMiddleware()

  if (asPath) {
    const url = format({ pathname, query });
    initialState.router = initialRouterState(url, asPath)
  }

  const store = createStore(rootReducer, initialState, bindMiddleware([routerMiddleware]))
  return store
}
