import { parse } from 'url'
import { LocationState } from '../types'

const locationFromUrl = (url: string, as: string = url): LocationState => {
  const { hash, search, pathname } = parse(as)
  return {
    href: url || '',
    pathname: pathname || '',
    search: search || '',
    hash: hash || ''
  }
}

export default locationFromUrl
