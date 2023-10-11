import { SingletonRouter, Router } from 'next/router'
import ReactDOM from 'react-dom'
import { Store } from 'redux'
import { onLocationChanged } from './actions'
import locationFromUrl from './utils/locationFromUrl'

type RouterToPatch = SingletonRouter & { router: Router }

const patchRouter = (Router: RouterToPatch, store: Store): (() => void) => {
  const unpatchedMethods = {
    set: Reflect.get(Router.router, 'set'),
  }

  Reflect.set(Router.router, 'set', function (this: any, ...args: any[]) {
    if (!unpatchedMethods.set) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      ReactDOM.unstable_batchedUpdates(() => {
        try {
          const result = Reflect.apply(unpatchedMethods.set, Router.router, args)
          if (result instanceof Promise) result.then(resolve, reject)
          else resolve(result)
        } catch (err) {
          reject(err)
        }
        store.dispatch(onLocationChanged(locationFromUrl(Router.asPath)))
      })
    })
  })

  return () => {
    Reflect.set(Router.router, 'set', unpatchedMethods.set)
  }
}

export default patchRouter
