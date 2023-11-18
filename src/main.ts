import { Client, LocalAuth, Chat } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

import { chat } from './gpt';

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

  // Message should start with /gpt
  const shouldReply = msg.body.startsWith('/gpt');
  if (!shouldReply) return;

  const message = msg.body.replace('/gpt', '').trim();
  const gptResponse = await chat(message);

  pvChat?.sendMessage(gptResponse?.content ?? 'No response');
});
