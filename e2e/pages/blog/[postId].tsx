import React from 'react'
import { useSelector } from 'react-redux'
import Navigation from '../../components/navigation'
import { State } from '../../typings'
import { push } from '../../../test-lib'

const Blog = () => {
  const routerState = useSelector((state: State) => state.router)
  push('/sdsd');
  return (
    <div>
      <h1>Blog</h1>
      <pre>{JSON.stringify(routerState)}</pre>
      <Navigation />
    </div>
  )
}

export default Blog

