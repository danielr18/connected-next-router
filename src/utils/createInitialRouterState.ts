import locationFromUrl from './locationFromUrl'
import { RouterState, Structure } from '../types'

const createInitialRouterState = ({ fromJS }: Structure) => (url = '/', as: string = url): RouterState => {
  const initialState: RouterState = {
    location: locationFromUrl(url, as),
    action: 'POP'
  }
  return fromJS(initialState) as RouterState
}

export default createInitialRouterState
