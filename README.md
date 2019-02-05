> v1.0.0 requires React v16.4.0 and React Redux v6.0 or later. If you are using React Redux v5, check out [v0 branch](/danielr18/connected-next-router/tree/v0).

# Connected Next Router

A Redux binding for Next.js Router compatible with Next.js.

## Main features

:sparkles: Keep Router state in sync with your Redux store.

:tada: Dispatch Router methods (`push`, `replace`, `go`, `goBack`, `goForward`, `prefetch`) using Redux actions.

:clock9: Support time traveling in Redux DevTools.

:gift: Compatible with [next-routes](https://github.com/fridays/next-routes).

:gem: Ease migration to [next.js](https://github.com/zeit/next.js) framework from codebases using [connected-react-router](https://github.com/supasate/connected-react-router) or [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux).

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
...
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routerReducer, createRouterMiddleware, initialRouterState } from 'connected-next-router'
...
const rootReducer = combineReducers({
  ...reducers,
  router: routerReducer
});

const routerMiddleware = createRouterMiddleware();

// Using next-redux-wrapper's makeStore
export const makeStore = (initialState = {}, options) => {
  if (options.asPath) {
    initialState.router = initialRouterState(options.asPath);
  }

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      routerMiddleware,
      // ... other middlewares ...
    )
  );
}
```

### Step 2

- Place `ConnectedRouter` as children of `react-redux`'s `Provider`.

```js
...
// pages/_app.js
import App, { Container } from 'next/app';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-next-router'
...
class MyApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <ConnectedRouter>
            <Component { ...pageProps } />
          </ConnectedRouter>
        </Provider>
      </Container>
    );
  }
}
```

## Examples

- [examples/basic](/examples/basic) - basic reference implementation

## TODO

- Add unit tests
- Support [Immutable.js](https://facebook.github.io/immutable-js/)

## Acknowledgements

[Acknowledge](/ACKNOWLEDGE.md)

## License

[MIT License](/LICENSE)
