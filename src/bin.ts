import { Client, Events, LocalAuth } from 'whatsapp-web.js';
import { AgentFunction, Macros } from 's1-agents';

import { startAgent, defaultHandlers } from '.';
import { ZapAgent } from './openai';

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

type RandomNumberParameters = {
  min: number;
  max: number;
};

// Example Function
export class RandomNumber extends AgentFunction<RandomNumberParameters> {
  constructor() {
    super({
      name: 'random-number',
      description: 'Generate a random number between the given range',
      parameters: {
        type: 'object',
        properties: {
          min: {
            type: 'number',
            required: true,
            description: 'The minimum number to generate',
          },
          max: {
            type: 'number',
            required: true,
            description: 'The maximum number to generate',
          },
        },
      },

      log: true,
      schema: { output: true, path: './function-schemas' },
    });
  }

  async execute<R = RandomNumberParameters>(args: R): Promise<any> {
    const { min, max } = args as RandomNumberParameters;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `Your random number is ${randomNumber}`;
  }
}

startAgent(client, {
  route: [
    {
      event: Events.MESSAGE_CREATE,
      handlers: defaultHandlers(
        new ZapAgent({
          agentId: AGENT_ID,
          functions: [new RandomNumber()],
          log: true,
        })
      ),
    },
  ],
}).then(Macros.generateFunctionSchemas);
