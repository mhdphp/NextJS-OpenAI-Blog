import { OpenAIApi, Configuration } from "openai";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";


// wrapp the handler function with withApiAuthRequired to protect the API route - generate posts
// This will ensure that only authenticated users can access this API route
export default withApiAuthRequired(async function handler(req, res) {

  // get the user data from the session - Auth0
  const { user } = await getSession(req, res);
  // the user object is from Auth0 and contains user information
  // console.log("User: ", user);

  // connect to the MongoDB database
  const client = await clientPromise;
  const db = client.db("blogstandard");

  // find the user profile in the database using the auth0ID
  // auth0ID is the identifier recorded in the mongoDB database
  // and user.sub is the unique identifier for the user in Auth0
  const userProfile = await db.collection("users").findOne({auth0Id: user.sub});

  // if the user profile is not found, return an error
  if (!userProfile) {
      res.status(404).json({
        post: null,
        error: "User profile not found. Please contact support.",
      });
      return;
    }
  
  // console.log("User Profile: ", userProfile);

  // Check if the user has enough tokens to generate a post
    if (userProfile.availableTokens <= 0) {
      res.status(403).json({
        post: null,
        error: "You do not have enough tokens to generate a post. Please purchase more tokens.",
      });
      return;
    }
  
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  // first API call to generate the blog post content
  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an SEO friendly blog post generator called Blog Standard.
        You are designed to output markdown without front matter.`
      },
      {
        role: "user",
        content: `Generate a blog post based on the following topic, with subtitles, delimited by triple hyphens, 
        whith  a minimum of 100 words:
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens:
        ---
        ${keywords}
        ---`
      },
    ],
  });

  const postDoc = response.data.choices[0]?.message?.content || "No content generated.";

  // second API call to generate SEO friendly title and meta description
  const seoResponse = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an SEO friendly blog post generator called Blog Standard.
          Your are designed to output JSON. Do not include HTML tags in your response.`
        },
        {
          role: "user",
          content: `Create a SEO friendly title and meta description for the following blog post:
          ${postDoc}
          ---
          The output json should have the following format:
          {
            "title": "example title",
            "metaDescription": "example meta description"
          }
          ---
          The title should be less than 60 characters and the description should be less than 160 characters.
          The title should include the main keyword: ${keywords[1]}.
          The description should include the main keywords: ${keywords[1,2]}.
        `
        },
      ],
    });

    // console.log("SEO Response: ", seoResponse.data.choices[0]?.message?.content);
    const seoContent = seoResponse.data.choices[0]?.message?.content || "{}";

    const {title, metaDescription} = JSON.parse(seoContent);

    // console.log("SEO Content: ", {title, metaDescription});

    //decrease the user's available tokens by 2
    db.collection("users").updateOne({
      auth0Id: user.sub
    }, {
      $inc: { availableTokens: -2 } // Deduct one token for generating a post   
    }
    );

    // insert the generated post into the database
    const post = await db.collection("posts").insertOne({
      postDoc,
      title,
      metaDescription,
      topic,
      keywords,
      author: userProfile.email, // the name from the mongodb user profile
      userId: userProfile._id, // the id from the mongodb user profile
      createdAt: new Date()
    });

  
  // send the response back to the client
  res.status(200).json({
    post: { 
      postDoc, 
      title, 
      metaDescription 
    } 
  });
});