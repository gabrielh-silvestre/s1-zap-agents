import { Client, Events, LocalAuth } from 'whatsapp-web.js';

import { startAgent, AgentOpenAI, defaultHandlers } from '.';
import { AgentFunction } from './openai/function';

const AGENT_ID = process.env.AGENT_ID as string;
if (!AGENT_ID) throw new Error('$AGENT_ID is required');

export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_BIN,
    headless: true,
  },

  authStrategy: new LocalAuth(),
});

// Example Function
export class RandomNumber extends AgentFunction {
  constructor() {
    super('random-number', 'Generate a random number between the given range');
  }

  async execute(args: object): Promise<any> {
    const { min, max } = args as any;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

startAgent(client, {
  route: [
    {
      event: Events.MESSAGE_CREATE,
      handlers: defaultHandlers(
        new AgentOpenAI(AGENT_ID, [new RandomNumber()])
      ),
    },
  ],
});

/*
{
  "name": "random-number",
  "description": "Generate a random number between the given range",
  "parameters": {
    "type": "object",
    "properties": {
      "min": {
        "type": "number",
        "description": "The minimum number to generate"
      },
      "max": {
        "type": "number",
        "description": "The maximum number to generate"
      }
    },
  },
  "required": ["min", "max"],
}
*/
