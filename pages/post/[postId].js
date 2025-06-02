import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"; 
import clientPromise from "../../lib/mongodb";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { ObjectId } from "mongodb";
import { redirect } from "next/dist/server/api-utils";

export default function Post(props) {
  
  console.log("Post Props: ", props);

  return <div>
    <h1>This is the post page</h1>
  </div>;
}


Post.getLayout = function getLayout(page, pageProps){
    // use the AppLayout for this page
    return(
        // {page} is the page component, which is passed to the AppLayout
        <AppLayout {...pageProps}>{page}</AppLayout>
    );
}



export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    try {
      // 1. Get user session
      const userSession = await getSession(context.req, context.res);
      if (!userSession?.user?.sub) {
        return { redirect: { destination: '/', permanent: false } };
      }

      // 2. Database operations
      const client = await clientPromise;
      const db = client.db("blogstandard");
      
      // 3. Fetch user profile
      const userProfile = await db.collection("users").findOne({auth0Id: userSession.user.sub});

      //4. Fetch post using postId from context params
      const post = await db.collection("posts").findOne({
        _id: new ObjectId(context.params.postId),
        userId: userProfile._id
      });

      // 3. Validate post existence and ownership
      if (!post || !userProfile || post.userId.toString() !== userProfile._id.toString()) {
        return { 
          redirect: { 
            destination: "/", 
            permanent: false 
          } 
        };
      }

      // 4. Return sanitized data
      return {
        props: {
          postContent: post.postDoc || '',
          title: post.title || 'Untitled Post',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords || [],
          // Include commonly needed user data
          user: {
            nickname: userSession.user.nickname,
            picture: userSession.user.picture
          }
        }
      };

    } catch (error) {
      console.error("Error in getServerSideProps:", error);
      return {
        redirect: {
          destination: "/error",
          permanent: false
        }
      };
    }
  }
});