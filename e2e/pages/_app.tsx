import App from 'next/app'
import React from 'react'
import { ConnectedRouter } from '../../test-lib'
import { wrapper } from '../store/configure-store'

class ExampleApp extends App {
  render() {
    const { Component, pageProps } = this.props
    const Wrapper = Component['disableConnectedRouter'] ? React.Fragment : ConnectedRouter;
    return (
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    )
  }
}

export default wrapper.withRedux(ExampleApp)
