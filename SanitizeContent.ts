import removeMd from "npm:remove-markdown@0.5.0";

const HEADING_REGEX = /^#+ .*$/;
const WIDGET_REGEX = /^\$\$widget\d(.*?\))\$\$$/;
const MARKDOWN_LINK_REGEX = /^\[(.*)\]\(.*\)$/;
const MARKDOWN_IMAGE_REGEX = /^!\[.*\]\(.*\)$/;
const CITATION_REGEX = /\[\\\[\d+\\\]\]\(#cite-id-[a-z0-9]+\)/gm;

const MAX_PARA_COUNT = 3;

export const sanitizeContent = (content: string) => {
  const contentParagraphs = content.split("\n  \n");

  const filteredParagraphs = contentParagraphs.filter((paragraph) => {
    paragraph = paragraph.trim();

    const isValidParagraph =
      paragraph.length !== 0 &&
      !paragraph.match(MARKDOWN_IMAGE_REGEX) &&
      !paragraph.match(MARKDOWN_LINK_REGEX) &&
      !paragraph.match(WIDGET_REGEX);

    return isValidParagraph;
  });

  const sanitizedParagraphs: string[] = [];
  let count = 0;

  filteredParagraphs.every((paragraph) => {
    if (count >= MAX_PARA_COUNT) return false;

    const trimmedParagraph = paragraph.trim();
    const plainTextParagraph = removeMd(trimmedParagraph);
    const sanitizedParagraph = plainTextParagraph.replace(CITATION_REGEX, "");
    const isHeading = HEADING_REGEX.test(trimmedParagraph);

    if (!isHeading) {
      sanitizedParagraphs.push(sanitizedParagraph);
      count++;
    } else sanitizedParagraphs.push(trimmedParagraph);

    return true;
  });

  return sanitizedParagraphs.join("\n\n");
};
