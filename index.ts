import { generateSummary } from "./generateSummary.ts";
import { sanitizeContent } from "./SanitizeContent.ts";

const ipfsURL =
  "https://ipfs.everipedia.org/ipfs/QmZi8pYHsJVvHpdiv49mkdWahhEv3gEx7X5HGVVZWxzGed";

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
${summary}
`);
