import React from 'react'
import Navigation from '../../components/navigation'
import { connect } from 'react-redux'

const Blog = ({ routerState }) => (
  <div>
    <h1>Blog</h1>
    <pre>{JSON.stringify(routerState)}</pre>
    <Navigation />
  </div>
)

export default connect(state => ({ routerState: state.router }))(Blog)
