import { parse, format } from 'url'

export type LocationState = {
  pathname?: string;
  hash?: string;
  search?: string;
}

const locationFromUrl = (url: string): LocationState => {
  const { hash, search, pathname } = parse(url);
  return {
    pathname,
    search: search || '',
    hash: hash || '',
  }
}

export default locationFromUrl
