import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"; 
import clientPromise from "../../lib/mongodb";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";



export default function Post(props) {
  
  // console.log("Post Props: ", props);

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p2 bg-stone-200 rounded-sm">
          SEO Title and Meta Description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md"> 
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
         <div className="text-sm font-bold mt-6 p2 bg-stone-200 rounded-sm">
            Keywords
        </div>
        {/* <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(',').map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div> */}
        {/* the case where keywords is undefined or null */}
        <div className="flex flex-wrap pt-2 gap-1">
          {(props.keywords?.split(',') ?? []).map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p2 bg-stone-200 rounded-sm">
          Blog Post
        </div>
        <Markdown>
          {props.postContent}
        </Markdown>
      </div>
  </div>
  )
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
      // get props from the utility function
      const props = await getAppProps(context);
    
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
          postId: post._id.toString(),
          ...props, // Spread the props from getAppProps
          // Include commonly needed user data
          user: {
            nickname: userSession.user.nickname,
            picture: userSession.user.picture,
            availableTokens: userProfile.availableTokens || 0,
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