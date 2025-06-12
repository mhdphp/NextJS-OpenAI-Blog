import React, { useCallback, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children}) =>{

    const [posts, setPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    // SSR - server side rendering
   const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        setHasMorePosts(true);
        // Merge new posts with existing ones, avoiding duplicates
        setPosts(prevPosts => {
            const newPosts = [...prevPosts];
            postsFromSSR.forEach(post => {
                const exists = newPosts.find(p => p._id === post._id);
                if (!exists) {
                    newPosts.push(post);
                }
            });
            return newPosts;
        });
    }, []);

    const getPosts = useCallback(async ({ lastPostDate }) => {
        if (!hasMorePosts) return;
        
        const result = await fetch(`/api/getPosts`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ lastPostDate }),
        });
        const data = await result.json();
        const postsResult = data.posts || [];
        
        if (postsResult.length === 0) {
            setHasMorePosts(false);
            return;
        }

        setPosts(prevPosts => {
            const newPosts = [...prevPosts];
            postsResult.forEach(post => {
                const exists = newPosts.find(p => p._id === post._id);
                if (!exists) {
                    newPosts.push(post);
                }
            });
            return newPosts;
        });
    }, [hasMorePosts]);


    return (
            <PostsContext.Provider value={{posts, setPostsFromSSR, getPosts, hasMorePosts}} >
                    {children}
            </PostsContext.Provider>
    );

}