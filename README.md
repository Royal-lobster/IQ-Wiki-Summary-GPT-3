# IQ-Wiki-Summary-GPT-3

Generates summary for wikis with GPT 3 with Deno and Open AI Nodejs library

## Usage

### Setup environment

Create a .env file with the following content:

```bash
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

### Change wiki ipfs url

go to index.ts and change ipfsURL of your desired wiki to generate summary for with GPT 3 davinci modal. You can modify the generation parameters in the generateSummary function in `generateSummary`.ts file

### To run the project

```bash
deno run --allow-net --allow-read --allow-write --allow-env index.ts
```

(or)

```bash
deno -A index.ts
```
