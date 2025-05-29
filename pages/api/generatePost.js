import { OpenAIApi, Configuration } from "openai";


export default async function handler(req, res) {
  
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const topic = "cat ownership";
  const keywords = ["first-time cat owner", "cat training", "cat care tips"];
  // const prompt = `Write a blog post about ${topic} that includes the following keywords: ${keywords.join(", ")}.`;

  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `And we want to say something like, you are an SEO friendly blog post generator called Blog Standard.
        You are designed to output markdown without front matter.`
      },
      {
        role: "user",
        content: `Generate a blog post based on the following topic delimited by triple hyphens, 
        whith  a mininum of 100 words:
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens:
        ---
        ${keywords.join(", ")}
        ---`
      },
    ],
  });

  // console.log(response.data.choices[0]?.message?.content);

  res.status(200).json({postContent: response.data.choices[0]?.message?.content || "No content generated."});
}