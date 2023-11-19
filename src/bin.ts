import { Client, Events, LocalAuth } from 'whatsapp-web.js';

import {
  startAgent,
  AgentOpenAI,
  AudioHandler,
  SpeechHandler,
  TextHandler,
  TranscribeHandler,
  defaultHandlers,
} from '.';

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

startAgent(client, {
  route: [
    {
      event: Events.MESSAGE_CREATE,
      handlers: defaultHandlers(new AgentOpenAI(AGENT_ID)),
    },
  ],
});
