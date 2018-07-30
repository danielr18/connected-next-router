import { parse, format } from 'url'

const locationFromUrl = (_url) => {
  const url = typeof _url === 'object' ? format(_url) : _url
  const { hash, search, pathname } = parse(url)
  return {
    pathname,
    search: search ? search : '',
    hash: hash ? hash : '',
  }
}

export default locationFromUrl
