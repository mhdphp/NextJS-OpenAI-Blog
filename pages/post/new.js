
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
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