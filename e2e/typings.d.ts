import React from 'react';
import { Store } from 'redux';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import { RouterState } from '../test-lib/types';
export interface State {
  router: RouterState
}