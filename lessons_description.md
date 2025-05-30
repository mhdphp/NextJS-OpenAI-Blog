### part-2 branch

Setup Auth0 for authentification - Section 2 / 6 lesson
https://www.udemy.com/course/next-js-ai/learn/lecture/36149088#questions
Signup to [auth0](https://auth0.auth0.com/)

.env.local - authO
AUTH0_SECRET= > generate a random 32 bits string:    openssl rand -hex 32
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=


### part-3 branch

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

### part-4 branch

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

### part-4.1 branch

working in AppLayout.js for the layout that will be use in pages/post/new
Styling with Tailwind css


### part-4.2 branch

All the functionality user name / login /logout moved from index.js to the AppLayout.js
Styling with Tailwind css


### part-4.3 branch

Create the sidebar header and rollout the AppLayout on relevant pages.
Create logo component using the:
<!-- 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
 -->
Create the component/Logo/Logo.js and component/Logo/index.js


### part-4.4 branch

Add google fonts using next/google/fonts - we remove the @next/google/fonts (it gave an error)
In _app.js we added:

<!-- 
import { DM_Sans, DM_Serif_Display } from 'next/font/google'; // Changed import

/ define the fonts to be used in the application
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

      <main className={`${dmSans.variable} ${dmSerifDisplay.variable} font-body`}>

        {getLayout(<Component {...pageProps} />, pageProps)}
        
      </main>
      
    </UserProvider>
  ) 
}

export default MyApp -->

And in tailwind.confit.js we updated theme{}

<!-- theme: {
    extend: {
      fontFamily: {
        body: 'var(--font-dm-sans)',
        heading: 'var(--font-dm-serif)',
      },
    },
  }, -->


  ### part-4.5 branch

  Install extension Tailwind CSS Intelisense

  Go in ./style/globals.css and include a bundle of tailwind classes into @layer components
<!-- 
  @layer components {
  .btn {
    @apply block bg-green-500 tracking-wider w-full mt-2 mb-2 text-center
     text-white font-bold cursor-pointer uppercase py-2 px-2 rounded-md hover:bg-green-600 transition-colors
  }
} -->

style the index.js page, and the side-bar header


### part-4.6 branch

changing in next.config.js images.domains with image.remotePatterns

<!-- images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/**',
      },
    ],
  }, -->

  ### part-5 branch Generating blog posts with OpenAI GPT API and MongoDB
  Create an api end point for testing purposes:
  pages/api/generatePost.js

  <!-- export default function handler(req, res) {
  res.status(200).json({ name: 'Generated Post', text: "A beautiful content" })
  } -->

  then check it out in
  pages\post\new.js

  <!-- export default function NewPost(props) {
    // console.log("New Post Props: ", props);

    const handleClick = async () => { 
        const response = await fetch("/api/generatePost",{
            method: "POST",
        });
        const data = await response.json();
        console.log("Response from API: ", data);
    }

    return (
        <div>
            <h1>This is the new post page</h1>
            <button onClick={handleClick} className="btn">
                Generate Post
            </button>
            <p>Test: {props.test}</p>
        </div>
    );
} -->

### part-5.1 branch Calling OpenAI API

Install the react-markdown for rendering the OpenAI response
<!-- pnpm add react-markdown -->


In api/generatedPost.js we insert:

<!-- export default async function handler(req, res) {
  
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // initialization of openai with the openai api key:
  const openai = new OpenAIApi(config);

  // prompt construction
  const topic = "cat ownership";
  const keywords = ["first-time cat owner", "cat training", "cat care tips"];
  // const prompt = `Write a blog post about ${topic} that includes the following keywords: ${keywords.join(", ")}.`;

  // get response - here using the OpenAI model:
  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `And we want to say something like, you are an SEO friendly blog post generator called Blog Standard.
        You are designed to output markdown without front matter.`
      },
      {
        role: "user",
        content: `Generate a blog post based on the following topic delimited by triple hyphens, 
        whith  a mininum of 100 words:
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens:
        ---
        ${keywords.join(", ")}
        ---`
      },
    ],
  });

  // console.log(response.data.choices[0]?.message?.content);

  res.status(200).json({postContent: response.data.choices[0]?.message?.content || "No content generated."});
} -->

in pages/post/new.js
<!-- import { useState } from "react";
import Markdown from "react-markdown"; -->

<!-- export default function NewPost(props) {
    // console.log("New Post Props: ", props);

    // define useState
    const [postContent, setPostContent] = useState("");

    const handleClick = async () => { 
        const response = await fetch("/api/generatePost",{
            method: "POST",
        });
        const data = await response.json();

        // test in console.log the response from the OpenAi
        console.log("Response from API: ", data.postContent);
        
        // initialize the postContent in useState
        setPostContent(data.postContent);
    }

    return (
        <div>
            <h1>This is the new post page</h1>
            <button onClick={handleClick} className="btn">
                Generate Post
            </button>

            // render the markdown response from postContent using the markdown-react package
            <Markdown>
                {postContent}
            </Markdown>
            
            <br />  
            <p>Test: {props.test}</p>
        </div>
    );
} -->


### part-5.2 branch Calling OpenAI API twice

1. calling the OpenAI API for blog text generation
use the API request in the format {post:{postContent}}
in the pages/post/new.js use data.post.postContent to get the data

2. calling the OpenAi API for SEO title and metaDescription generation
use:
  <!-- const seoContent = seoResponse.data.choices[0]?.message?.content || "{}";

  const {title, metaDescription} = JSON.parse(seoContent); -->