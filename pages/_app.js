import { useReducer } from 'react'
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

// wrap with UserProviver component for auth creation
function MyApp({ Component, pageProps }) {
  return <UserProvider><Component {...pageProps} /></UserProvider>
}

export default MyApp
