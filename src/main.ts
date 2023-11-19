import { Client, LocalAuth, Events } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

import { routerManagerFactory } from './routes';
import {
  HelpHandler,
  AudioHandler,
  CodeHandler,
  SpeechHandler,
} from './handlers';
import { RootHandler } from './handlers/root';
import { Agent } from './openai/agent';
import { AgentEnum } from './utils';

export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_BIN,
    headless: true,
  },

  authStrategy: new LocalAuth(),
});

routerManagerFactory(client, [
  {
    event: Events.MESSAGE_CREATE,
    handlers: [
      { handler: HelpHandler },
      { handler: AudioHandler, agent: new Agent(AgentEnum.audio) },
      { handler: CodeHandler, agent: new Agent(AgentEnum.code) },
      { handler: SpeechHandler, agent: new Agent(AgentEnum.audio) },
      { handler: RootHandler, agent: new Agent(AgentEnum.raw) },
    ],
  },
]);

console.log('Starting...');
client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', () => {
  console.log('AUTHENTICATION FAILURE');
});

client.on('ready', async () => {
  console.log('READY');
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

client.on('message', (msg) => {
  console.log('MESSAGE RECEIVED', msg.type);
});

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...');
  await client.destroy();
  process.exit(0);
});
