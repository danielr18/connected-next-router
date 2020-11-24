import React, { useEffect, useRef } from 'react'
import { useStore } from 'react-redux'
import NextRouter, { SingletonRouter } from 'next/router'
import { onLocationChanged } from './actions'
import locationFromUrl from './utils/locationFromUrl'
import { Structure, LocationState } from './types'
import patchRouter from './patchRouter'

type ConnectedRouterProps = {
  children?: React.ReactNode;
  reducerKey?: string;
  Router?: SingletonRouter;
}

const createConnectedRouter = (structure: Structure): React.FC<ConnectedRouterProps> => {
  const { getIn } = structure

  /*
   * ConnectedRouter listens to Next Router events.
   * When history is changed, it dispatches an action
   * to update router state in redux store.
   */
  const ConnectedRouter: React.FC<ConnectedRouterProps> = props => {
    const Router = props.Router || NextRouter
    const { reducerKey = 'router' } = props
    const store = useStore()
    const ongoingRouteChanges = useRef(0)
    const isTimeTravelEnabled = useRef(true)
    const inTimeTravelling = useRef(false)

    function trackRouteComplete(): void {
      isTimeTravelEnabled.current = --ongoingRouteChanges.current <= 0
    }

    function trackRouteStart(): void {
      isTimeTravelEnabled.current = ++ongoingRouteChanges.current <= 0
    }

    useEffect(() => {
      function listenStoreChanges(): void {
        /**
         * Next.js asynchronously loads routes, and Redux actions can be
         * dispatched during this process before Router's history change.
         * To prevent time travel changes during it, time travel detection
         * is disabled when Router change starts, and later enabled on change
         * completion or error.
         */
        if (!isTimeTravelEnabled.current) {
          return
        }

        const storeLocation = getIn(store.getState(), [reducerKey, 'location']) as LocationState
        const {
          pathname: pathnameInStore,
          search: searchInStore,
          hash: hashInStore,
          href
        } = storeLocation
        // Extract Router's location
        const historyLocation = locationFromUrl(Router.asPath)
        const { pathname: pathnameInHistory, search: searchInHistory, hash: hashInHistory } = historyLocation
        // If we do time travelling, the location in store is changed but location in Router is not changed
        const locationMismatch =
          pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInStore !== hashInHistory

        if (locationMismatch) {
          const as = `${pathnameInStore}${searchInStore}${hashInStore}`
          // Update Router's location to match store's location
          inTimeTravelling.current = true
          Router.replace(href, as)
        }
      }
      
      const unsubscribeStore = store.subscribe(listenStoreChanges)
      return unsubscribeStore
    }, [Router, store, reducerKey])

    useEffect(() => {
      let unpatchRouter = (): void => {}
      function onRouteChangeFinish(url: string): void {
        // Dispatch onLocationChanged except when we're time travelling
        if (!inTimeTravelling.current) {
          const storeLocation = getIn(store.getState(), [reducerKey, 'location']) as LocationState
          if (url !== storeLocation.href) {
            store.dispatch(onLocationChanged(locationFromUrl(url)))
          }
        } else {
          inTimeTravelling.current = false
        }
        trackRouteComplete()
      }

      Router.ready(() => {
        // Router.ready ensures that Router.router is defined
        // @ts-ignore
        unpatchRouter = patchRouter(Router, store)
        Router.events.on('routeChangeStart', trackRouteStart)
        Router.events.on('routeChangeError', trackRouteComplete)
        Router.events.on('routeChangeComplete', onRouteChangeFinish)
        Router.events.on('hashChangeStart', trackRouteStart)
        Router.events.on('hashChangeComplete', onRouteChangeFinish)
      })

      return () => {
        unpatchRouter()
        Router.events.off('routeChangeStart', trackRouteStart)
        Router.events.off('routeChangeError', trackRouteComplete)
        Router.events.off('routeChangeComplete', onRouteChangeFinish)
        Router.events.off('hashChangeStart', trackRouteStart)
        Router.events.off('hashChangeComplete', onRouteChangeFinish)
      }
    }, [Router, reducerKey, store])

    return React.createElement(React.Fragment, {}, props.children)
  }

  return ConnectedRouter
}

export default createConnectedRouter
