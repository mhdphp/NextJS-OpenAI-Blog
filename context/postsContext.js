import React, { useCallback, useState } from "react";


const PostsContext = React.createContext({});


export default PostsContext;

export const PostsProvider = ({ children}) =>{

    const [posts, setPosts] = useState([]);

    // SSR - server side rendering
    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        console.log("POSTS FROM SSR: ",    postsFromSSR);
        console.log("Last Post: ", postsFromSSR[4].created);
        setPosts(postsFromSSR); // if not the posts are not displayed in the appLayout

    }, []);

    return (
            <PostsContext.Provider value={{posts, setPostsFromSSR}} >
                    {children}
            </PostsContext.Provider>
    );

}