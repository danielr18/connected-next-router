import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { push, replace, goBack, goForward, prefetch } from 'connected-next-router'
import { useDispatch } from 'react-redux'

const Navigation = props => {
  const dispatch = useDispatch()
  return (
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
                  dispatch(push({ pathname: '/about', query: { foo: 'bar' } }))
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
                  dispatch(replace('/blog/[postId]', '/blog/2'))
                }}
              >
                Replace /blog/2
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  dispatch(goBack())
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
                  dispatch(goForward())
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
            <li>
              <Link href="/blog/[postId]" as="/blog/3">
                <a>Push /blog/3</a>
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
                  Router.replace({ pathname: '/' })
                }}
              >
                Replace /
              </a>
            </li>
            <li>
              <a
                href="/blog/1"
                onClick={e => {
                  e.preventDefault()
                  Router.push('/blog/[postId]', '/blog/1')
                }}
              >
                Push /blog/1
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <h2>Prefetching</h2>
      <ul>
        <li>
          <a
            href="about"
            onClick={e => {
              e.preventDefault()
              dispatch(prefetch('/about'))
            }}
          >
            Prefetch /about
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navigation
