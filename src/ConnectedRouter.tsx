import React from 'react'
import PropTypes from 'prop-types'
import { connect, ReactReduxContext } from 'react-redux'
import NextRouter from 'next/router'
import { onLocationChanged } from './actions'
import { patchRouter, unpatchRouter } from './patchRouter'
import locationFromUrl from './utils/locationFromUrl'

const createConnectedRouter = structure => {
  const { getIn } = structure

  /*
    * ConnectedRouter listens to Next Router events.
    * When history is changed, it dispatches an action
    * to update router state in redux store.
    */
  class ConnectedRouter extends React.Component {
    static propTypes = {
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      shallowTimeTravel: PropTypes.bool,
      reducerKey: PropTypes.string,
      Router: PropTypes.shape(),
      onLocationChanged: PropTypes.func.isRequired,
      store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        subscribe: PropTypes.func.isRequired
      }).isRequired
    }

    static defaultProps = {
      shallowTimeTravel: true,
      reducerKey: 'router',
      Router: NextRouter
    }

    constructor(props) {
      super(props)
      this.inTimeTravelling = false
    }

    componentDidMount() {
      const { shallowTimeTravel, Router, store } = this.props
      Router.ready(() => {
        patchRouter(Router, { shallowTimeTravel })
        this.unsubscribe = store.subscribe(this.listenStoreChanges)
        Router.router.events.on('routeChangeStart', this.disableTimeTravel)
        Router.router.events.on('routeChangeError', this.enableTimeTravel)
        Router.router.events.on('routeChangeComplete', this.enableTimeTravel)
        Router.router.events.on('routeChangeCompleteWithAction', this.listenRouteChanges)
      })
    }

    componentWillUnmount() {
      const { Router } = this.props
      if (this.unsubscribe) {
        unpatchRouter(Router)
        this.unsubscribe()
        Router.router.events.off('routeChangeStart', this.disableTimeTravel)
        Router.router.events.off('routeChangeError', this.enableTimeTravel)
        Router.router.events.off('routeChangeComplete', this.enableTimeTravel)
        Router.router.events.off('routeChangeCompleteWithAction', this.listenRouteChanges)
      }
    }

    enableTimeTravel = () => {
      this._isTimeTravelEnabled = true
    }

    disableTimeTravel = () => {
      this._isTimeTravelEnabled = false
    }

    listenStoreChanges = () => {
      /**
       * Next.js asynchronously loads routes, and Redux actions can be
       * dispatched during this process before Router's history change.
       * To prevent time travel changes during it, time travel detection
       * is disabled when Router change starts, and later enabled on change
       * completion or error.
       */
      if (!this._isTimeTravelEnabled) {
        return
      }

      const { Router, shallowTimeTravel, reducerKey, store } = this.props
      // Extract store's location
      const storeLocation = getIn(store.getState(), [reducerKey, 'location'])
      const { pathname: pathnameInStore, search: searchInStore, hash: hashInStore } = storeLocation

      // Extract Router's location
      const historyLocation = locationFromUrl(Router.asPath)
      const { pathname: pathnameInHistory, search: searchInHistory, hash: hashInHistory } = historyLocation

      // If we do time travelling, the location in store is changed but location in Router is not changed
      const locationMismatch =
        pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInStore !== hashInHistory
      if (locationMismatch) {
        const url = `${pathnameInStore}${searchInStore}${hashInStore}`
        // Update Router's location to match store's location
        if (shallowTimeTravel) {
          Router._timeTravelChange(url)
        } else if (!this.inTimeTravelling) {
          this.inTimeTravelling = true
          Router._timeTravelChange(url)
        }
      }
    }

    listenRouteChanges = (url, action) => {
      // Dispatch onLocationChanged except when we're in time travelling
      if (!this.inTimeTravelling) {
        this.props.onLocationChanged(locationFromUrl(url), action)
      } else {
        this.inTimeTravelling = false
      }
    }

    render() {
      return this.props.children
    }
  }

  const ConnectedRouterWithContext = props => {
    const Context = props.context || ReactReduxContext

    if (Context == null) {
      throw 'connected-react-router@^1.0.0 requires react-redux v6. ' +
        'If you are using react-redux v5, install connected-react-router@^0.0.1.'
    }

    return <Context.Consumer>{({ store }) => <ConnectedRouter store={store} {...props} />}</Context.Consumer>
  }

  ConnectedRouterWithContext.propTypes = {
    context: PropTypes.object
  }

  return connect(
    null,
    { onLocationChanged }
  )(ConnectedRouterWithContext)
}

export default createConnectedRouter
