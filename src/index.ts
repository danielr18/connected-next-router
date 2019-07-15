import plainStructure from './structure/plain'
import {
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
import routerMethods from './routerMethods'
import createConnectedRouter from './ConnectedRouter'
import createRouterReducer from './reducer'
import createRouterMiddleware from './middleware'
import createInitialRouterState from './utils/createInitialRouterState'

export {
  routerMethods,
  createRouterMiddleware,
  LOCATION_CHANGE,
  CALL_ROUTER_METHOD,
  routerActions,
  push,
  replace,
  go,
  goBack,
  goForward,
  prefetch
}

export const initialRouterState = createInitialRouterState(plainStructure)
export const routerReducer = createRouterReducer(plainStructure)
export const ConnectedRouter = createConnectedRouter(plainStructure)
