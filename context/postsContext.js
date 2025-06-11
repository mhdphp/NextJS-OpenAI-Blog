import React, { useCallback, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children}) =>{

    const [posts, setPosts] = useState([]);

    // SSR - server side rendering
    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        // console.log("POSTS FROM SSR: ",    postsFromSSR);
        // console.log("Last Post: ", postsFromSSR[4].created);
        setPosts(postsFromSSR); // if not the posts are not displayed in the appLayout

    }, []);

    const getPosts = useCallback(
    async ({ lastPostDate }) => {
      const result = await fetch(`/api/getPosts`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ lastPostDate }),
      });
      const data = await result.json();
      const postsResult = data.posts || [];
    //   const postsResult = data.posts || [];
      console.log("POSTS RESULT: ", postsResult);

      setPosts((value) =>{
        const newPosts = [...value];
        postsResult.forEach(post => {
          const exists = newPosts.find((p) =>{
            p._id === post._id
          });
          if (!exists){
            newPosts.push(post);
          }
        });
        return newPosts
      });
    },[]);

    return (
            <PostsContext.Provider value={{posts, setPostsFromSSR, getPosts}} >
                    {children}
            </PostsContext.Provider>
    );

}