import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';


export default async function handler(req, res) {
  // testing the session
  // all the data about the user is in the session  
  const { user } = await getSession( req, res );
  
  console.log('user', user);

  // connec to the mongoDB database
  const client = await clientPromise;
  const db = client.db('blogstandard');

  // find the user profile in the database using the auth0Id
  // and nickname
  // if the user does not exist, create it with the following fields:
  // auth0Id: user.sub
  // name: user.nickname
  // email: user.email
  // availableTokens: 10
  const userProfile = await db
  .collection('users')
  .updateOne(
    { 
      auth0Id: user.sub,
      name: user.nickname,
      email: user.email
    },
   
    {
      $inc: { availableTokens: 10 },
      $setOnInsert: { auth0Id: user.sub }
    },
    
    // if the user does not exist, create it
    { upsert: true }
  );

  res.status(200).json({ name: 'John Doe' })
}

