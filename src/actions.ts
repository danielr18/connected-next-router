import { UrlObject } from 'url'
import { PUSH, REPLACE, GO, PREFETCH } from './routerMethods'
import { LocationState, RouterState, RouterAction } from './types'

type Url = UrlObject | string

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

export type CallRouterMethodPushPayload = {
  type: typeof CALL_ROUTER_METHOD;
  payload: {
    method: typeof PUSH;
    args: [Url, Url?, any?];
  };
}

export type CallRouterMethodReplacePayload = {
  type: typeof CALL_ROUTER_METHOD;
  payload: {
    method: typeof REPLACE;
    args: [Url, Url?, any?];
  };
}

export type CallRouterMethodGoPayload = {
  type: typeof CALL_ROUTER_METHOD;
  payload: {
    method: typeof GO;
    args: [number];
  };
}

export type CallRouterMethodPrefetchPayload = {
  type: typeof CALL_ROUTER_METHOD;
  payload: {
    method: typeof PREFETCH;
    args: [string];
  };
}

export type CallRouterMethodAction =
  | CallRouterMethodPushPayload
  | CallRouterMethodReplacePayload
  | CallRouterMethodGoPayload
  | CallRouterMethodPrefetchPayload

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = (url: Url, as?: Url, options?: any): CallRouterMethodPushPayload => ({
  type: CALL_ROUTER_METHOD,
  payload: {
    method: PUSH,
    args: [url, as, options]
  }
})

export const replace = (url: Url, as?: Url, options?: any): CallRouterMethodReplacePayload => ({
  type: CALL_ROUTER_METHOD,
  payload: {
    method: REPLACE,
    args: [url, as, options]
  }
})

export const go = (number: number): CallRouterMethodGoPayload => ({
  type: CALL_ROUTER_METHOD,
  payload: {
    method: GO,
    args: [number]
  }
})

export const prefetch = (url: string): CallRouterMethodPrefetchPayload => ({
  type: CALL_ROUTER_METHOD,
  payload: {
    method: PREFETCH,
    args: [url]
  }
})

export const goBack = (): CallRouterMethodGoPayload => go(-1)
export const goForward = (): CallRouterMethodGoPayload => go(1)

export const routerActions = { push, replace, go, goBack, goForward, prefetch }
