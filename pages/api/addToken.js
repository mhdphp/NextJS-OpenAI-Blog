import { getSession } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';
import stripeInit from "stripe";

// initialize stripe and connecT to the API KEY
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);


export default async function handler(req, res) {

  const { user } = await getSession( req, res );

  // add the product with price
  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];
  
  // get the protocol depending on environment "development" or "production"
  const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host; // localhost:3000 or domain.com

  // // create stripe session
  const checkoutSession = await stripe.checkout.sessions.create ({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`, // development or production environment - concatenate the protocol + host
    payment_intent_data: {
      metadata: {
        sub: user.sub,
        name: user.nickname,
        email: user.email
      }
    },
    metadata: {
      sub: user.sub,
      name: user.nickname,
      email: user.email
    }
  });

 
  const client = await clientPromise;
  const db = client.db('blogstandard');

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
    
    { upsert: true }
  );

  res.status(200).json({ session: checkoutSession });
  // res.status(200).json({ name: "John Cusak" });
}

