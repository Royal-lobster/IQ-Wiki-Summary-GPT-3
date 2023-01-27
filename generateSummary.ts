import {
  Configuration,
  OpenAIApi,
  CreateCompletionResponse,
} from "npm:openai@3.1.0";
import { MAX_TRIES, OPENAI_API_KEY } from "./constants.ts";
import { logExecutionSummary } from "./logGenerationSummary.ts";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: OPENAI_API_KEY,
  })
);

export const generateSummary = async (
  content: string,
  title: string,
  isAboutPerson = false
) => {
  let validChoices: string[] = [];
  let completion: { data: CreateCompletionResponse };
  let allGeneratedSummaries: string[] = [];
  let tries = 0;

  const prompt = `
  Content about ${title}:
  ${content} 
  
  Generate wikipedia style summary under 210 characters on topic "${
    isAboutPerson ? "who" : "what"
  } is ${title} ?".
`;

  do {
    tries++;

    completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      n: 3,
      max_tokens: 255,
    });

    const choices = completion.data.choices.map((c) => c.text as string);
    validChoices = choices.filter((c) => c.length <= 255);
    allGeneratedSummaries = [...allGeneratedSummaries, ...choices];
  } while (validChoices.length === 0 && tries <= MAX_TRIES);

  logExecutionSummary(content, allGeneratedSummaries, tries, completion);
  return validChoices.map((c) => c.trim().replaceAll("\\n", " "));
};
