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
  prefetch
} from './actions'
export { default as routerMethods } from './routerMethods'
export { default as createRouterMiddleware } from './routerMethods'

export const initialRouterState = createInitialRouterState(plainStructure)
export const routerReducer = createRouterReducer(plainStructure)
export const ConnectedRouter = createConnectedRouter(plainStructure)
