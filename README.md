[![Coverage Status](https://coveralls.io/repos/github/danielr18/connected-next-router/badge.svg?branch=test-github-action)](https://coveralls.io/github/danielr18/connected-next-router?branch=test-github-action)

> v4.0.0 requires Next.js 10 or newer, React Redux 7.1.0 or newer, and React 16.8.0 or newer. If you are using Next.js 9, check out [v3 branch](https://github.com/danielr18/connected-next-router/tree/v3). If you are using Next.js 7-8, check out [v0 branch](https://github.com/danielr18/connected-next-router/tree/v0).

# Connected Next Router

A Redux binding for Next.js Router compatible with Next.js.

## Main features

:sparkles: Keep Router state in sync with your Redux store.

:tada: Dispatch Router methods (`push`, `replace`, `go`, `goBack`, `goForward`, `prefetch`) using Redux actions.

:clock9: Support time traveling in Redux DevTools.

:gem: Ease migration to [next.js](https://github.com/zeit/next.js) framework from codebases using [connected-react-router](https://github.com/supasate/connected-react-router) or [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux) (see [migration guide](/MIGRATION.md)).

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save connected-next-router

Or [yarn](https://yarnpkg.com/):

    $ yarn add connected-next-router

## Usage

### Step 1

- Add `routerReducer` to your root reducer.
- Use `createRouterMiddleware` if you want to dispatch Router actions (ex. to change URL with `push('/home')`).
- Use `initialRouterState(url)` to populate router state in the server side.


```js
// store/configure-store.js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import Router from 'next/router'

const rootReducer = combineReducers({
  // Add other reducers
  router: routerReducer
});

const routerMiddleware = createRouterMiddleware();

// Using next-redux-wrapper's initStore
const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    if (typeof window !== 'undefined' && state?.router) {
      // preserve router value on client side navigation
      nextState.router = state.router
    }
    return nextState
  } else {
    return rootReducer(state, action)
  }
}

export const initStore = (context) => {
  const routerMiddleware = createRouterMiddleware()
  const { asPath } = context.ctx || Router.router || {}
  let initialState
  if (asPath) {
    initialState = {
      router: initialRouterState(asPath)
    }
  }
  return createStore(reducer, initialState, applyMiddleware(routerMiddleware))
}

export const wrapper = createWrapper(initStore)
```

### Step 2

- Place `ConnectedRouter` as children of `react-redux`'s `Provider`.

```js
// pages/_app.js
import App from 'next/app'
import { ConnectedRouter } from 'connected-next-router'
import { wrapper } from '../store/configure-store'

class ExampleApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ConnectedRouter>
        <Component {...pageProps} />
      </ConnectedRouter>
    )
  }
}

// wrapper.withRedux wraps the App with react-redux's Provider
export default wrapper.withRedux(ExampleApp)
```

## Examples

- [examples/basic](/examples/basic) - basic reference implementation
- [examples/typescript](/examples/typescript) - typescript reference implementation
- [without next-redux-wrapper](https://github.com/danielr18/connected-next-router/issues/49)

## Acknowledgements

[Acknowledge](/ACKNOWLEDGE.md)

## License

[MIT License](/LICENSE)
