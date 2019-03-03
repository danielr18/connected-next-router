function rewriteUrlForNextExport(url) {
  const [, hash] = url.split('#')
  url = url.replace(/#.*/, '')

  let [path, qs] = url.split('?')
  path = path.replace(/\/$/, '')

  let newPath = path
  // Append a trailing slash if this path does not have an extension
  if (!/\.[^/]+\/?$/.test(path)) {
    newPath = `${path}/`
  }

  if (qs) {
    newPath = `${newPath}?${qs}`
  }

  if (hash) {
    newPath = `${newPath}#${hash}`
  }

  return newPath
}

export default rewriteUrlForNextExport
