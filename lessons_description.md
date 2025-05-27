part-2 branch

Setup Auth0 for authentification - Section 2 / 6 lesson
https://www.udemy.com/course/next-js-ai/learn/lecture/36149088#questions
Signup to [auth0](https://auth0.auth0.com/)

.env.local - authO
AUTH0_SECRET= > generate a random 32 bits string:    openssl rand -hex 32
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=


part-3 branch

in index.js
implement:
import { useUser } from "@auth0/nextjs-auth0/client";
const {user} = useUser();
<!-- <div>
      {!!user ? (
        <>
        <div>
          <Image
            src={user.picture}
            alt={user.name}
            height={50}
            width={50}
          />
          <div>
            {user.email}
          </div>
        </div>
        <Link href="/api/auth/logout">Logout</Link>
        </>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </div>
  </div> -->

  in next.config.js
  images: {
    domains: ['s.gravatar.com'],
  },


  part-3.1
  Protect routes - grant access to the pages / routes only if authentificated

  for each route / page we have implemented:
  import { withPageAuthRequired } from "@auth0/nextjs-auth0";

  export const getServerSideProps = withPageAuthRequired (() => {
    return {
        props: {},
    }
});

part-4
Create the basic AppLayout component
Prepare _app.js to accept multiple page layouts

<!-- function MyApp({ Component, pageProps }) {

  // If the component has a getLayout function, use it to wrap the page
  // Otherwise, just render the page as is
  // This allows for different layouts for different pages
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>

      {getLayout(<Component {...pageProps} />, pageProps)}
      
    </UserProvider>
  ) 
} -->

Use this layout on news.js page

<!-- import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
    console.log("New Post Props: ", props);
    return (
        <div>
            <h1>This is the new post page</h1>
        </div>
    )
}

NewPost.getLayout = function getLayout(page, pageProps){
    // use the AppLayout for this page
    return(
        <AppLayout {...pageProps}>{page}</AppLayout>
    )
}


// using withPageAuthRequired make this page / route available only if the user is logged in
// pageProps will be passed to the page component
export const getServerSideProps = withPageAuthRequired (() => {
    return {
        props: {
            test: "this is a test",
        },
    }
}); -->