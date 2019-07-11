import * as actions from '../actions'
import routerMethods from '../routerMethods'
import createConnectedRouter from '../ConnectedRouter'
import createRouterReducer from '../reducer'
import createRouterMiddleware from '../middleware'
import createInitialRouterState from './createInitialRouterState'

const createAll = structure => ({
  ...actions,
  initialRouterState: createInitialRouterState(structure),
  ConnectedRouter: createConnectedRouter(structure),
  routerReducer: createRouterReducer(structure),
  routerMethods,
  createRouterMiddleware
})

export default createAll
