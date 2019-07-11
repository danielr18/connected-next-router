import createAll from './utils/createAll'
import plainStructure from './structure/plain'

export const {
  LOCATION_CHANGE,
  CALL_ROUTER_METHOD,
  push,
  replace,
  go,
  goBack,
  goForward,
  prefetch,
  routerActions,
  ConnectedRouter,
  routerReducer,
  createRouterMiddleware,
  initialRouterState,
  routerMethods
} = createAll(plainStructure)
