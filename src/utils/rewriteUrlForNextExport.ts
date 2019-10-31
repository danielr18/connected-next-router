function rewriteUrlForNextExport(url: string): string {
  const [pathname, hash] = url.split('#')
  let [path, qs] = pathname.split('?')
  path = path.replace(/\/$/, '')
  // Append a trailing slash if this path does not have an extension
  if (!/\.[^/]+\/?$/.test(path)) path += '/'
  if (qs) path += '?' + qs
  if (hash) path += '#' + hash
  return path
}

export default rewriteUrlForNextExport
