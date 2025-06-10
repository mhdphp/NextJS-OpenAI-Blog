import { useReducer } from 'react';
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { DM_Sans, DM_Serif_Display } from 'next/font/google'; // Changed import
import css from 'styled-jsx/css';
// in order to not get the big fontawesome icon at the time of rendering the page
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { PostsProvider } from '../context/postsContext';
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;



// define the fonts to be used in the application
const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

// define the serif font to be used in the application
const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
});


// wrap with UserProviver component for auth creation
function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>
      {/* Since the PostProvider children are the main tag, all the appLayout has access to the PostsContext */}
      <PostsProvider>
        <main className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}>

          {getLayout(<Component {...pageProps} />, pageProps)}
          
        </main>
      </PostsProvider>
       
    </UserProvider>
  ) 
}

export default MyApp
