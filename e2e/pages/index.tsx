import React from 'react'
import Navigation from '../components/navigation'
import { GetServerSideProps } from 'next';

const Home = () => (
  <div>
    <h1>Home</h1>
    <Navigation />
  </div>
)

// For testing purposes, we need to pass a custom router based on a query param
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  return { props: { router: query.router || null } }
}

export default Home
