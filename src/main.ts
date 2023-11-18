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
client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);

  if (session) {
    Bun.write('./session.json', JSON.stringify(session, null, 2)).catch(
      (err) => {
        console.error('Error while save session', err);
      }
    );
  }
});

client.on('auth_failure', (session) => {
  console.log('AUTHENTICATION FAILURE', session);
});

client.on('ready', async () => {
  console.log('READY');

  pvChat = await client.getChatById(CHAT_ID);
});

client.on('message_create', async (msg) => {
  console.log('MESSAGE');

  await new Router(pvChat).manager.message(msg);
});

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...');
  await client.destroy();
  process.exit(0);
});
