import React from 'react'
import Navigation from '../components/navigation'
import { connect } from 'react-redux'

const About = ({ routerState }) => (
  <div>
    <h1>About</h1>
    <pre>{JSON.stringify(routerState)}</pre>
    <Navigation />
  </div>
)

export default connect(state => ({ routerState: state.router }))(About)
