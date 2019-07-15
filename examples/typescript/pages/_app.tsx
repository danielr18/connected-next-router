import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { ConnectedRouter } from 'connected-next-router'
import { configureStore } from '../store/configure-store'
import { Store } from 'redux'

type AppProps = {
  store: Store;
}

declare var process : {
  env: {
    __NEXT_EXPORT_TRAILING_SLASH: boolean
  }
}

class ExampleApp extends App<AppProps> {
  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <ConnectedRouter exportTrailingSlash={process.env.__NEXT_EXPORT_TRAILING_SLASH}>
            <Component {...pageProps} />
          </ConnectedRouter>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(configureStore)(ExampleApp)
