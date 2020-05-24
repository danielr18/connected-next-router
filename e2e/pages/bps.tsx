import React from 'react'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import Router from 'next/router'
import Navigation from '../components/navigation'
import { State } from '../typings'

const About : NextPage = () => {
  const routerState = useSelector((state: State) => state.router)

  React.useEffect(() => {
    Router.beforePopState(() => {
      Router.replace('/hello')
      return true;
    });
  }, [Router])

  return (
    <div>
      <h1>About</h1>
      <pre>{JSON.stringify(routerState)}</pre>
      <Navigation />
    </div>
  )
}

export default About
