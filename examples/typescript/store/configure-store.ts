import { createStore, applyMiddleware, combineReducers, AnyAction } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import { format } from 'url'
import { Middleware, Reducer } from 'redux'
import { MakeStore, HYDRATE, createWrapper } from 'next-redux-wrapper'
import Router from 'next/router'
import { AppContext } from 'next/app'
import { State } from '../typings'

const bindMiddleware = (middleware: [Middleware]) => {
  const { composeWithDevTools } = require('redux-devtools-extension')
  return composeWithDevTools(applyMiddleware(...middleware))
}

const combinedReducer = combineReducers({
  router: routerReducer,
})

const reducer: Reducer<State, AnyAction> = (state, action) => {
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

export const initStore: MakeStore<State> = (context) => {
  const routerMiddleware = createRouterMiddleware()
  const { asPath, pathname, query } = (context as AppContext).ctx || Router.router || {};
  let initialState
  if (asPath) {
    const url = format({ pathname, query })
    initialState = {
      router: initialRouterState(url, asPath)
    }
  }
  return createStore(reducer, initialState, bindMiddleware([routerMiddleware]))
}

export const wrapper = createWrapper(initStore)