/* global __NEXT_DATA__ */

import { _rewriteUrlForNextExport } from 'next/router'
import { parse, format } from 'url'

export const patchRouter = (Router, opts = {}) => {

  if (Router.router && !Router._patchedByConnectedRouter) {
    const { shallowTimeTravel } = opts
    Router._patchedByConnectedRouter = true

    Router.router._unpatchedChange = Router.router.change
    Router.router.change = function(method, _url, _as, options, action) {
      let as = typeof _as === 'object' ? format(_as) : _as
      return Router.router._unpatchedChange(method, _url, _as, options)
        .then(changeResult => {
          if (changeResult) {
            // TODO: Check if this is needed
            if (__NEXT_DATA__.nextExport && "function" === typeof _rewriteUrlForNextExport) {
              as = _rewriteUrlForNextExport(as)
            }
            Router.router.events.emit('routeChangeCompleteWithAction', as, action)
          }
    
          return changeResult
        })
    }

    Router._go = function(delta) {
      window.history.go(delta)
    }

    Router.router._unpatchedReplace = Router.router.replace
    Router.router.replace = function(url, as = url, options = {}) {
      return Router.router.change('replaceState', url, as, options, 'REPLACE')
    }

    Router.router._unpatchedPush = Router.router.push
    Router.router.push = function(url, as = url, options = {}) {
      return Router.router.change('pushState', url, as, options, 'PUSH')
    }

    Router.router._unpatchedBeforePopStateCallback = Router.router._beforePopState
    Router.beforePopState(function({ url, as, options }) {
      Router.router.change('replaceState', url, as, options, 'POP')
      Router.router._unpatchedBeforePopStateCallback(...arguments)
      return false
    })

    if (shallowTimeTravel) {
      Router._timeTravelChange = timeTravelChange.bind(Router.router)
    } else {
      Router._timeTravelChange = url => Router.router.replace(url)
    }
  }
}

export const unpatchRouter = (Router) => {
  if (Router._patchedByConnectedRouter) {
    Router.router.change = Router.router._unpatchedChange
    Router.router.replace = Router.router._unpatchedReplace
    Router.router.push = Router.router._unpatchedPush
    Router.router._beforePopState = Router.router._unpatchedBeforePopStateCallback
    Router._timeTravelChange = undefined
    Router._go = undefined
    Router._patchedByConnectedRouter = false
  }
}

function toRoute(path) {
  return path.replace(/\/$/, '') || '/'
}

function timeTravelChange(url, as = url) {
  if (this.onlyAHashChange(url)) {
    this.changeState('replaceState', url, as)
    this.scrollToHash(as)
    return true
  }

  const { pathname, query, hash } = parse(url, true)
  const route = toRoute(pathname)
  const routeInfo = this.components[route]
  this.changeState('replaceState', url, as)
  this.set(route, pathname, query, as, { ...routeInfo, hash: hash ? hash : '' })
  return true
}
