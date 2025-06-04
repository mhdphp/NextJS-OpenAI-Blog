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


### part-5.3 pass topic and keywords of the user to OpenAi

1. in pages/post/new.js
useState for topic, keywords
<!-- const [topic, setTopic] = useState("");
const [keywords, setKeywords] = useState(""); -->

replace handleClick with handleSubmmit function
add headers and body parameters
<!-- const handleSubmit = async (e) => { 
        e.preventDefault();
        const response = await fetch("/api/generatePost",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic,
                keywords
            }),
        }); -->

created form for both topic and keywords

  <!-- <form onSubmit={handleSubmit} className="form">
      <div>
          <label>
              <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              placeholder="Enter a topic for your blog post" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
          />
      </div>
      <div>
            <label>
              <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              placeholder="Enter keywords for your blog post"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
          />
      </div>

      <button type='submit' className="btn">
          Generate Post
      </button>

  </form> -->

  2. in pages/api/generatePost.js
  create by destructuring the {topic, keywords}

  <!-- const { topic, keywords } = req.body; -->

### part-5.4.1

create MongoDb at: https://cloud.mongodb.com
database name: BlogStandardTest
username: mihai32

create **pages/api/addToken.js**

import { getSession } from '@auth0/nextjs-auth0';

<!-- export default async function handler(req, res) {
  // testing the session
  // all the data about the user is in the session  
  const { user } = await getSession( req, res );
  console.log('user', user);  

  res.status(200).json({ name: 'John Doe' })
} -->

test if user is shown in the console (from the data from auth0)

update **pages/token-topup.js**

<!-- export default function TokenTopup(props) {

  const handleClick = async () => {
    await fetch('/api/addToken', {
      method: 'POST',
    });
  }

  return (
    <div>
      <h1>This is the token topup page</h1>
      <button onClick={handleClick} className="btn">
        Add 100 tokens
      </button>
    </div>
  );
} -->

### part-5.4.2

Connect to MongoDB data base.
The data base name is: "blogstandard"
Use upsert cmd -> if the object doesn't exist it will be created and inserted in the database
The user object is from auth0 authentification service

page/api/addToken.js

<!-- import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';


export default async function handler(req, res) {
  // testing the session
  // all the data about the user is in the session  
  const { user } = await getSession( req, res );
  
  // console.log('user', user);

  // connec to the mongoDB database
  const client = await clientPromise;
  const db = client.db('blogstandard');
  const userProfile = await db
  .collection('users')
  .updateOne(
    { 
      auth0Id: user.sub,
      name: user.name,
    },
   
    {
      $inc: { availableTokens: 10 },
      $setOnInsert: { auth0Id: user.sub }
    },
    
    // if the user does not exist, create it
    { upsert: true }
  );

  res.status(200).json({ name: 'John Doe' })
} -->


### part-5.5

retrieve the user logged from the database:
<!-- const userProfile = await db.collection("users").findOne({auth0Id: user.sub});-->

The user was created in the addToken.js route
The user structure in the database is:

<!-- {"_id":{"$oid":"683abb834ace3d77e4c4a399"},
"email":"mihain69@gmail.com",
"name":"mihain69",
"auth0Id":"auth0|6839ab660adc4a5e81269229",
"availableTokens":{"$numberInt":"4"}} -->

Check if the user exists
Check if the user has enough tokens (user.availableTokens)

If all the chekings are true then purse to connect to the OpenAI model and generate post based on topic and keywords
Once the post-text is generated (markdown format) send the text again to the OpenAI model to create title and metadescription
The add the post to the database with the following strucure:

{"_id":{"$oid":"683b3af2653ee5c3d9478340"},
"postDoc":"## A Brain Fitness Program for People in Their 40s [...] worth the effort.",
"title":"Brain Fitness Program for People in Their 40s",
"metaDescription":"Discover a brain fitness program designed for those in their 40s. Engage in memory activities and enhance cognitive health, even in isolation.",
"topic":"Preparea a short brain fitness program for people in their 40s. What memory activities should they do if they are isolated in a location.",
"keywords":"",
"userId":{"$oid":"683abb834ace3d77e4c4a399"},
"createdAt":{"$date":{"$numberLong":"1748712178844"}}}

 // send the response back to the client
  <!-- res.status(200).json({
    post: { 
      postDoc, 
      title, 
      metaDescription 
    } 
  }); -->


  ### part-5.6

  1. Createa a test-db.js page for testing the post using a specific postId and author-user.
  we use: getServerSideProps
  1. get the user session from auth0 (get all the user profile as logged);
  2. initiate the database operations (connect to the cluster in mongodb);
  3. fetch user profile object
  4. fetch post profile object using the user id and the post id
  5. validate the user and post existence
  6. get the post properties from database and save it as props (to be availale to the page)

### part-5.7

In api/generatedPost.js get response the postId
  <!-- res.status(200).json({
    postId: post.insertedId,
  }); -->
in pages/post/new.js:
<!-- const response = await fetch("/api/generatePost"... -->
will use {useRouter} to re-direct the data postId to the post/postId page
<!-- const router = useRouter();
const data = await response.json();
[...]
console.log("Response Data: ", data);
if (data.postId){
    router.push(`/post/${data.postId}`);
    return;
} -->


### part-5.8

part 5.7
If a new post is created in pages/post/new.js then by router.push the postId is sent to
[postId].js in the form of /post/postId.
* the postId could be accessed from contex.param.postId;
* the using getServerSideProps the database is accessed;\
* the users collection from database is accessed using the user Auth0 credentials;
* the posts collection from database is accessed using the postId parameter,
* then the properties of user and post is saved in the props
* the props are used to pass data to the html rendering component of the page

the globals.css is updated to facilitate the format of the post page

### part-5.9

Create utils/getAppProps.js
Utility functions for retrieving application properties based on user authentication.
 * This module provides the `getAppProps` function, which fetches user session data,
 * retrieves user information and posts from the MongoDB database, and returns
 * sanitized application properties for use in the blog-standard application.


 ### part-6.0

 Start with stripe payment system -- stripe.com
 Go to product catalog -- https://dashboard.stripe.com/test/dashboard
 Name the product 10 tokens
 Add price 9 USD
 Get the price code

pages/api/addToken.js
import stripeInit from "stripe";

// initialize stripe and connecT to the API KEY
<!-- const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
...
// add the product with price
  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];

   // get the protocol depending on environment "development" or "production"
  const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host; // localhost:3000 or domain.com

  // // create stripe session
  const checkoutSession = await stripe.checkout.sessions.create ({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`, // development or production environment - concatenate the protocol + host
  });

  ...

  res.status(200).json({ session: checkoutSession });
  
  -->

  pages/token-topup.js

   <!-- const handleClick = async () => {
    const result = await fetch('/api/addToken', {
      method: 'POST',
    });
    const data = await result.json();
    console.log ("RESULT: ", data);
    window.location.href = data.session.url;
  } -->

when in stripe payment - the card serial: 4242 4242 4242 4242
