
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
    // console.log("New Post Props: ", props);

    const [postContent, setPostContent] = useState("");
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");

    const handleSubmit = async (e) => { 
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
        });
        const data = await response.json();
        // console.log("Response from API: ", data.post.postContent);
        // set tha data to data.post.postContent as come from
        // api/generatePost.js
        setPostContent(data.post.postContent);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="form">
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

            </form>

            <Markdown>
                {postContent}
            </Markdown>
            <br />  
            <p>Test: {props.test}</p>
        </div>
    );
}

NewPost.getLayout = function getLayout(page, pageProps){
    // use the AppLayout for this page
    return(
        // {page} is the page component, which is passed to the AppLayout
        <AppLayout {...pageProps}>{page}</AppLayout>
    );
}


// using withPageAuthRequired make this page / route available only if the user is logged in
// pageProps will be passed to the page component
export const getServerSideProps = withPageAuthRequired (() => {
    return {
        props: {
            test: "this is a test",
        },
    }
});