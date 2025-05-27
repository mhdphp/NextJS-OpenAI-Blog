
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function NewPost(props) {
    console.log("New Post Props: ", props);
    return (
        <div>
            <h1>This is the new post page</h1>
        </div>
    )
}

// using withPageAuthRequired make this page / route available only if the user is logged in
export const getServerSideProps = withPageAuthRequired (() => {
    return {
        props: {
            test: "this is a test",
        },
    }
});