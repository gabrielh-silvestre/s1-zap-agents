export const GPT_MSG_IDENTIFIER = '[GPT]';
export const GPT_MSG_REGEX = (msg: string) =>
  new RegExp(`^${GPT_MSG_IDENTIFIER}`, 'g').test(msg);

export const BREAK_LINE_SYMBOL = '<bl>';
export const BREAK_LINE_REGEX = (
  line: string,
  symbol: string = BREAK_LINE_SYMBOL
) => new RegExp(symbol).test(line);

export const DEFAULT_PROMPT =
  'You are helpfull assistant that helps people with their problems by WhatsApp.';

export const DEFAULT_DIRECTIVES = (
  breakLineSymbol: string = BREAK_LINE_SYMBOL
) => [
  `Use "${breakLineSymbol}" to break the lines`,
  `Do not use "." to end a sentence, instead use "${breakLineSymbol}"`,
  `Do not break lines inside code blocks with "${breakLineSymbol}", use "\n" instead`,
  `Ensure that all code blocks are inside a markdown code block (\`\`\`code\`\`\`)`,
  `Do not use "${breakLineSymbol}" inside code blocks`,
  `Use "${breakLineSymbol}" instead of "." to end a sentence`,
];
