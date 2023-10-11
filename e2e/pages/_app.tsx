import App, { AppProps } from 'next/app'
import React, { useEffect, useMemo } from 'react'
import { ConnectedRouter, initialRouterState } from '../../test-lib'
import { customRouterWrapper, wrapper } from '../store/configure-store'
import { Provider } from 'react-redux';
import Router from 'next/router';
import { onLocationChanged } from '../../test-lib/actions';
import locationFromUrl from '../../test-lib/utils/locationFromUrl';

export default function ExampleApp({ Component, ...rest }: AppProps) {
  const Wrapper = Component['disableConnectedRouter'] ? React.Fragment : ConnectedRouter;
  // Hack to support different implementations for the e2e tests
  const reduxWrapper = useMemo(() => {
    return rest.pageProps?.router === 'custom' ? customRouterWrapper : wrapper;
  }, []);
  const {store, props} = reduxWrapper.useWrappedStore(rest);
  
  useEffect(() => {
    Router.ready(() => {
      store.dispatch(onLocationChanged(locationFromUrl(Router.asPath)));
    });
  }, [store]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window['reduxStore'] = store;
    return () => {
      delete window['reduxStore'];
    }
  }, [store]);

  return (
    <Provider store={store}>
      <Wrapper>
        <Component {...props.pageProps} />
      </Wrapper>
    </Provider>
  );
}
