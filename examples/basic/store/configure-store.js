import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'

const bindMiddleware = middleware => {
  const { composeWithDevTools } = require('redux-devtools-extension')
  return composeWithDevTools(applyMiddleware(...middleware))
}

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
