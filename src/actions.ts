import { RouterMethod, PUSH, REPLACE, GO, PREFETCH } from './routerMethods'
import { LocationState, RouterState, RouterAction } from './types'

/**
 * This action type will be dispatched after Router's history
 * receives a location change.
 */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export type LocationChangeAction = {
  type: typeof LOCATION_CHANGE;
  payload: RouterState;
}

export const onLocationChanged = (location: LocationState, action: RouterAction): LocationChangeAction => ({
  type: LOCATION_CHANGE,
  payload: {
    location,
    action
  }
})

/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
export const CALL_ROUTER_METHOD = '@@router/CALL_ROUTER_METHOD'

export type CallRouterMethodAction = {
  type: typeof CALL_ROUTER_METHOD;
  payload: {
    method: RouterMethod;
    args: unknown[];
  };
}

const callRouterActionCreator = (method: RouterMethod) => {
  return (...args: unknown[]): CallRouterMethodAction => ({
    type: CALL_ROUTER_METHOD,
    payload: {
      method,
      args
    }
  })
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = callRouterActionCreator(PUSH)
export const replace = callRouterActionCreator(REPLACE)
export const go = callRouterActionCreator(GO)
export const prefetch = callRouterActionCreator(PREFETCH)
export const goBack = (): CallRouterMethodAction => go(-1)
export const goForward = (): CallRouterMethodAction => go(1)

export const routerActions = { push, replace, go, goBack, goForward, prefetch }
