/* Code from github.com/erikras/redux-form by Erik Rasmussen */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIn = (state: Record<string, any>, path: string[]): unknown => {
  let result = state
  for (let i = 0; i < path.length && !!result; ++i) {
    result = result[path[i]]
  }

  return result
}

export default getIn
