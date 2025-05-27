import { useReducer } from 'react'
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

// wrap with UserProviver component for auth creation
function MyApp({ Component, pageProps }) {

  // If the component has a getLayout function, use it to wrap the page
  // Otherwise, just render the page as is
  // This allows for different layouts for different pages
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>

      {getLayout(<Component {...pageProps} />, pageProps)}
      
    </UserProvider>
  ) 
}

export default MyApp
