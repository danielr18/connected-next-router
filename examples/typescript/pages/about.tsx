import React from 'react'
import Navigation from '../components/navigation'
import { connect } from 'react-redux'
import { State } from '../typings'
import { RouterState } from 'connected-next-router/types'

type AboutProps = {
  routerState: RouterState;
}

const About = ({ routerState }: AboutProps) => (
  <div>
    <h1>About</h1>
    <pre>{JSON.stringify(routerState)}</pre>
    <Navigation />
  </div>
)

export default connect((state: State) => ({ routerState: state.router }))(About)
