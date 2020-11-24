import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { push, replace, goBack, goForward, prefetch } from '../../test-lib'
import { useDispatch } from 'react-redux'
import locationFromUrl from '../../test-lib/utils/locationFromUrl'

const Navigation = () => {
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
                Push /about with Redux action
              </a>
            </li>
            <li>
              <a
                href="/#foo"
                onClick={e => {
                  e.preventDefault()
                  dispatch(push('/', '/#foo'))
                }}
              >
                Push /#foo with Redux action
              </a>
            </li>
            <li>
              <a
                href="/blog/2"
                onClick={e => {
                  e.preventDefault()
                  dispatch(replace('/blog/[postId]', '/blog/2'))
                }}
              >
                Replace /blog/2 with Redux action
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={e => {
                  e.preventDefault()
                  dispatch(replace('/'))
                }}
              >
                Replace / with Redux action
              </a>
            </li>
            <li>
              <a
                href="/hello"
                onClick={e => {
                  e.preventDefault()
                  dispatch(push('/hello'))
                }}
              >
                Push /hello with Redux action
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
                Go Back with Redux action
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
                Go Forward with Redux action
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
      <h2>Test</h2>
      <ul>
        <li>
          <a
            href="hello"
            onClick={e => {
              e.preventDefault()
              dispatch(prefetch('/hello'))
            }}
          >
            Prefetch /hello
          </a>
        </li>
        <li>
          <a
            href="/?router=custom"
            onClick={e => {
              e.preventDefault()
              dispatch(push('/?router=custom'))
            }}
          >
            Push /?router=custom
          </a>
        </li>
        <li>
          <a
            href=""
            onClick={e => {
              e.preventDefault()
              dispatch(push(locationFromUrl('')))
            }}
          >
            Push empty url
          </a>
        </li>
        <li>
          <a
            href="/bps"
            onClick={e => {
              e.preventDefault()
              dispatch(push('/bps'))
            }}
          >
            Push /bps
          </a>
        </li>
        <li>
          <a
            href="/delay"
            onClick={e => {
              e.preventDefault()
              dispatch(push('/delay'))
            }}
          >
            Push /delay
          </a>
        </li>
        <li>
          <a
            href="/ssg"
            onClick={e => {
              e.preventDefault()
              dispatch(push('/ssg'))
            }}
          >
            Push /ssg
          </a>
        </li>
        <li>
          <a
            href="/sync"
            onClick={e => {
              e.preventDefault()
              dispatch(push('/sync'))
            }}
          >
            Push /sync
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navigation
