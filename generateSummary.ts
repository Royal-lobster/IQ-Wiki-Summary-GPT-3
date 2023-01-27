import { Configuration, OpenAIApi } from "npm:openai@3.1.0";
import { load } from "https://deno.land/std@0.173.0/dotenv/mod.ts";

const configData = await load();
const OPENAI_API_KEY = configData["OPENAI_API_KEY"];
const COST_PER_1K_TOKENS = 0.02;
const MAX_TRIES = 3;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateSummary = async (
  content: string,
  title: string,
  isAboutPerson = false
) => {
  let validChoices: string[] = [];
  let completion;
  let allGeneratedSummaries: string[] = [];
  let tries = 0;

  do {
    tries++;
    completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
      Content about ${title}:
      ${content} 
      
      Generate wikipedia style summary under 210 characters on topic "${
        isAboutPerson ? "who" : "what"
      } is ${title} ?".
    `,
      n: 3,
      max_tokens: 255,
    });

    const choices = completion.data.choices.map((c) => c.text as string);
    validChoices = choices.filter((c) => c.length <= 255);
    allGeneratedSummaries = [...allGeneratedSummaries, ...choices];
  } while (validChoices.length === 0 && tries <= MAX_TRIES);

  console.log(`
------------------------------
💨 Execution Summary:
------------------------------
📝 INPUT LENGTH: ${content.length}
📝 SUMMARY LENGTH: ${allGeneratedSummaries
    .map((c) => {
      const l = c.length || 0;
      return `${l}${l > 255 ? " (x)" : ""}`;
    })
    .join(" | ")}  (should be 255 max)
🔄 TRIES: ${tries} / ${MAX_TRIES}
🎟️ TOTAL TOKENS USED: ${completion.data.usage?.total_tokens}
🏦 TOTAL COST: $${
    ((completion.data.usage?.total_tokens || 0) * COST_PER_1K_TOKENS) / 1000
  }
`);
  return validChoices.map((c) => c.trim().replaceAll("\\n", " "));
};
