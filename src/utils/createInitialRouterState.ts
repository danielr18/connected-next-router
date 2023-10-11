import locationFromUrl from './locationFromUrl'
import { RouterState, Structure } from '../types'

const createInitialRouterState = ({ fromJS }: Structure) => (url?: string): RouterState => {
  const initialState: RouterState = {
    location: url
      ? locationFromUrl(url)
      : {
        pathname: '',
        search: '',
        hash: '',
        href: '',
      },
  }
  return fromJS(initialState) as RouterState
}

export default createInitialRouterState
