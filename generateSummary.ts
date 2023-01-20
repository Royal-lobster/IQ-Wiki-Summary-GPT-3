import { Configuration, OpenAIApi } from "npm:openai@3.1.0";
import { load } from "https://deno.land/std@0.173.0/dotenv/mod.ts";

const configData = await load();
const OPENAI_API_KEY = configData["OPENAI_API_KEY"];
const COST_PER_1K_TOKENS = 0.02;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateSummary = async (
  content: string,
  title: string,
  isAboutPerson = false
) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `
      Content about ${title}:
      ${content} 
      Generate a generalized summary on topic "${
        isAboutPerson ? "who" : "what"
      } is ${title} ?". IT MUST BE UNDER 210 CHARACTERS.
    `,
    max_tokens: 255,
  });

  console.log(`
------------------------------
💨 Execution Summary:
------------------------------
📝 INPUT LENGTH: ${content.length}
📝 SUMMARY LENGTH: ${
    completion.data.choices[0].text?.length
  }  (should be 255 max)
🎟️ TOTAL TOKENS USED: ${completion.data.usage?.total_tokens}
🏦 TOTAL COST: $${
    ((completion.data.usage?.total_tokens || 0) * COST_PER_1K_TOKENS) / 1000
  }
  
`);
  return completion.data.choices[0].text;
};
