import { legacy_createStore as createStore, applyMiddleware, combineReducers, AnyAction, compose, Store } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from '../../test-lib'
import { Reducer } from 'redux'
import { MakeStore, HYDRATE, createWrapper, Context } from 'next-redux-wrapper'
import { State } from '../typings'
import Router from 'next/router'
import { onLocationChanged } from '../../test-lib/actions'
import locationFromUrl from '../../test-lib/utils/locationFromUrl'

const combinedReducer = combineReducers({
  router: routerReducer,
})

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;
  
const reducer: Reducer<State, AnyAction> = (state, action) => {
    if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    if (typeof window !== 'undefined') {
      nextState.router = state.router 
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export const initStore: MakeStore<Store<State>> = (context: Context) => {
  let routerMiddleware = createRouterMiddleware();
  // Context is empty when using the useWrappedStore hook.
  // See https://github.com/kirill-konshin/next-redux-wrapper/issues/554
  const initialState: State = {
    router: initialRouterState()
  };
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware))
  );
  return store;
}

export const initCustomRouterStore: MakeStore<Store<State>> = (context: Context) => {
  const initialState: State = {
    router: initialRouterState()
  };
  let routerMiddleware: ReturnType<typeof createRouterMiddleware>;
  if (typeof window !== 'undefined') {
    Router['pushRoute'] = Router.push;
    routerMiddleware = createRouterMiddleware({
      methods: {
        push: 'pushRoute',
        replace: 'replaceRoute'
      },
    });
  } else {
    routerMiddleware = createRouterMiddleware();
  }
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware))
  );
  return store;
}

export const wrapper = createWrapper(initStore)
export const customRouterWrapper = createWrapper(initCustomRouterStore)
