import React from 'react'
import { useSelector } from 'react-redux'
import Navigation from '../components/navigation'
import { State } from '../typings'
import { NextPage } from 'next'
import Router from 'next/router'

const Redirect : NextPage = () => {
  const routerState = useSelector((state: State) => state.router)
  return (
    <div>
      <h1>Redirect</h1>
      <pre>{JSON.stringify(routerState)}</pre>
      <Navigation />
    </div>
  )
}

Redirect.getInitialProps = async function({ query }) {
  if (typeof window !== 'undefined') {
    Router.push('/about')
    if (query.testTimeTravel) {
      Router.push('/about')
    }
  }
  return {}
}

export default Redirect
