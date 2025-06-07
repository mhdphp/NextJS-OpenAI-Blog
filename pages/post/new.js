
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import {useRouter} from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";    

// import Markdown from "react-markdown";

export default function NewPost(props) {
    // console.log("New Post Props: ", props);
    const router = useRouter();
    // const [postContent, setPostContent] = useState("");
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [generating, setGenerating] = useState(false);

    
    const handleSubmit = async (e) => { 
    e.preventDefault();

    setGenerating(true);

    try {
        const response = await fetch("/api/generatePost",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic,
                keywords
            }),
        });
        const data = await response.json();
        // console.log("Response Data: ", data);
        
        // if the data contains a postId, redirect to the post page
        if (data.postId){
            router.push(`/post/${data.postId}`);
            return;
        }
        
        if (data.error) {
            // Handle error case
            alert(data.error);
            return;
        }
        
        // if (data.post) {
        //     setPostContent(data.post.postDoc);
        // }
    } catch (error) {
        setGenerating(false);
        console.error("Error generating post:", error);
        alert("An error occurred while generating the post.");
    }
}


        // console.log("Post Content: ", postContent);

    return (
        <div className="h-full overflow-hidden">
            {/* generating is true */}
            {!!generating && (
            <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center" >
                <FontAwesomeIcon icon={faBrain} className="text-8xl" />
                <h6>
                    Generating...
                </h6>
            </div>
            )}
            {/* generating is false */}
            { !generating && (
            <div className="w-full h-full flex flex-col overflow-auto">
                <form 
                    onSubmit={handleSubmit} 
                    className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
                    <div>
                        <label>
                            <strong>Generate a blog post on the topic of:</strong>
                        </label>
                        <textarea
                            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                            placeholder="Enter a topic for your blog post" 
                            value={topic}
                            maxLength={80}
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
                            maxLength={80}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                        <small className="block mb-2">
                            Separate keywords with a comma
                        </small>
                    </div>

                    <button type='submit' className="btn" disabled={!topic.trim() || !keywords.trim()}>
                        Generate
                    </button>

                </form>
            </div>
            )}
        </div>
    );
}

// NewPost.getLayout is a function that will be used to wrap the page component with the AppLayout
// This allows us to use the AppLayout for this page, which is a common layout for the application
// It will pass the pageProps to the AppLayout, which can be used to render the layout with the necessary data
NewPost.getLayout = function getLayout(page, pageProps){
    // use the AppLayout for this page
    return(
        // {page} is the page component, which is passed to the AppLayout
        // pageProps are the props that will be passed to the AppLayout
        <AppLayout {...pageProps}>{page}</AppLayout>
    );
}


// // using withPageAuthRequired make this page / route available only if the user is logged in
// // pageProps will be passed to the page component
// export const getServerSideProps = withPageAuthRequired (() => {
//     return {
//         props: {
//             test: "this is a test",
//         },
//     }
// });

export const getServerSideProps = withPageAuthRequired ({
  // This function will run on the server side before rendering the page
  // It will fetch the necessary data and pass it as props
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props
    }
  }
});