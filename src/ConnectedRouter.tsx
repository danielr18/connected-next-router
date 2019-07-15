import React, { useContext, useEffect, useRef } from 'react'
import { ReactReduxContext, ReactReduxContextValue } from 'react-redux'
import NextRouter, { SingletonRouter } from 'next/router'
import { onLocationChanged } from './actions'
import patchRouter from './patchRouter'
import locationFromUrl from './utils/locationFromUrl'
import { Structure, RouterAction, LocationState } from './types'

type ConnectedRouterProps = {
  children?: React.ReactNode;
  reducerKey?: string;
  Router?: SingletonRouter;
  context?: React.Context<ReactReduxContextValue>;
  exportTrailingSlash?: boolean;
}

const createConnectedRouter = (structure: Structure): React.FC<ConnectedRouterProps> => {
  const { getIn } = structure

  /*
   * ConnectedRouter listens to Next Router events.
   * When history is changed, it dispatches an action
   * to update router state in redux store.
   */
  const ConnectedRouter: React.FC<ConnectedRouterProps> = props => {
    const Context = props.context || ReactReduxContext

    if (Context == null) {
      throw 'connected-react-router@^1.0.0 requires react-redux v6. ' +
        'If you are using react-redux v5, install connected-react-router@^0.0.1.'
    }

    const { store } = useContext(Context)
    const Router = props.Router || NextRouter
    const { exportTrailingSlash = false, reducerKey = 'router' } = props
    const isTimeTravelEnabled = useRef(false)
    const inTimeTravelling = useRef(false)

    function enableTimeTravel(): void {
      isTimeTravelEnabled.current = true
    }

    function disableTimeTravel(): void {
      isTimeTravelEnabled.current = false
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
        // Extract store's location
        const storeLocation = getIn(store.getState(), [reducerKey, 'location'])
        const {
          pathname: pathnameInStore,
          search: searchInStore,
          hash: hashInStore,
          href
        } = storeLocation as LocationState
        // Extract Router's location
        const historyLocation = locationFromUrl(Router.asPath)
        const { pathname: pathnameInHistory, search: searchInHistory, hash: hashInHistory } = historyLocation
        // If we do time travelling, the location in store is changed but location in Router is not changed
        const locationMismatch =
          pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInStore !== hashInHistory
        if (locationMismatch) {
          const as = `${pathnameInStore}${searchInStore}${hashInStore}`
          // Update Router's location to match store's location
          if (!inTimeTravelling.current) {
            inTimeTravelling.current = true
            Router.replace(href, as)
          }
        }
      }

      const unsubscribeStore = store.subscribe(listenStoreChanges)
      return unsubscribeStore
    }, [Router, reducerKey, store])

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
        unpatchRouter = patchRouter(Router, { exportTrailingSlash })
        Router.events.on('routeChangeStart', disableTimeTravel)
        Router.events.on('routeChangeError', enableTimeTravel)
        Router.events.on('routeChangeComplete', enableTimeTravel)
        Router.events.on('connectedRouteChangeComplete', listenRouteChanges)
      })

      return () => {
        unpatchRouter()
        Router.events.off('routeChangeStart', disableTimeTravel)
        Router.events.off('routeChangeError', enableTimeTravel)
        Router.events.off('routeChangeComplete', enableTimeTravel)
        Router.events.off('connectedRouteChangeComplete', listenRouteChanges)
      }
    }, [Router, reducerKey, store, exportTrailingSlash])

    return <>{props.children}</>
  }

  return ConnectedRouter
}

export default createConnectedRouter
