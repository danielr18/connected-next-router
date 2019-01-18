import * as RouterMethods from './routerMethods'

/**
 * This action type will be dispatched after Router's history
 * receives a location change.
 */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export const onLocationChanged = (location, action) => ({
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

const callRouterActionCreator = method => {
  return (...args) => ({
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
export const push = callRouterActionCreator(RouterMethods.PUSH)
export const replace = callRouterActionCreator(RouterMethods.REPLACE)
export const go = callRouterActionCreator(RouterMethods.GO)
export const prefetch = callRouterActionCreator(RouterMethods.PREFETCH)
export const goBack = () => go(-1)
export const goForward = () => go(1)

export const routerActions = { push, replace, go, goBack, goForward, prefetch }
