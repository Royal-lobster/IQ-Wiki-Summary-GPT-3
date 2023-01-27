import { COST_PER_1K_TOKENS, MAX_TRIES } from "./constants.ts";
import { CreateCompletionResponse } from "npm:openai@3.1.0";

export const logExecutionSummary = (
  content: string,
  allGeneratedSummaries: string[],
  tries: number,
  completion: { data: CreateCompletionResponse }
) => {
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
};
