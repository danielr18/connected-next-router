import React from 'react'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import Navigation from '../components/navigation'
import { State } from '../typings'

const SSG : NextPage = () => {
  const routerState = useSelector((state: State) => state.router)
  return (
    <div>
      <h1>SSG</h1>
      <pre>{JSON.stringify(routerState)}</pre>
      <Navigation />
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {}
  }
}

export default SSG
