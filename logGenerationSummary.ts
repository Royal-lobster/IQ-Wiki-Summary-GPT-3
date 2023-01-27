import { COST_PER_1K_TOKENS, MAX_TRIES } from "./constants.ts";
import { CreateCompletionResponse } from "npm:openai@3.1.0";

export const logExecutionSummary = async (
  content: string,
  allGeneratedSummaries: string[],
  tries: number,
  completion: { data: CreateCompletionResponse }
) => {
  const summaryLengths = allGeneratedSummaries
    .map((c) => {
      const l = c.length || 0;
      return `${l}${l > 255 ? " (x)" : ""}`;
    })
    .join(" | ");
  const totalTokens = completion.data.usage?.total_tokens || 0;

  const totalCost = (totalTokens * COST_PER_1K_TOKENS) / 1000;

  const log = `
--------------------------------------------------
💨 Execution Summary: {${new Date().toISOString()}}
--------------------------------------------------
📝 INPUT LENGTH: ${content.length}
📝 SUMMARY LENGTH: ${summaryLengths}  (should be 255 max)
🔄 TRIES: ${tries} / ${MAX_TRIES}
🎟️ TOTAL TOKENS USED: ${totalTokens}
🏦 TOTAL COST: $${totalCost}

--------------------------------------------------
📙 Given Content:
--------------------------------------------------
${content}

--------------------------------------------------
📝 All Generated Summaries:
--------------------------------------------------
${allGeneratedSummaries.map((s) => `[${s.length} Chars] ${s}`).join("\n")}
  `;

  console.log(log);
  await Deno.writeTextFile("log.txt", log, { append: true });
};
