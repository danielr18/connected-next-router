import plainStructure from './structure/plain'
import createConnectedRouter from './ConnectedRouter'
import createRouterReducer from './reducer'
import createInitialRouterState from './utils/createInitialRouterState'

export {
  LOCATION_CHANGE,
  CALL_ROUTER_METHOD,
  routerActions,
  push,
  replace,
  go,
  goBack,
  goForward,
  prefetch,
  LocationChangeAction
} from './actions'
export { default as routerMethods } from './routerMethods'
export { default as createRouterMiddleware } from './middleware'
export {
  RouterState,
  RouterAction,
} from './types'

export const initialRouterState = createInitialRouterState(plainStructure)
export const routerReducer = createRouterReducer(plainStructure)
export const ConnectedRouter = createConnectedRouter(plainStructure)
