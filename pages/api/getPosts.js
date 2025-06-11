import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import clientPromise from '../../lib/mongodb';


export default withApiAuthRequired(async function handler(req, res) {

try {
    // get logged in user profile
    const {user: { sub },} = await getSession(req, res);
    
    const client = await clientPromise;
    const db = client.db('blogstandard');
    const userProfile = await db.collection('users').findOne({
      auth0Id: sub,
    });

    // get lastPostDate - from api request
    const { lastPostDate } = req.body;

    // get maximum 5 posts of the user that are created after lastPostDate
    const posts = await db
      .collection('posts')
      .find({
        userId: userProfile._id,
        createdAt: { $lt: new Date(lastPostDate) },
      })
      .limit(5)
      .sort({ created: -1 })
      .toArray();

    res.status(200).json({ posts });
    return;
    
} catch (error) {}

});