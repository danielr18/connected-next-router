import { UrlObject, format } from 'url'

export const urlObjectKeys = [
  'auth',
  'hash',
  'host',
  'hostname',
  'href',
  'path',
  'pathname',
  'port',
  'protocol',
  'query',
  'search',
  'slashes'
]

export default function formatWithValidation(url: UrlObject): string {
  if (process.env.NODE_ENV === 'development') {
    if (url !== null && typeof url === 'object') {
      Object.keys(url).forEach(key => {
        if (urlObjectKeys.indexOf(key) === -1) {
          // eslint-disable-next-line no-console
          console.warn(`Unknown key passed via urlObject into url.format: ${key}`)
        }
      })
    }
  }

  return format(url)
}
