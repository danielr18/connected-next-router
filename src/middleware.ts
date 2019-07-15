import NextRouter, { SingletonRouter } from 'next/router'
import { PUSH, GO, PREFETCH, REPLACE, RouterMethod } from './routerMethods'
import { CALL_ROUTER_METHOD, CallRouterMethodAction } from './actions'
import { Middleware } from 'redux'

export type RouterMethodsObject = { [key in RouterMethod]?: string }
export type RouterMiddlewareOpts = {
  Router?: SingletonRouter;
  methods?: RouterMethodsObject;
}

/**
 * This middleware captures CALL_ROUTER_METHOD actions to redirect to the
 * Router singleton. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
const createRouterMiddleware = (middlewareOpts: RouterMiddlewareOpts = {}): Middleware => {
  const { Router = NextRouter, methods = {} } = middlewareOpts
  const routerMethodsArr: RouterMethod[] = [PUSH, PREFETCH, REPLACE]
  const resolvedMethods = routerMethodsArr.reduce(
    (acc: RouterMethodsObject, method: RouterMethod) => {
      acc[method] = methods[method] ? methods[method] : method
      return acc
    },
    { [GO]: GO }
  )

  return () => next => (action: CallRouterMethodAction) => {
    const { type, payload } = action
    if (type !== CALL_ROUTER_METHOD) {
      return next(action)
    }
    const { args } = payload
    const method = resolvedMethods[payload.method]
    if (method) {
      if (method === GO && typeof window !== 'undefined' && Array.isArray(args) && typeof args[0] === 'number') {
        window.history.go(args[0])
      } else if (Router.hasOwnProperty(method)) {
        (Router as any)[method](...args)
      }
    }
  }
}

export default createRouterMiddleware
