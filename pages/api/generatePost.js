import { OpenAIApi, Configuration } from "openai";


export default async function handler(req, res) {
  
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  // const topic = "cat ownership";
  // const keywords = ["first-time cat owner", "cat training", "cat care tips", "cat bioenergy"];
  // const prompt = `Write a blog post about ${topic} that includes the following keywords: ${keywords.join(", ")}.`;

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
        whith  a mininum of 250 words:
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

  // console.log(response.data.choices[0]?.message?.content);

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

  res.status(200).json({
    post: { 
      postDoc, 
      title, 
      metaDescription 
    } 
  });
}