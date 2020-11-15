import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import Router from 'next/router'

const bindMiddleware = (middleware) => {
  const { composeWithDevTools } = require('redux-devtools-extension')
  return composeWithDevTools(applyMiddleware(...middleware))
}

const combinedReducer = combineReducers({
  router: routerReducer,
})

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    if (typeof window !== 'undefined' && state?.router) {
      // preserve router value on client side navigation
      nextState.router = state.router 
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export const initStore = (context) => {
  const routerMiddleware = createRouterMiddleware()
  const { asPath } = context.ctx || Router.router || {};
  let initialState
  if (asPath) {
    initialState = {
      router: initialRouterState(asPath)
    }
  }
  return createStore(reducer, initialState, bindMiddleware([routerMiddleware]))
}

export const wrapper = createWrapper(initStore)