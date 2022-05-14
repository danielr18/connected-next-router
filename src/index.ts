import plainStructure from './structure/plain'
import createConnectedRouter from './ConnectedRouter'
import createRouterReducer from './reducer'
import createInitialRouterState from './utils/createInitialRouterState'
import _createRouterMiddleware from './middleware'

export {
  LOCATION_CHANGE,
  LocationChangeAction,
  CALL_ROUTER_METHOD,
  CallRouterMethodAction,
  CallRouterMethodPushPayload,
  CallRouterMethodReplacePayload,
  CallRouterMethodGoPayload,
  CallRouterMethodPrefetchPayload,
  routerActions,
  push,
  replace,
  go,
  goBack,
  goForward,
  prefetch,
} from './actions'
export { default as routerMethods } from './routerMethods'
export { LocationState, RouterState } from './types'

export const initialRouterState = createInitialRouterState(plainStructure)
export const routerReducer = createRouterReducer(plainStructure)
export const ConnectedRouter = createConnectedRouter(plainStructure)
export const createRouterMiddleware = _createRouterMiddleware(plainStructure)