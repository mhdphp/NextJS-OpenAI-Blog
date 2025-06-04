import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"; 
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/dist/server/api-utils";


export default function TestDB(props) {
  
  // console.log("Post Props: ", props);

  return (
  <div>
    <h1>This is the title of the article {props.title} </h1>
    <p>{props.metaDescription}</p>
    <p>Keywords: {props.keywords}</p>
    <p>{props.user.nickname}</p>

  </div>);
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const userSession = await getSession(context.req, context.res);
    
    const client = await clientPromise;
    const db = client.db("blogstandard");
    
    // get the user profile from the database using the auth0Id of the user logged in
    const userProfile = await db.collection("users").findOne({
      auth0Id: userSession.user.sub
    });
    
    // here is the postId from mongoDB to be used as a test
    const postId = "683c95090fb3e79ac0d3de68";
    // get the post from the database using the postId and userId
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(postId),
      userId: userProfile._id
    });

    // redirect to home if post is not found
    if (!post) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        }
      }
    }
    
    // define the props to be passed to the page
    return {
      props: {
        postContent: post.postDoc,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
      }
    }
  }
});

TestDB.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}