/* global __NEXT_DATA__ */
declare const __NEXT_DATA__: any
import { UrlObject } from 'url'
import { RouterAction, BeforePopStateCallback } from './types'
import { SingletonRouter, Router } from 'next/router'
import { addBasePath, resolveHref } from 'next/dist/next-server/lib/router/router'

type Url = UrlObject | string
type HistoryMethod = 'replaceState' | 'pushState'

type RouterToPatch = SingletonRouter & { router: Router }

const patchRouter = (Router: RouterToPatch): (() => void) => {
  function prepareUrlAs(router: Router, url: Url, as: Url): { url: string, as: string } {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    return {
      url: addBasePath(resolveHref(router.pathname, url)),
      as: as ? addBasePath(resolveHref(router.pathname, as)) : as,
    }
  }

  function change(
    method: HistoryMethod, url: string, as: string, options: any, action: RouterAction
  ): Promise<boolean> {
    return Router.router.change(method, url, as, options).then((changeResult: boolean) => {
      if (changeResult) {
        if (process.env.__NEXT_EXPORT_TRAILING_SLASH) {
          const rewriteUrlForNextExport = require('./utils/rewriteUrlForExport').rewriteUrlForNextExport
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
    ({ url, as } = prepareUrlAs(this, url, as))
    return change('replaceState', url, as, options, 'REPLACE')
  }

  Router.router.push = function(url: Url, as: Url = url, options: any = {}) {
    ({ url, as } = prepareUrlAs(this, url, as))
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
