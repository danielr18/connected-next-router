import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { push, replace, goBack, goForward } from '../../../es'
import { connect } from 'react-redux'

const Navigation = props => (
  <div>
    <h2>Navigation</h2>
    <ul>
      <li>
        <h3>Navigation with Redux actions</h3>
        <ul>
          <li>
            <a
              href="about"
              onClick={e => {
                e.preventDefault()
                props.push({ pathname: '/about', query: { foo: 'bar' } })
              }}
            >
              Push /about
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                props.replace('/')
              }}
            >
              Replace /
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                props.goBack()
              }}
            >
              Go Back
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                props.goForward()
              }}
            >
              Go Forward
            </a>
          </li>
        </ul>
      </li>
      <li>
        <h3>Navigation with Link</h3>
        <ul>
          <li>
            <Link href={{ pathname: '/' }}>
              <a>Push /</a>
            </Link>
          </li>
          <li>
            <Link href="/about?foo=bar" replace>
              <a>Replace /about</a>
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <h3>Navigation with Router</h3>
        <ul>
          <li>
            <a
              href="about"
              onClick={e => {
                e.preventDefault()
                Router.push('/about?foo=bar')
              }}
            >
              Push /about
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                Router.replace({ pathname: '/'})
              }}
            >
              Replace /
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
)

export default connect(
  null,
  { push, replace, goBack, goForward }
)(Navigation)
