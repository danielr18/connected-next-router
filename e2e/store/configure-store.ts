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

let hydrated = false;
const reducer: Reducer<State, AnyAction> = (state, action) => {
  if (!hydrated) {
    hydrated = typeof window !== 'undefined';
    return {
      ...state,
      ...action.payload
    };
  } else {
    return combinedReducer(state, action)
  }
}

export const initStore: MakeStore<State> = (context) => {
  const { asPath, query } = (context as AppContext).ctx || Router.router || {};
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
    initialState = {
      router: initialRouterState(asPath),
    }
  }
  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(routerMiddleware)))
}

export const wrapper = createWrapper(initStore, { storeKey: 'reduxStore' })