import { createStore, applyMiddleware, combineReducers, AnyAction, compose } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from '../../test-lib'
import { format } from 'url'
import { Reducer } from 'redux'
import { MakeStore, HYDRATE, createWrapper } from 'next-redux-wrapper'
import { AppContext } from 'next/app'
import { State } from '../typings'
import Router from 'next/router'


const combinedReducer = combineReducers({
  router: routerReducer,
})

const composeEnhancers = typeof window !== 'undefined' ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose : compose;

const reducer: Reducer<State, AnyAction> = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    if (state?.router) nextState.router = state.router // preserve router value on client side navigation
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export const initStore: MakeStore<State> = (context) => {
  const { asPath, pathname, query } = (context as AppContext).ctx || Router.router || {};
  let routerMiddleware;
  if (query && query.router === 'custom') {
    Router['pushRoute'] = Router.push;
    routerMiddleware = createRouterMiddleware({
      methods: {
        push: 'pushRoute',
        replace: 'replaceRoute'
      },
    });
  } else {
    routerMiddleware = createRouterMiddleware()
  }
  let initialState
  if (asPath) {
    const url = format({ pathname, query })
    initialState = {
      router: initialRouterState(url, asPath)
    }
  }
  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(routerMiddleware)))
}

export const wrapper = createWrapper(initStore, { storeKey: 'reduxStore' })