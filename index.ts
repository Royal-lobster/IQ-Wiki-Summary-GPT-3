import { generateSummary } from "./generateSummary.ts";
import { sanitizeContent } from "./SanitizeContent.ts";

const ipfsURL =
  "https://ipfs.everipedia.org/ipfs/QmdJ7Q7BqknzMH9T1SLxddpQKkKY51w42TF5vxcJYvLhQZ";

const wiki = await (await fetch(ipfsURL)).json();
const content = wiki.content as string;
const input = sanitizeContent(content);
const title = wiki.title as string;
const isAboutPerson = wiki.categories[0].id === "people";
await generateSummary(input, title, isAboutPerson);
