import locationFromUrl from './locationFromUrl'

const createInitialRouterState = ({ fromJS }) => (url = '/') => fromJS({
  location: locationFromUrl(url),
  action: 'POP'
})

export default createInitialRouterState
