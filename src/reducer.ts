import { LOCATION_CHANGE } from './actions'
import createInitialRouterState from './utils/createInitialRouterState'

const createRouterReducer = structure => {
  const { merge } = structure
  const initialRouterState = createInitialRouterState(structure)
  const initialState = initialRouterState()

  /**
   * This reducer will update the state with the most recent location Router
   * has transitioned to. This may not be in sync with the Router, particularly
   * if you have use getInitialProps, so reading from and relying on
   * this state is discouraged.
   */
  const routerReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
      case LOCATION_CHANGE: {
        return merge(state, payload)
      }
      default:
        return state
    }
  }

  return routerReducer
}

export default createRouterReducer
