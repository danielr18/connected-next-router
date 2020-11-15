import { SingletonRouter, Router } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import ReactDOM from 'react-dom'
import { Store } from 'redux'
import { onLocationChanged } from './actions'
import locationFromUrl from './utils/locationFromUrl'

type RouterToPatch = SingletonRouter & { router: Router }

const patchRouter = (Router: RouterToPatch, store: Store): (() => void) => {
  const unpatchedMethods = {
    set: Router.router.set,
  }

  Router.router.set = function (...args) {
    if (!unpatchedMethods.set) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      ReactDOM.unstable_batchedUpdates(() => {
        unpatchedMethods.set.apply(Router.router, args).then(resolve, reject)
        store.dispatch(onLocationChanged(locationFromUrl(Router.asPath)))
      })
    })
  }

  return () => {
    Router.router.set = unpatchedMethods.set
  }
}

export default patchRouter
