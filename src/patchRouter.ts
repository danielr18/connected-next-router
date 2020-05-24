/* global __NEXT_DATA__ */

import rewriteUrlForNextExport from './utils/rewriteUrlForNextExport'
import { UrlObject } from 'url'
import { RouterAction, BeforePopStateCallback } from './types'
import formatWithValidation from './utils/formatWithValidation'
import { SingletonRouter } from 'next/router'

type Url = UrlObject | string
type HistoryMethod = 'replaceState' | 'pushState'

const patchRouter = (Router: SingletonRouter): (() => void) => {
  if (!Router.router) {
    return () => {}
  }

  function change(method: HistoryMethod, _url: Url, _as: Url, options: any, action: RouterAction): Promise<boolean> {
    const url = typeof _url === 'object' ? formatWithValidation(_url) : _url
    let as = typeof _as === 'object' ? formatWithValidation(_as) : _as
    if (!Router.router) {
      return Promise.resolve(false)
    }
    return Router.router.change(method, _url, _as, options).then((changeResult: boolean) => {
      if (changeResult) {
        if (process.env.__NEXT_EXPORT_TRAILING_SLASH) {
          // @ts-ignore this is temporarily global (attached to window)
          if (__NEXT_DATA__.nextExport) {
            as = rewriteUrlForNextExport(as)
          }
        }
        if (Router.router) {
          Router.router.events.emit('connectedRouteChangeComplete', url, as, action)
        }
      }

      return changeResult
    })
  }

  const unpatchedMethods = {
    replace: Router.router.replace,
    push: Router.router.push,
    bpsCallback: Router.router._bps,
    beforePopState: Router.beforePopState
  }

  Router.router.replace = function(url: Url, as: Url = url, options: any = {}) {
    return change('replaceState', url, as, options, 'REPLACE')
  }

  Router.router.push = function(url: Url, as: Url = url, options: any = {}) {
    return change('pushState', url, as, options, 'PUSH')
  }

  Router.beforePopState(function(state): boolean {
    const { url, as, options } = state
    change('replaceState', url, as, options, 'POP')
    if (unpatchedMethods.bpsCallback) {
      unpatchedMethods.bpsCallback(state)
    }
    return false
  })

  Router.beforePopState = function(cb: BeforePopStateCallback) {
    unpatchedMethods.bpsCallback = cb
  }

  return () => {
    if (Router.router) {
      Router.router.replace = unpatchedMethods.replace
      Router.router.push = unpatchedMethods.push
      Router.beforePopState = unpatchedMethods.beforePopState
      if (unpatchedMethods.bpsCallback) {
        Router.beforePopState(unpatchedMethods.bpsCallback)
      }
    }
  }
}

export default patchRouter
