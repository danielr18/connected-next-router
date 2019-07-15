import React from 'react'
import Navigation from '../../components/navigation'
import { connect } from 'react-redux'
import { State } from '../../typings';
import { RouterState } from 'connected-next-router/types'

type BlogProps = {
  routerState: RouterState;
}

const Blog = ({ routerState }: BlogProps) => (
  <div>
    <h1>Blog</h1>
    <pre>{JSON.stringify(routerState)}</pre>
    <Navigation />
  </div>
)

export default connect((state: State) => ({ routerState: state.router }))(Blog)
