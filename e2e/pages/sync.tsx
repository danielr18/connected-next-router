import React from 'react'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Navigation from '../components/navigation'

const Sync = () => {
  const router = useRouter()
  const [sync, setSync] = React.useState(true)
  const routerState = useSelector(state => (state as any).router)

  React.useEffect(() => {
    if (router.asPath !== routerState.location.href) {
      setSync(false)
    }
  }, [router, routerState])

  return (
    <div>
      <h1>Sync Status: {sync ? 'Always Synced': 'Not Always Synced'}</h1>
      <Navigation />
    </div>
  )
}

export default Sync
