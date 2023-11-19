import { Client, LocalAuth, Chat } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

import { Router } from './routes';

const CHAT_ID = process.env.CHAT_ID as string;

let pvChat: Chat;

export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/google-chrome',
    headless: true,
  },

  authStrategy: new LocalAuth(),
});

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

  pvChat = await client.getChatById(CHAT_ID);
});

client.on('message_create', async (msg) => {
  await new Router(pvChat).manager.message(msg);
});

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...');
  await client.destroy();
  process.exit(0);
});
