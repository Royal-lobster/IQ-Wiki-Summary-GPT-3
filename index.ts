import { generateSummary } from "./generateSummary.ts";
import { sanitizeContent } from "./SanitizeContent.ts";

const ipfsURL =
  "https://ipfs.everipedia.org/ipfs/QmZw9dCDut294cG4Jvro5X3LzgBw9itevN7Vw1UXQaanvi";

const wiki = await (await fetch(ipfsURL)).json();
const content = wiki.content as string;
const input = sanitizeContent(content);
const title = wiki.title as string;
const isAboutPerson = wiki.categories[0].id === "people";
const summary = await generateSummary(input, title, isAboutPerson);

console.log(`
--------------------------------
📖 ORIGINAL INPUT:
--------------------------------
${input}

--------------------------------
📝 SUMMARY:
--------------------------------
${summary.map((s) => `[${s.length} Chars] ${s}`).join("\n\n")}
`);
