import React from 'react';
import { Store } from 'redux';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import { RouterState } from '../../types';

declare module "next-redux-wrapper" {
  interface NextJSContext extends NextPageContext {
      store: Store;
      isServer: boolean;
  }
  interface NextJSAppContext extends AppContext {
      ctx: NextJSContext;
  }
}

export interface State {
  router: RouterState
}