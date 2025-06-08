import React, { useCallback, useState } from "react";


const PostsContext = React.createContext({});


export default PostsContext;

export const PostProvider = ({ children}) =>{

    const [posts, setPosts] = useState([]);

    // SSR - server side rendering
    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        // console.log("POSTS FROM SSR: ",    postsFromSSR);
        setPosts(postsFromSSR);

    }, []);

    return (
            <PostsContext.Provider value={{posts, setPostsFromSSR}} >
                    {children}
            </PostsContext.Provider>
    );

}