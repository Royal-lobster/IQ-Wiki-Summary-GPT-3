import { load } from "https://deno.land/std@0.173.0/dotenv/mod.ts";

const configData = await load();

export const OPENAI_API_KEY = configData["OPENAI_API_KEY"];
export const COST_PER_1K_TOKENS = 0.02;
export const MAX_TRIES = 3;
