import React, { useEffect, useRef } from 'react'
import { useStore } from 'react-redux'
import NextRouter, { SingletonRouter } from 'next/router'
import { onLocationChanged } from './actions'
import patchRouter from './patchRouter'
import locationFromUrl from './utils/locationFromUrl'
import { Structure, RouterAction, LocationState } from './types'

type ConnectedRouterProps = {
  children?: React.ReactNode;
  reducerKey?: string;
  clientSideAutosync?: boolean,
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
    const { reducerKey = 'router', clientSideAutosync = false } = props
    const store = useStore()
    const ongoingRouteChanges = useRef(0)
    const isTimeTravelEnabled = useRef(false)
    const inTimeTravelling = useRef(false)

    function trackRouteComplete(): void {
      isTimeTravelEnabled.current = --ongoingRouteChanges.current <= 0
    }

    function trackRouteStart(): void {
      isTimeTravelEnabled.current = ++ongoingRouteChanges.current <= 0
    }

    useEffect(() => {
      if (!clientSideAutosync) {
        return
      }

      if (typeof window === 'undefined') {
        return
      }

      Router.ready(() => {
        // Router.ready ensures that Router.router is defined
        const { router }= Router
        if (!router) {
          return
        }
        const pathname = router.pathname || ''
        const { location } = window
        const asPath = `${location.pathname}${location.search}`

        store.dispatch(onLocationChanged(locationFromUrl(pathname, asPath), 'REPLACE'))
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
      
      function listenRouteChanges(url: string, as: string, action: RouterAction): void {
        // Dispatch onLocationChanged except when we're time travelling
        if (!inTimeTravelling.current) {
          store.dispatch(onLocationChanged(locationFromUrl(url, as), action))
        } else {
          inTimeTravelling.current = false
        }
      }

      Router.ready(() => {
        // Router.ready ensures that Router.router is defined
        // @ts-ignore
        unpatchRouter = patchRouter(Router)
        Router.events.on('routeChangeStart', trackRouteStart)
        Router.events.on('routeChangeError', trackRouteComplete)
        Router.events.on('routeChangeComplete', trackRouteComplete)
        Router.events.on('connectedRouteChangeComplete', listenRouteChanges)
      })

      return () => {
        unpatchRouter()
        Router.events.off('routeChangeStart', trackRouteStart)
        Router.events.off('routeChangeError', trackRouteComplete)
        Router.events.off('routeChangeComplete', trackRouteComplete)
        Router.events.off('connectedRouteChangeComplete', listenRouteChanges)
      }
    }, [Router, reducerKey, store])

    return React.createElement(React.Fragment, {}, props.children)
  }

  return ConnectedRouter
}

export default createConnectedRouter
