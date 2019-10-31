import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { ConnectedRouter } from 'connected-next-router'
import { configureStore } from '../store/configure-store'

class ExampleApp extends App {
  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store={store}>
        <ConnectedRouter>
          <Component {...pageProps} />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default withRedux(configureStore)(ExampleApp)
