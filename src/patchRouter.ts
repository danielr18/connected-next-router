/* global __NEXT_DATA__ */
declare const __NEXT_DATA__: any
import { UrlObject } from 'url'
import { RouterAction, BeforePopStateCallback } from './types'
import { SingletonRouter, Router } from 'next/router'
import { formatWithValidation } from 'next/dist/next-server/lib/utils'

type Url = UrlObject | string
type HistoryMethod = 'replaceState' | 'pushState'

type RouterToPatch = SingletonRouter & { router: Router }

const patchRouter = (Router: RouterToPatch): (() => void) => {
  function change(method: HistoryMethod, _url: Url, _as: Url, options: any, action: RouterAction): Promise<boolean> {
    const url = typeof _url === 'object' ? formatWithValidation(_url) : _url
    let as = typeof _as === 'object' ? formatWithValidation(_as) : _as
    return Router.router.change(method, _url, _as, options).then((changeResult: boolean) => {
      if (changeResult) {
        if (process.env.__NEXT_EXPORT_TRAILING_SLASH) {
          const rewriteUrlForNextExport = require('./utils/rewriteUrlForExport').rewriteUrlForNextExport
          // @ts-ignore this is temporarily global (attached to window)
          if (__NEXT_DATA__.nextExport) {
            as = rewriteUrlForNextExport(as)
          }
        }
        Router?.router?.events.emit('connectedRouteChangeComplete', url, as, action)
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
    Router.router.replace = unpatchedMethods.replace
    Router.router.push = unpatchedMethods.push
    Router.beforePopState = unpatchedMethods.beforePopState
    if (unpatchedMethods.bpsCallback) {
      Router.beforePopState(unpatchedMethods.bpsCallback)
    }
  }
}

export default patchRouter
