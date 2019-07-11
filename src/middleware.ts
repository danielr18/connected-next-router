import NextRouter from 'next/router'
import routerMethods from './routerMethods'
import { CALL_ROUTER_METHOD } from './actions'

/**
 * This middleware captures CALL_ROUTER_METHOD actions to redirect to the
 * Router singleton. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
const createRouterMiddleware = (middlewareOpts = {}) => {
  const { Router = NextRouter, methods = {} } = middlewareOpts
  const resolvedMethods= Object.values(routerMethods).reduce(
    (acc, method) => {
      acc[method] = methods[method] ? methods[method] : method
      return acc
    },
    {}
  )

  return () => next => action => {
    const { type, payload } = action
    if (type !== CALL_ROUTER_METHOD) {
      return next(action)
    }
    const { args } = payload
    const method = resolvedMethods[payload.method]
    Router[method](...args)
  }
}

export default createRouterMiddleware
