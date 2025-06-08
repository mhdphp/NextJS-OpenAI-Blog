/**
 * Utility functions for retrieving application properties based on user authentication.
 * 
 * This module provides the `getAppProps` function, which fetches user session data,
 * retrieves user information and posts from the MongoDB database, and returns
 * sanitized application properties for use in the blog-standard application.
 * 
 * @module utils/getAppProps
 */
import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../lib/mongodb";



export const getAppProps = async (context) => {
    // 1. Get user session
    const userSession = await getSession(context.req, context.res);

    // 2. Check if user is authenticated
    const client = await clientPromise;

    // 3. Connect to the database
    const db = client.db("blogstandard");

    // 4. If user is not authenticated, return default values
    const user = await db.collection("users").findOne({auth0Id: userSession?.user?.sub});

    if (!user) {
        return {
            availableTokens: 0,
            posts: [],
        };
    }

    // 5. Fetch user posts
    const posts = await db.collection("posts")
    .find({ userId: user._id })
    .limit(5) // limited to 5 posts
    .sort({ createdAt: -1 }) // Sort by creation date, most recent first
    .toArray();

    // 6. Return sanitized data
    return {
        availableTokens: user.availableTokens,
        posts: posts.map(({createdAt, _id, userId, ...rest}) =>({
        _id: _id.toString(),
        created: createdAt ? createdAt.toString() : new Date().toString(), // Fallback to current date if undefined,
        ...rest
        })),
        // postId:context.params.postId || null, // Include postId if available?
    }

}   