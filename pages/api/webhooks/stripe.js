import Stripe from 'stripe';
import { buffer } from 'micro';
import { MongoClient } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mongoUri = process.env.MONGODB_URI;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook verified:', event.type);
  } catch (err) {
    console.log(`❌ Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful charges
  if (event.type === 'charge.updated') {
    const charge = event.data.object;
    
    if (charge.paid && charge.status === 'succeeded' && !charge.refunded) {
      try {
        await addTokensToUser(charge);
        console.log('✅ Tokens added successfully');
      } catch (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database operation failed' });
      }
    }
  }

  res.json({ received: true });
}

async function addTokensToUser(charge) {
  // Connect to MongoDB
  const client = await MongoClient.connect(mongoUri);
  const db = client.db('BlogStandard'); // Your database name
  
  try {
    const auth0Id = charge.metadata.sub;
    const amountPaid = charge.amount / 100; // Convert to dollars
    
    console.log(`Processing payment for Auth0 ID: ${auth0Id}`);
    console.log(`Amount paid: $${amountPaid}`);

    // Calculate tokens (10 tokens per payment, or customize as needed)
    const tokensToAdd = 10;
    
    // Update user document
    const result = await db.collection('users').updateOne(
      { auth0Id },
      {
        $inc: { availableTokens: tokensToAdd },
        $setOnInsert: { auth0Id } // Only set if creating new document
      },
      { upsert: true }
    );

    console.log(`Added ${tokensToAdd} tokens to user ${auth0Id}`);
    console.log('MongoDB result:', result);
    
    // Optional: Create a payment record
    await db.collection('payments').insertOne({
      userId: auth0Id,
      chargeId: charge.id,
      amount: amountPaid,
      currency: charge.currency,
      tokensAdded: tokensToAdd,
      date: new Date()
    });
    
  } finally {
    await client.close();
  }
}