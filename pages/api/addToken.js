import { getSession } from '@auth0/nextjs-auth0';


export default async function handler(req, res) {
  // testing the session
  // all the data about the user is in the session  
  const { user } = await getSession( req, res );
  console.log('user', user);  

  res.status(200).json({ name: 'John Doe' })
}

