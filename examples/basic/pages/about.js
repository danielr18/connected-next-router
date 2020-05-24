import React from 'react'
import Navigation from '../components/navigation'
import { useSelector } from 'react-redux'

const About = () => {
  const routerState = useSelector(state => state.router)
  return (
  <div>
    <h1>About</h1>
    <pre>{JSON.stringify(routerState)}</pre>
    <Navigation />
  </div>
)}

export default About
