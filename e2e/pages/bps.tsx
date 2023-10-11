import React from 'react'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Navigation from '../components/navigation'
import { State } from '../typings'

const About : NextPage = () => {
  const routerState = useSelector((state: State) => state.router)
  const router = useRouter()
  React.useEffect(() => {
    router.beforePopState(() => {
      router.replace('/hello')
      return false;
    });
  }, [router])

  return (
    <div>
      <h1>BPS</h1>
      <pre>{JSON.stringify(routerState)}</pre>
      <Navigation />
    </div>
  )
}

export default About
