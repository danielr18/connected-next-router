import locationFromUrl from './locationFromUrl'
import { RouterState, Structure } from '../types'

const createInitialRouterState = ({ fromJS }: Structure) => (url = '/'): RouterState => {
  const initialState: RouterState = {
    location: locationFromUrl(url),
  }
  return fromJS(initialState) as RouterState
}

export default createInitialRouterState
