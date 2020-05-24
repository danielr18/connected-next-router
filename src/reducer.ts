import { LOCATION_CHANGE, LocationChangeAction } from './actions'
import createInitialRouterState from './utils/createInitialRouterState'
import { RouterState, Structure } from './types'
import { Reducer, AnyAction } from 'redux'

type CreateRouterReducer = (structure: Structure) => Reducer<RouterState, LocationChangeAction | AnyAction>

const createRouterReducer: CreateRouterReducer = structure => {
  const { merge } = structure
  const initialRouterState = createInitialRouterState(structure)
  const initialState = initialRouterState()

  /**
   * This reducer will update the state with the most recent location Router
   * has transitioned to. This may not be in sync with the Router, particularly
   * if you have use getInitialProps, so reading from and relying on
   * this state is discouraged.
   */
  return function routerReducer(state = initialState, action) {
    switch (action.type) {
      case LOCATION_CHANGE: {
        return merge(state, action.payload)
      }
      default:
        return state
    }
  }
}

export default createRouterReducer
